import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const SCROLL_HEIGHT = '550vh'; // vertical "depth" for the animation
const DESTINATION = '/cfp'; // route to navigate to on click

const ScrollCollapseSection: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [circleSize, setCircleSize] = useState(100);
	const [isActive, setIsActive] = useState(false);
	const [showBoom, setShowBoom] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const handleScroll = () => {
			if (!containerRef.current) return;

			const container = containerRef.current;
			const containerTop = container.offsetTop; // px from page top
			const containerH = container.offsetHeight;
			const windowH = window.innerHeight;
			const scrollY = window.scrollY;

			// We animate while the section is "in view" as a scroll target
			const scrollStart = containerTop; // circle starts shrinking
			const scrollEnd = containerTop + containerH - windowH; // circle finishes

			if (scrollY >= scrollStart && scrollY <= scrollEnd) {
				setIsActive(true);
				const progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
				const size = Math.max(100 - progress * 110, 0);
				setCircleSize(size);
				setShowBoom(size < 6);
			} else {
				setIsActive(false);
				setCircleSize(scrollY < scrollStart ? 100 : 0);
				setShowBoom(false);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // run once on mount
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
						pointerEvents: showBoom ? 'none' : 'auto',
						overflow: 'hidden',
					}}
				>
					{/* Content inside the shrinking circle — matches the original lime hero */}
					{!showBoom && (
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
											<div
												className='text-sm md:text-lg text-left leading-tight mt-1'
												style={{ whiteSpace: 'pre-line' }}
											>
												{label}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{/* BOOM button — appears when circle is fully collapsed */}
			{isActive && showBoom && (
				<button
					onClick={() => navigate(DESTINATION)}
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 45,
						width: 160,
						height: 160,
						borderRadius: '50%',
						background: '#a8f020',
						border: '3px solid #050505',
						cursor: 'pointer',
						fontFamily: '"VT323", monospace',
						fontSize: '2rem',
						fontWeight: 900,
						color: '#050505',
						letterSpacing: '0.1em',
						boxShadow: '0 0 40px rgba(168,240,32,0.7)',
						animation: 'boomPulse 1.2s ease-in-out infinite alternate',
					}}
				>
					CFP!
				</button>
			)}

			{/* keyframes injected once */}
			<style>{`
				@keyframes boomPulse {
					from { box-shadow: 0 0 20px rgba(168,240,32,0.5); }
					to   { box-shadow: 0 0 60px rgba(168,240,32,0.9); }
				}
			`}</style>
		</div>
	);
};

export default ScrollCollapseSection;
