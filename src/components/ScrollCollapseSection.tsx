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
 */

const SCROLL_HEIGHT = '500vh'; // vertical "depth" for the animation

// 這裡可以設定自動跑完的總秒數（單位：毫秒），數字越大代表越慢！
const AUTO_SCROLL_DURATION = 700;

// 設定這個動畫的「滑動退場指數」(Ease-Out Rate)
// 數字越大 -> 開頭爆發越快 -> 後半段極其緩慢的煞車感
export const EASE_RATE = 1;
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, EASE_RATE);

interface Props {
	/** Reports pure animation progress (0–1) and whether the animation is active. */
	onProgress?: (progress: number, isActive: boolean) => void;
}

const ScrollCollapseSection: React.FC<Props> = ({ onProgress }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [circleSize, setCircleSize] = useState(100);
	const [isActive, setIsActive] = useState(false);

	const isAutoScrolling = useRef<'down' | 'up' | null>(null);

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
			window.removeEventListener('keydown', preventDefaultForScrollKeys as any); // Remove with same casting
		};

		const triggerCustomScroll = (targetY: number, duration: number) => {
			let startTime: number | null = null;
			let startY: number | null = null;
			let distance = 0;

			lockScroll();

			const step = (timestamp: number) => {
				if (startTime === null) {
					startTime = timestamp;
					// 為了避免和手機原生的高速慣性滾動「打架」產生回朔感，
					// 必須在「動畫要畫出第一幀的那一刻」才去撈取精準的 y 軸，而不是上個月步的舊座標。
					startY = window.scrollY;
					distance = targetY - startY;
				}

				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// 這裡單純驅動「網頁物理往下捲動」的平滑程度
				const ease = easeOutQuint(progress);

				window.scrollTo(0, startY! + distance * ease);

				if (progress < 1) {
					requestAnimationFrame(step);
				} else {
					window.scrollTo(0, targetY);
					unlockScroll();
					// 給予緩衝時間防止立刻連續觸發
					setTimeout(() => {
						isAutoScrolling.current = null;
					}, 100);
				}
			};
			requestAnimationFrame(step);
		};

		const handleScroll = () => {
			if (!containerRef.current) return;

			const container = containerRef.current;
			const containerTop = container.offsetTop; // px from page top
			const containerH = container.offsetHeight; // exactly height based on CSS
			// Calculate true pure 100vh matching the CSS exactly, to avoid mobile address bar jitter
			const exact100vh = window.innerHeight;
			const scrollY = window.scrollY;
			const deltaY = scrollY - lastY;
			lastY = scrollY;

			// We animate while the section is "in view" as a scroll target
			const scrollStart = containerTop; // circle starts shrinking
			const scrollEnd = containerTop + containerH - exact100vh; // circle finishes perfectly aligned with next block

			// 1) Auto Scroll Trigger Logic
			// If we are not currently auto-scrolling
			if (!isAutoScrolling.current) {
				// Scrolling DOWN into the zone (triggered after passing a few pixels into it)
				if (deltaY > 0 && scrollY > scrollStart + 20 && scrollY < scrollEnd - exact100vh * 0.1) {
					isAutoScrolling.current = 'down';
					triggerCustomScroll(scrollEnd, AUTO_SCROLL_DURATION);
				}
				// Scrolling UP into the zone from below
				else if (deltaY < 0 && scrollY < scrollEnd - 10 && scrollY > scrollStart + exact100vh * 0.1) {
					isAutoScrolling.current = 'up';
					triggerCustomScroll(scrollStart, AUTO_SCROLL_DURATION);
				}
			}

			// 2) Auto Scroll Release Logic
			// Release the lock when we reach the target or aggressively scroll past it
			if (isAutoScrolling.current === 'down' && scrollY >= scrollEnd - 10) {
				isAutoScrolling.current = null;
			} else if (isAutoScrolling.current === 'up' && scrollY <= scrollStart + 10) {
				isAutoScrolling.current = null;
			}

			// 3) Animation State Logic
			if (scrollY >= scrollStart && scrollY <= scrollEnd) {
				setIsActive(true);
				// 定義真實的捲動進度 0~1 (因為 window.scrollTo 已經被 CustomScroll 加速過，這進度自動帶有 Ease 效果！)
				const progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);

				const size = Math.max(100 - progress * 110, 0);
				setCircleSize(size);

				// 輸出純淨的進度 (0~1) 讓 HomePage 自由發揮
				onProgress?.(progress, true);
			} else {
				setIsActive(false);
				const progress = scrollY < scrollStart ? 0 : 1;
				const size = scrollY < scrollStart ? 100 : 0;
				setCircleSize(size);
				onProgress?.(progress, false);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		// Run once on mount to establish base
		setTimeout(handleScroll, 100);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			unlockScroll(); // Ensure scroll is unlocked when component unmounts
		};
	}, []);

	return (
		<div ref={containerRef} style={{ height: SCROLL_HEIGHT, position: 'relative' }}>
			{/* Full-screen lime overlay — only renders when we are scrolling through the section */}
			{isActive && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 40, // below navbar (z-50)
						background: '#a8f020',
						clipPath: `circle(${circleSize}% at 50% 50%)`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						pointerEvents: 'none',
						overflow: 'hidden',
					}}
				>
					<div style={{ width: '100%', height: '100%', opacity: Math.min((circleSize - 10) / 30, 1) }}>
						<HomeHeroIntro layout='embedded' scrollProgressOverride={1 - circleSize / 100} />
					</div>
				</div>
			)}
		</div>
	);
};

export default ScrollCollapseSection;
