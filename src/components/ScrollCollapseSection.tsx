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
			window.addEventListener('wheel', preventDefault, { passive: false });
			window.addEventListener('touchmove', preventDefault, { passive: false });
			window.addEventListener('keydown', preventDefaultForScrollKeys as any, { passive: false });
		};

		const unlockScroll = () => {
			window.removeEventListener('wheel', preventDefault);
			window.removeEventListener('touchmove', preventDefault);
			window.removeEventListener('keydown', preventDefaultForScrollKeys as any); // Remove with same casting
		};

		const triggerCustomScroll = (targetY: number, duration: number) => {
			const startY = window.scrollY;
			const distance = targetY - startY;
			let startTime: number | null = null;

			lockScroll();

			const step = (timestamp: number) => {
				if (!startTime) startTime = timestamp;
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// 這裡單純驅動「網頁物理往下捲動」的平滑程度
				const ease = easeOutQuint(progress);

				window.scrollTo(0, startY + distance * ease);

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
						{/* Timeline */}
						<div className='w-full mt-12 md:mt-8 pb-12 text-roboto text-black font-mono max-w-[876px] mx-auto'>
							{/* --- MOBILE VERTICAL TIMELINE --- */}
							<div className='md:hidden flex flex-col px-4 max-w-[400px] w-full mx-auto md:ml-0 overflow-visible'>
								{[
									{ pct: 0, date: '8/3', label: 'APMAR' },
									{ pct: 31.7, date: '8/4', label: 'APMAR' },
									{ pct: 66.6, date: '8/5', label: 'TAICHI, 晶創人文, APMAR, ISAT' },
									{ pct: 100, date: '8/6', label: 'TAICHI ISAT' },
								].map(({ date, label }, idx, arr) => (
									<div key={date} className='flex gap-5 relative min-h-[4rem] text-left'>
										{/* Line & Dot */}
										<div className='flex flex-col items-center relative mt-1.5'>
											<div className='w-[14px] h-[14px] bg-[#F7616C] rounded-full z-10 shrink-0 shadow-md' />
											{idx !== arr.length - 1 && (
												<div className='absolute top-3.5 h-full w-[2px] bg-[#F7616C]/60 z-0' />
											)}
										</div>
										{/* Text */}
										<div className='flex flex-col pb-10 flex-1 min-w-0'>
											<div className='text-[1.35rem] font-bold tracking-widest text-[#111] leading-none mb-1.5'>
												{date}
											</div>
											<div
												className='text-[13px] sm:text-[14px] leading-[1.6] text-[#222] font-medium'
												style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
											>
												{label}
											</div>
										</div>
									</div>
								))}
							</div>

							{/* --- DESKTOP HORIZONTAL TIMELINE --- */}
							<div className='hidden md:block relative w-full px-8'>
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
								<div className='relative w-full h-24'>
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
											<div className='text-2xl font-bold'>{date}</div>
											<div className='text-lg text-left leading-tight mt-1' style={{ whiteSpace: 'pre-line' }}>
												{label}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScrollCollapseSection;
