import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven hero wrapper for the arcade visual. Auto-scroll snap with a
 * configurable transition:
 *   - 'fade': the (interactive) arcade fades + scales out as you scroll.
 *   - 'boom': BOOM circle-collapse, with the arcade as the content.
 *
 * The arcade is interactive while at the top (progress ≈ 0); pointer events are
 * released during the transition so scrolling isn't blocked.
 * Pair with a content block pulled up by `margin-top: -100vh` so it is revealed.
 */

const SCROLL_HEIGHT = '500vh';
const AUTO_SCROLL_DURATION = 700;
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 1);

type Props = {
	variant: 'fade' | 'boom';
	/** Hero rendered inside the scroll/transition shell. */
	children: React.ReactNode;
};

const ArcadeHeroScroll: React.FC<Props> = ({ variant, children }) => {
	const hero = children;
	const containerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	const isAutoScrolling = useRef<'down' | 'up' | null>(null);
	const isActiveRef = useRef(false);
	const pendingScrollRef = useRef(false);
	const rafIdRef = useRef<number | null>(null);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		let lastY = window.scrollY;

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
			window.addEventListener('keydown', preventDefaultForScrollKeys as any, { passive: false });
		};

		const unlockScroll = () => {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			window.removeEventListener('wheel', preventDefault);
			window.removeEventListener('touchmove', preventDefault);
			window.removeEventListener('keydown', preventDefaultForScrollKeys as any);
		};

		const triggerCustomScroll = (targetY: number, duration: number) => {
			let startTime: number | null = null;
			let startY: number | null = null;
			let distance = 0;
			lockScroll();
			const step = (timestamp: number) => {
				if (startTime === null) {
					startTime = timestamp;
					startY = window.scrollY;
					distance = targetY - startY;
				}
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);
				window.scrollTo(0, startY! + distance * easeOutQuint(progress));
				if (progress < 1) {
					requestAnimationFrame(step);
				} else {
					window.scrollTo(0, targetY);
					unlockScroll();
					setTimeout(() => {
						isAutoScrolling.current = null;
					}, 100);
				}
			};
			requestAnimationFrame(step);
		};

		// Per-frame visual update (no React) — keeps the transition at 60fps.
		const updateOverlayDOM = (progress: number) => {
			const overlay = overlayRef.current;
			if (!overlay) return;
			overlay.style.pointerEvents = progress < 0.02 ? 'auto' : 'none';
			if (variant === 'boom') {
				const size = Math.max(100 - progress * 110, 0);
				overlay.style.clipPath = `circle(${size}% at 50% 50%)`;
				const inner = innerRef.current;
				if (inner) inner.style.opacity = String(Math.min(Math.max((size - 10) / 30, 0), 1));
			} else {
				overlay.style.opacity = String(Math.max(1 - progress * 1.15, 0));
				overlay.style.transform = `scale(${1 - progress * 0.12}) translateY(${progress * -4}vh)`;
			}
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

			if (!isAutoScrolling.current) {
				if (deltaY > 0 && scrollY > scrollStart + 20 && scrollY < scrollEnd - exact100vh * 0.1) {
					isAutoScrolling.current = 'down';
					triggerCustomScroll(scrollEnd, AUTO_SCROLL_DURATION);
				} else if (deltaY < 0 && scrollY < scrollEnd - 10 && scrollY > scrollStart + exact100vh * 0.1) {
					isAutoScrolling.current = 'up';
					triggerCustomScroll(scrollStart, AUTO_SCROLL_DURATION);
				}
			}

			// isAutoScrolling is cleared solely by triggerCustomScroll's own completion
			// (elapsed time), not here by position — this used to also clear early
			// whenever scrollY got within 10px of the target, which for short auto-scroll
			// distances happened before the 700ms animation's own rAF loop finished. That
			// left a window where the flag was clear but the old scrollTo loop was still
			// running, letting a second triggerCustomScroll fire and fight the first one
			// every frame (visible as a repeated stutter/snap-back on scroll).

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
			unlockScroll();
		};
	}, [variant]);

	return (
		<div ref={containerRef} style={{ height: SCROLL_HEIGHT, position: 'relative' }}>
			{isActive &&
				(variant === 'boom' ? (
					<div
						ref={overlayRef}
						style={{ position: 'fixed', inset: 0, zIndex: 40, background: '#0d0e12', clipPath: 'circle(100% at 50% 50%)', overflow: 'hidden', willChange: 'clip-path' }}
					>
						<div ref={innerRef} style={{ width: '100%', height: '100%', opacity: 1 }}>
							{hero}
						</div>
					</div>
				) : (
					<div
						ref={overlayRef}
						style={{ position: 'fixed', inset: 0, zIndex: 40, overflow: 'hidden', transformOrigin: '50% 42%', willChange: 'opacity, transform' }}
					>
						{hero}
					</div>
				))}
		</div>
	);
};

export default ArcadeHeroScroll;
