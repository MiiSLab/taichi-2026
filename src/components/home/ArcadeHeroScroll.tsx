import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-snap-driven hero wrapper for the arcade visual. Used only by the
 * /lab/arcade-hero-scroll experiment page (see HeroLabPage.tsx) — the live
 * homepage stays on the plain, non-hijacked layout (see HomePage.tsx).
 *
 *   - 'fade': the (interactive) arcade fades + scales out as you scroll.
 *   - 'boom': BOOM circle-collapse, with the arcade as the content.
 *
 * The arcade is interactive while at the top (progress ≈ 0); pointer events
 * are released during the transition so scrolling isn't blocked. `content`
 * renders immediately after as the second snap target — no manual spacer/
 * margin math needed, the two targets just stack.
 *
 * "Auto-completes on a slight scroll nudge" used to be hand-rolled: a JS loop
 * driving window.scrollTo() while blocking wheel/touch/key input. That fought
 * the browser's own scroll handling directly and could get stuck (see git
 * history on this file from before this rewrite — two targeted patches on
 * that mechanism still weren't enough to make it reliable). This version
 * leaves the "snap to the nearest point once you let go" behaviour entirely
 * to the browser via CSS scroll-snap-type, which can't race because there's
 * no script driving the scroll position. Progress within the hero (for the
 * circle-collapse/fade visual) is still a plain function of scroll position.
 */

const REVEAL_HEIGHT_VH = 400;

type Props = {
	variant: 'fade' | 'boom';
	/** Hero rendered inside the snap/transition shell (first snap target). */
	hero: React.ReactNode;
	/** Rendered immediately after the hero, as the second snap target. */
	content: React.ReactNode;
};

const ArcadeHeroScroll: React.FC<Props> = ({ variant, hero, content }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	const isActiveRef = useRef(false);
	const pendingScrollRef = useRef(false);
	const rafIdRef = useRef<number | null>(null);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		// Scoped to this page only: on while mounted, restored on unmount so it
		// never leaks into other routes.
		const root = document.documentElement;
		const previous = root.style.scrollSnapType;
		root.style.scrollSnapType = 'y mandatory';
		return () => {
			root.style.scrollSnapType = previous;
		};
	}, []);

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
			const scrollStart = container.offsetTop;
			const scrollEnd = scrollStart + container.offsetHeight;
			const scrollY = window.scrollY;

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
		<>
			<div
				ref={containerRef}
				style={{ height: `${REVEAL_HEIGHT_VH}vh`, position: 'relative', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
			>
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
			<div style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>{content}</div>
		</>
	);
};

export default ArcadeHeroScroll;
