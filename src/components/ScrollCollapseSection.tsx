import React, { useEffect, useRef, useState } from 'react';
import HomeHeroIntro from './home/HomeHeroIntro';

/**
 * ScrollCollapseSection
 *
 * A tall scroll-space section. As the user scrolls through it, a full-screen
 * lime overlay shrinks via `clip-path: circle(X%)` from 100% → 0%.
 * When fully collapsed (tiny circle), a clickable "BOOM" button appears in
 * the centre; clicking it navigates to /cfp.
 *
 * Place this component between sections of HomePage to create a dramatic
 * scroll-driven transition.
 *
 * --- Performance notes ---
 * Scroll is a high-frequency event. To avoid React reconciliation thrash:
 *   • circleSize is held in a ref, and the lime overlay's clip-path is
 *     written directly to the DOM each frame (no setState during scroll).
 *   • setIsActive only fires when the boolean flips at boundary entry/exit,
 *     not every frame.
 *   • onProgress and scrollProgressOverride into HomeHeroIntro are throttled
 *     to ~10 fps so the embedded Three.js scene doesn't re-render on every
 *     wheel tick. The visual still updates every frame because the lime
 *     clip-path itself is purely DOM.
 *   • All scroll-triggered work is batched into a single rAF callback.
 */

const SCROLL_HEIGHT = '500vh'; // vertical "depth" for the animation

// 這裡可以設定自動跑完的總秒數（單位：毫秒），數字越大代表越慢！
const AUTO_SCROLL_DURATION = 700;

// 設定這個動畫的「滑動退場指數」(Ease-Out Rate)
// 數字越大 -> 開頭爆發越快 -> 後半段極其緩慢的煞車感
export const EASE_RATE = 1;
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, EASE_RATE);

// Throttle interval for parent / Three.js updates (ms). 90ms ≈ 11fps which is
// plenty for hologram scene fade calculations and avoids cascading React
// re-renders down through HomeHeroIntro → HeroHologramBackground.
const PROGRESS_EMIT_INTERVAL_MS = 90;

interface Props {
	/** Reports pure animation progress (0–1) and whether the animation is active. */
	onProgress?: (progress: number, isActive: boolean) => void;
}

const ScrollCollapseSection: React.FC<Props> = ({ onProgress }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	const isAutoScrolling = useRef<'down' | 'up' | null>(null);
	const isActiveRef = useRef(false);
	const onProgressRef = useRef(onProgress);
	const lastProgressEmitRef = useRef(0);
	const pendingScrollRef = useRef(false);
	const rafIdRef = useRef<number | null>(null);

	const [isActive, setIsActive] = useState(false);
	// throttledProgress only updates ~11fps so HomeHeroIntro / Three.js don't
	// re-render every frame. The lime clip-path itself is updated every frame
	// via direct DOM mutation in updateOverlayDOM.
	const [throttledProgress, setThrottledProgress] = useState(0);

	// Keep callback ref fresh without retriggering the mount effect.
	useEffect(() => {
		onProgressRef.current = onProgress;
	}, [onProgress]);

	useEffect(() => {
		let lastY = window.scrollY;

		const preventDefault = (e: Event) => e.preventDefault();
		const preventDefaultForScrollKeys = (e: KeyboardEvent) => {
			if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
				e.preventDefault();
			}
		};

		const lockScroll = () => {
			// 強制停止手機版的慣性滾動 (Momentum Scrolling) 且避免桌機版隱藏捲軸造成的寬度跳動
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
			if (scrollBarWidth > 0 && !document.body.style.paddingRight) {
				document.body.style.paddingRight = `${scrollBarWidth}px`;
			}
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
				const ease = easeOutQuint(progress);

				window.scrollTo(0, startY! + distance * ease);

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

		// Direct DOM update — keeps the visual at 60fps without React reconciliation.
		const updateOverlayDOM = (size: number) => {
			const overlay = overlayRef.current;
			const inner = innerRef.current;
			if (overlay) overlay.style.clipPath = `circle(${size}% at 50% 50%)`;
			if (inner) {
				const opacity = Math.min(Math.max((size - 10) / 30, 0), 1);
				inner.style.opacity = String(opacity);
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

			// 1) Auto Scroll Trigger Logic
			if (!isAutoScrolling.current) {
				if (deltaY > 0 && scrollY > scrollStart + 20 && scrollY < scrollEnd - exact100vh * 0.1) {
					isAutoScrolling.current = 'down';
					triggerCustomScroll(scrollEnd, AUTO_SCROLL_DURATION);
				} else if (deltaY < 0 && scrollY < scrollEnd - 10 && scrollY > scrollStart + exact100vh * 0.1) {
					isAutoScrolling.current = 'up';
					triggerCustomScroll(scrollStart, AUTO_SCROLL_DURATION);
				}
			}

			// 2) Auto Scroll Release Logic
			if (isAutoScrolling.current === 'down' && scrollY >= scrollEnd - 10) {
				isAutoScrolling.current = null;
			} else if (isAutoScrolling.current === 'up' && scrollY <= scrollStart + 10) {
				isAutoScrolling.current = null;
			}

			// 3) Animation State Logic — DOM-direct path
			let progress: number;
			let nowActive: boolean;
			let size: number;
			if (scrollY >= scrollStart && scrollY <= scrollEnd) {
				nowActive = true;
				progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
				size = Math.max(100 - progress * 110, 0);
			} else {
				nowActive = false;
				progress = scrollY < scrollStart ? 0 : 1;
				size = scrollY < scrollStart ? 100 : 0;
			}

			// Boundary state — fires React update only when active flag flips.
			if (nowActive !== isActiveRef.current) {
				isActiveRef.current = nowActive;
				setIsActive(nowActive);
			}

			// Per-frame visual update — no React involved.
			if (nowActive) updateOverlayDOM(size);

			// Throttle parent / hologram updates to keep React tree work down.
			const now = performance.now();
			if (now - lastProgressEmitRef.current >= PROGRESS_EMIT_INTERVAL_MS) {
				lastProgressEmitRef.current = now;
				setThrottledProgress(progress);
				onProgressRef.current?.(progress, nowActive);
			}
		};

		// rAF batch — collapse multiple scroll events per frame into one process call.
		const handleScroll = () => {
			if (pendingScrollRef.current) return;
			pendingScrollRef.current = true;
			rafIdRef.current = requestAnimationFrame(processScroll);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		// Run once on mount to establish base
		const initTimeout = window.setTimeout(handleScroll, 100);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
			window.clearTimeout(initTimeout);
			unlockScroll();
		};
	}, []);

	return (
		<div ref={containerRef} style={{ height: SCROLL_HEIGHT, position: 'relative' }}>
			{isActive && (
				<div
					ref={overlayRef}
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 40, // below navbar (z-50)
						background: '#a8f020',
						clipPath: 'circle(100% at 50% 50%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						pointerEvents: 'none',
						overflow: 'hidden',
						willChange: 'clip-path',
					}}
				>
					<div ref={innerRef} style={{ width: '100%', height: '100%', opacity: 1 }}>
						<HomeHeroIntro layout='embedded' scrollProgressOverride={throttledProgress} />
					</div>
				</div>
			)}
		</div>
	);
};

export default ScrollCollapseSection;
