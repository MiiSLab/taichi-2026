import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven hero wrapper for the arcade visual. Purely scroll-linked
 * transition:
 *   - 'fade': the (interactive) arcade fades + scales out as you scroll.
 *   - 'boom': BOOM circle-collapse, with the arcade as the content.
 *
 * The arcade is interactive while at the top (progress ≈ 0); pointer events are
 * released during the transition so scrolling isn't blocked.
 * Pair with a content block pulled up by `margin-top: -100vh` so it is revealed.
 *
 * This used to also auto-snap-complete the transition (locking native scroll
 * and driving it via a timed window.scrollTo loop) once the user nudged past a
 * threshold. That JS-driven scrollTo, the native scroll events it triggered,
 * and the wheel/touch/key blocking were all fighting over the same scroll
 * position at once, which proved too fragile — even after fixing one specific
 * race, it could still end up re-entering mid-animation and snapping back to
 * the top, blocking scroll entirely. Progress is now a direct function of
 * scroll position with no programmatic scrolling, so it can't get stuck.
 */

const SCROLL_HEIGHT = '500vh';

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

	const isActiveRef = useRef(false);
	const pendingScrollRef = useRef(false);
	const rafIdRef = useRef<number | null>(null);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
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

			const scrollStart = containerTop;
			const scrollEnd = containerTop + containerH - exact100vh;

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
