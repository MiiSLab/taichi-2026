import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven hero wrapper for the arcade visual (BOOM circle-collapse).
 * Used only by the /lab/arcade-hero-scroll experiment page (see
 * HeroLabPage.tsx) — the live homepage stays on the plain layout (see
 * HomePage.tsx).
 *
 * Desktop and mobile intentionally behave differently:
 *   - Desktop: a slight scroll nudge locks input (wheel/key) and drives the
 *     whole transition itself via window.scrollTo(), so it plays as one
 *     committed cut (see the mechanism notes below).
 *   - Mobile: no lock, no auto-scroll. The circle-collapse is purely
 *     scrubbed by the user's own scroll position — wherever they scroll to
 *     is exactly how much of the transition shows. This sidesteps a
 *     platform limitation rather than fighting it: mobile inertial/momentum
 *     scrolling is handled by the browser compositor ahead of JS, so a
 *     JS-driven scroll lock can never fully own the scroll position there
 *     the way it reliably can with a desktop mouse/trackpad wheel. Since the
 *     lock is never engaged on mobile at all, mobile is now categorically
 *     immune to the stuck-scroll failure mode that hit production earlier.
 *   Breakpoint matches NewArcadeHero's own MOBILE_BP (1024px) — duplicated
 *   here rather than imported since NewArcadeHero is a delivered/ported
 *   component this file shouldn't need to modify.
 *
 * The arcade is interactive while at the top (progress ≈ 0); pointer events
 * are released during the transition so scrolling isn't blocked. `content`
 * renders after the hero, pulled up by `margin-top: -100vh` so it's revealed
 * right as the transition completes — same composition the original shipped
 * homepage used, for both the desktop (500vh) and mobile (shorter) runway.
 *
 * Desktop mechanism notes (unchanged from the previous rebuild): "in flight"
 * is tracked with a single animation-generation token (each run gets an id,
 * every frame checks it's still current before continuing) rather than a
 * flag cleared from two different places — that dual-clear was the actual
 * cause of the earlier stutter/snap-to-top bugs. A watchdog guarantees input
 * unlocks within duration + WATCHDOG_GRACE_MS no matter what goes wrong, and
 * a short post-unlock correction check snaps back if anything (e.g. a
 * trackpad's own momentum) carried the page past the target. `easeOutQuint`
 * also had its exponent written as 1 (linear), not 5 — fixed.
 */

const MOBILE_BP = 1024;

const DESKTOP_SCROLL_HEIGHT_VH = 500; // effective auto-scroll runway = 400vh
const MOBILE_REVEAL_VH = 100; // physical scroll distance to scrub through fully
const MOBILE_SCROLL_HEIGHT_VH = MOBILE_REVEAL_VH + 100; // +100vh: same buffer trick as desktop

const AUTO_SCROLL_DURATION = 700;
const WATCHDOG_GRACE_MS = 800;
const CORRECTION_CHECK_MS = 150;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

type Props = {
	/** Hero rendered inside the scroll/transition shell. */
	hero: React.ReactNode;
	/** Rendered after the hero, pulled up to appear right as the transition ends. */
	content: React.ReactNode;
};

const ArcadeHeroScroll: React.FC<Props> = ({ hero, content }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	const isAnimatingRef = useRef(false);
	const animationIdRef = useRef(0);
	const isActiveRef = useRef(false);
	const pendingScrollRef = useRef(false);
	const rafIdRef = useRef<number | null>(null);
	const isMobileRef = useRef(window.innerWidth < MOBILE_BP);

	const [isActive, setIsActive] = useState(false);
	const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BP);

	useEffect(() => {
		const update = () => {
			const next = window.innerWidth < MOBILE_BP;
			isMobileRef.current = next;
			setIsMobile(next);
		};
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	useEffect(() => {
		let lastY = window.scrollY;
		let watchdogId: number | null = null;

		const preventDefault = (e: Event) => e.preventDefault();
		const preventDefaultForScrollKeys = (e: KeyboardEvent) => {
			if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) e.preventDefault();
		};

		const lockScroll = () => {
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
			if (scrollBarWidth > 0 && !document.body.style.paddingRight) document.body.style.paddingRight = `${scrollBarWidth}px`;
			document.body.style.overflow = 'hidden';
			window.addEventListener('wheel', preventDefault, { passive: false });
			window.addEventListener('touchmove', preventDefault, { passive: false });
			window.addEventListener('keydown', preventDefaultForScrollKeys as EventListener, { passive: false });
		};

		const unlockScroll = () => {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			window.removeEventListener('wheel', preventDefault);
			window.removeEventListener('touchmove', preventDefault);
			window.removeEventListener('keydown', preventDefaultForScrollKeys as EventListener);
		};

		// html has `scroll-behavior: smooth` (see styles.css, for anchor-link
		// nav). window.scrollTo(x, y) with no explicit behavior inherits that,
		// so every per-frame call below would kick off the browser's OWN ~300ms
		// smooth-scroll and get retargeted before it finishes — the animation
		// loop needs to be the only thing driving position, so every scrollTo it
		// does must explicitly bypass CSS scroll-behavior.
		const scrollToInstant = (y: number) => window.scrollTo({ top: y, left: 0, behavior: 'instant' });

		// Desktop-only (see the trigger check in processScroll below). Only ever
		// called for the current animation id — single place that ends a run:
		// unlocks, clears the "in flight" flag, disarms the watchdog.
		const finishAnimation = (myId: number, targetY: number) => {
			if (animationIdRef.current !== myId) return;
			scrollToInstant(targetY);
			unlockScroll();
			isAnimatingRef.current = false;
			if (watchdogId !== null) {
				window.clearTimeout(watchdogId);
				watchdogId = null;
			}
			// A trackpad's own momentum can still be carrying the page briefly
			// even after unlock — one late correction if it drifted.
			window.setTimeout(() => {
				if (animationIdRef.current !== myId) return;
				if (Math.abs(window.scrollY - targetY) > 2) scrollToInstant(targetY);
			}, CORRECTION_CHECK_MS);
		};

		const triggerCustomScroll = (targetY: number, duration: number) => {
			const myId = ++animationIdRef.current;
			isAnimatingRef.current = true;
			let startTime: number | null = null;
			let startY = 0;
			let distance = 0;
			lockScroll();

			// Last-resort safety net: no matter what else goes wrong, input is
			// guaranteed to unlock instead of staying stuck like the original bug.
			watchdogId = window.setTimeout(() => finishAnimation(myId, targetY), duration + WATCHDOG_GRACE_MS);

			const step = (timestamp: number) => {
				if (animationIdRef.current !== myId) return; // superseded — stop silently
				if (startTime === null) {
					startTime = timestamp;
					startY = window.scrollY;
					distance = targetY - startY;
				}
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);
				scrollToInstant(startY + distance * easeOutQuint(progress));
				if (progress < 1) {
					requestAnimationFrame(step);
				} else {
					finishAnimation(myId, targetY);
				}
			};
			requestAnimationFrame(step);
		};

		// Per-frame visual update (no React) — keeps the transition at 60fps.
		const updateOverlayDOM = (progress: number) => {
			const overlay = overlayRef.current;
			if (!overlay) return;
			overlay.style.pointerEvents = progress < 0.02 ? 'auto' : 'none';
			const size = Math.max(100 - progress * 110, 0);
			overlay.style.clipPath = `circle(${size}% at 50% 50%)`;
			const inner = innerRef.current;
			if (inner) inner.style.opacity = String(Math.min(Math.max((size - 10) / 30, 0), 1));
		};

		const processScroll = () => {
			pendingScrollRef.current = false;
			if (!containerRef.current) return;
			const container = containerRef.current;
			const containerTop = container.offsetTop;
			const containerH = container.offsetHeight;
			const exact100vh = window.innerHeight;
			const scrollY = window.scrollY;
			const deltaY = scrollY - lastY;
			lastY = scrollY;

			const scrollStart = containerTop;
			const scrollEnd = containerTop + containerH - exact100vh;

			// Locked auto-scroll is desktop-only — on mobile the transition is
			// purely scrubbed by the user's own scroll position below, no trigger.
			if (!isAnimatingRef.current && !isMobileRef.current) {
				if (deltaY > 0 && scrollY > scrollStart + 20 && scrollY < scrollEnd - exact100vh * 0.1) {
					triggerCustomScroll(scrollEnd, AUTO_SCROLL_DURATION);
				} else if (deltaY < 0 && scrollY < scrollEnd - 10 && scrollY > scrollStart + exact100vh * 0.1) {
					triggerCustomScroll(scrollStart, AUTO_SCROLL_DURATION);
				}
			}

			let progress: number;
			let nowActive: boolean;
			if (scrollY >= scrollStart && scrollY <= scrollEnd) {
				nowActive = true;
				progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
			} else {
				nowActive = false;
				progress = scrollY < scrollStart ? 0 : 1;
			}

			if (nowActive !== isActiveRef.current) {
				isActiveRef.current = nowActive;
				setIsActive(nowActive);
			}
			if (nowActive) updateOverlayDOM(progress);
		};

		const handleScroll = () => {
			if (pendingScrollRef.current) return;
			pendingScrollRef.current = true;
			rafIdRef.current = requestAnimationFrame(processScroll);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		const initTimeout = window.setTimeout(handleScroll, 100);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
			window.clearTimeout(initTimeout);
			if (watchdogId !== null) window.clearTimeout(watchdogId);
			animationIdRef.current++; // supersede any in-flight loop so its next frame no-ops
			unlockScroll();
		};
	}, []);

	return (
		<>
			<div ref={containerRef} style={{ height: `${isMobile ? MOBILE_SCROLL_HEIGHT_VH : DESKTOP_SCROLL_HEIGHT_VH}vh`, position: 'relative' }}>
				{isActive && (
					<div
						ref={overlayRef}
						style={{ position: 'fixed', inset: 0, zIndex: 40, background: '#0d0e12', clipPath: 'circle(100% at 50% 50%)', overflow: 'hidden', willChange: 'clip-path' }}
					>
						<div ref={innerRef} style={{ width: '100%', height: '100%', opacity: 1 }}>
							{hero}
						</div>
					</div>
				)}
			</div>
			<div className='w-full' style={{ marginTop: '-100vh' }}>
				{content}
			</div>
		</>
	);
};

export default ArcadeHeroScroll;
