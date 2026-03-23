import React, { useEffect, useRef, useState } from 'react';

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
const AUTO_SCROLL_DURATION = 2000;

interface Props {
	/** Reports the current circle size (0–100) and whether the animation is active. */
	onProgress?: (circleSize: number, isActive: boolean) => void;
}

const ScrollCollapseSection: React.FC<Props> = ({ onProgress }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [circleSize, setCircleSize] = useState(100);
	const [isActive, setIsActive] = useState(false);

	const isAutoScrolling = useRef<'down' | 'up' | null>(null);

	useEffect(() => {
		let lastY = window.scrollY;

		const triggerCustomScroll = (targetY: number, duration: number) => {
			const startY = window.scrollY;
			const distance = targetY - startY;
			let startTime: number | null = null;

			const step = (timestamp: number) => {
				if (!startTime) startTime = timestamp;
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// 您覺得感受不明顯，是因為前一版的次方數(3次方)不夠大！
				// 您提到想要「一開始快，中間/後面慢」，這正是所謂的「Ease-Out（退場緩動）」！
				// 這樣的曲線會在動畫最前段直接加速完成大部分的路程，然後剩下的一大半時間都處於非常緩慢的「減速滑行」狀態。
				// easeRate 數字越大，開頭衝得越快、後面拖得越慢！
				const easeRate = 6;
				const ease = 1 - Math.pow(1 - progress, easeRate);

				window.scrollTo(0, startY + distance * ease);

				if (progress < 1) {
					requestAnimationFrame(step);
				} else {
					window.scrollTo(0, targetY);
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
				const rawProgress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
				// 使用 ease-out 曲線 (Quad Ease Out)：讓前半段跑得快，後半段的動畫放慢
				const progress = 1 - Math.pow(1 - rawProgress, 2);
				const size = Math.max(100 - progress * 110, 0);
				setCircleSize(size);
				onProgress?.(size, true);
			} else {
				setIsActive(false);
				const size = scrollY < scrollStart ? 100 : 0;
				setCircleSize(size);
				onProgress?.(size, false);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		// Run once on mount to establish base
		setTimeout(handleScroll, 100);
		return () => window.removeEventListener('scroll', handleScroll);
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
					{/* Content inside the shrinking circle — matches the original lime hero */}
					<div
						className='flex flex-col items-center max-w-7xl w-full text-center px-4 pt-16'
						style={{ opacity: Math.min((circleSize - 10) / 30, 1) }}
					>
						<img
							src='/images/home_bg.png'
							alt='Big Bang Futures'
							className='w-[90%] md:w-[85%] max-w-5xl mb-8 object-contain drop-shadow-xl'
						/>

						{/* Timeline */}
						<div className='relative mt-8 max-w-[876px] w-full mx-auto pb-12 px-8 text-roboto'>
							<div className='relative w-full h-4 flex items-center mb-6'>
								<div className='absolute left-0 right-0 h-[2px] bg-[#F7616C] z-0' />
								{[0, 31.7, 66.6, 100].map((pct) => (
									<div
										key={pct}
										className='absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7616C] rounded-full z-10 -translate-x-1/2'
										style={{ left: `${pct}%` }}
									/>
								))}
							</div>
							<div className='relative w-full text-black font-mono h-24'>
								{[
									{ pct: 0, date: '8/3', label: 'APMAR' },
									{ pct: 31.7, date: '8/4', label: 'APMAR' },
									{ pct: 66.6, date: '8/5', label: 'TAICHI, 晶創人文,\nAPMAR, ISAT' },
									{ pct: 100, date: '8/6', label: 'TAICHI ISAT' },
								].map(({ pct, date, label }) => (
									<div
										key={pct}
										className='absolute top-0 -translate-x-1/2 flex flex-col items-center w-44'
										style={{ left: `${pct}%` }}
									>
										<div className='text-xl md:text-2xl font-bold'>{date}</div>
										<div className='text-sm md:text-lg text-left leading-tight mt-1' style={{ whiteSpace: 'pre-line' }}>
											{label}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScrollCollapseSection;
