import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven hero wrapper for the arcade visual (BOOM circle-collapse).
 * Used only by the /lab/arcade-hero-scroll experiment page (see
 * HeroLabPage.tsx) — the live homepage stays on the plain layout (see
 * HomePage.tsx).
 *
 * The arcade is interactive while at the top (progress ≈ 0); pointer events
 * are released during the transition so scrolling isn't blocked. `content`
 * renders after the hero, pulled up by `margin-top: -100vh` so it's revealed
 * right as the transition completes — same composition the original shipped
 * homepage used.
 *
 * A slight scroll nudge locks user input (wheel/touch/key) and drives the
 * whole transition itself via window.scrollTo(), so it plays as one
 * committed cut instead of something scrubbed by hand. This exact approach
 * shipped once already and caused real scroll-lock bugs in production
 * (stutter, then a full scroll block) — this rebuild keeps the same
 * mechanism (that "locked, plays itself" feel is the actual requirement) but
 * fixes the specific bugs that caused it:
 *   - "In flight" used to be tracked by a flag cleared from two places: a
 *     scroll-position check in the scroll handler, and a time-based check
 *     inside the scrollTo loop. Since the loop's own scrollTo() calls fire
 *     native `scroll` events, the position check could clear the flag while
 *     the time-based loop was still running, letting a second scroll
 *     animation start while the first was still driving scrollTo — two
 *     loops fighting over the scroll position. Fixed with a single
 *     animation-generation token: each run gets an id, every frame checks
 *     it's still current before continuing, and only that run's own
 *     start/end ever touch the "in flight" flag.
 *   - `easeOutQuint` had its exponent written as 1 (linear), not 5.
 *   - Added a watchdog: whatever goes wrong, input unlocks within
 *     duration + WATCHDOG_GRACE_MS no matter what, so a bug here can't
 *     permanently block scrolling again.
 *   - Mobile momentum (esp. iOS Safari) can keep the page moving briefly
 *     even after overflow:hidden + preventDefault() are active, since that's
 *     handled by the compositor ahead of JS — the lock alone can't fully
 *     stop it. A short correction check after unlock snaps back to the
 *     target if residual momentum carried past it. Reduces, doesn't
 *     guarantee against, a little mobile overshoot.
 */

const SCROLL_HEIGHT = '500vh';
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

	const [isActive, setIsActive] = useState(false);

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

		// Only ever called for the current animation id — see the `myId` guards
		// at each call site. Single place that ends a run: unlocks, clears the
		// "in flight" flag, and disarms the watchdog that would otherwise also
		// call this.
		const finishAnimation = (myId: number, targetY: number) => {
			if (animationIdRef.current !== myId) return;
			window.scrollTo(0, targetY);
			unlockScroll();
			isAnimatingRef.current = false;
			if (watchdogId !== null) {
				window.clearTimeout(watchdogId);
				watchdogId = null;
			}
			// Mobile momentum (esp. iOS Safari) can still be carrying the page
			// briefly even after unlock — one late correction if it drifted.
			window.setTimeout(() => {
				if (animationIdRef.current !== myId) return;
				if (Math.abs(window.scrollY - targetY) > 2) window.scrollTo(0, targetY);
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
				window.scrollTo(0, startY + distance * easeOutQuint(progress));
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

			if (!isAnimatingRef.current) {
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
			<div ref={containerRef} style={{ height: SCROLL_HEIGHT, position: 'relative' }}>
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
