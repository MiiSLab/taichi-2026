import React, { useEffect, useRef, useState } from 'react';
import HeroHologramBackground from './HeroHologramBackground';

const HERO_REVEAL_DURATION_MS = 2400;
const HERO_SCROLL_HEIGHT = '320vh';
const heroWordmarkSrc = '/images/home_bg.png';
const heroTaichiSrc = '/images/home_bg_TAICHI.png';
const heroDateSrc = '/images/home_date.png';
const PIXEL_COLUMNS = 60;
const PIXEL_ROWS = 36;
const pixelCells = Array.from({ length: PIXEL_COLUMNS * PIXEL_ROWS }, (_, index) => {
	const column = index % PIXEL_COLUMNS;
	const row = Math.floor(index / PIXEL_COLUMNS);
	return { column, row };
});

type HomeHeroIntroProps = {
	onProgress?: (progress: number, isActive: boolean) => void;
	layout?: 'standalone' | 'embedded';
	scrollProgressOverride?: number;
};

const HomeHeroIntro: React.FC<HomeHeroIntroProps> = ({
	onProgress,
	layout = 'standalone',
	scrollProgressOverride,
}) => {
	const [isRevealComplete, setIsRevealComplete] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const [openProgress, setOpenProgress] = useState(0);
	const [scrollProgress, setScrollProgress] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isEmbedded = layout === 'embedded';

	useEffect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		const applyPreference = () => setPrefersReducedMotion(media.matches);

		applyPreference();
		media.addEventListener('change', applyPreference);

		if (media.matches) {
			setIsRevealComplete(true);
			setOpenProgress(1);
			return () => media.removeEventListener('change', applyPreference);
		}

		let frameId = 0;
		let startTime = 0;

		const animateOpen = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const nextProgress = Math.min(elapsed / HERO_REVEAL_DURATION_MS, 1);
			const eased = 1 - Math.pow(1 - nextProgress, 4);
			setOpenProgress(eased);

			if (nextProgress < 1) {
				frameId = window.requestAnimationFrame(animateOpen);
				return;
			}

			setIsRevealComplete(true);
		};

		frameId = window.requestAnimationFrame(animateOpen);

		return () => {
			window.cancelAnimationFrame(frameId);
			media.removeEventListener('change', applyPreference);
		};
	}, []);

	useEffect(() => {
		if (isEmbedded) return;

		const handleScroll = () => {
			const container = containerRef.current;
			if (!container) return;

			const scrollY = window.scrollY;
			const start = container.offsetTop;
			const end = start + container.offsetHeight - window.innerHeight;

			if (scrollY <= start) {
				setScrollProgress(0);
				onProgress?.(0, false);
				return;
			}

			if (scrollY >= end) {
				setScrollProgress(1);
				onProgress?.(1, false);
				return;
			}

			const progress = (scrollY - start) / Math.max(end - start, 1);
			setScrollProgress(progress);
			onProgress?.(progress, true);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isEmbedded, onProgress]);

	useEffect(() => {
		if (!isEmbedded || typeof scrollProgressOverride !== 'number') return;
		setScrollProgress(scrollProgressOverride);
	}, [isEmbedded, scrollProgressOverride]);

	const revealVisibility = prefersReducedMotion ? 1 : Math.min(Math.max((openProgress - 0.18) / 0.6, 0), 1);
	const heroVisibility = Math.max(0, 1 - scrollProgress * 1.12);
	const contentOpacity = revealVisibility * heroVisibility;
	const contentTransform = `translate3d(0, ${scrollProgress * 8}vh, 0) scale(${1 - scrollProgress * 0.07})`;
	const titleProgress = prefersReducedMotion ? 1 : Math.min(Math.max((openProgress - 0.24) / 0.22, 0), 1);
	const taichiProgress = prefersReducedMotion ? 1 : Math.min(Math.max((openProgress - 0.41) / 0.18, 0), 1);
	const dateProgress = prefersReducedMotion ? 1 : Math.min(Math.max((openProgress - 0.56) / 0.17, 0), 1);
	const content = (
		<section className='hero-intro'>
			<div className='hero-intro__sticky'>
				<div className='hero-intro__background'>
					<HeroHologramBackground
						openProgress={openProgress}
						scrollProgress={scrollProgress}
						reducedMotion={prefersReducedMotion}
					/>
					<div className='hero-intro__scanlines' />
					<div className='hero-intro__vignette' />
					<div className='hero-intro__pixel-curtain' aria-hidden='true'>
						{pixelCells.map(({ column, row }) => {
							const normalizedX = column / (PIXEL_COLUMNS - 1);
							const normalizedY = row / (PIXEL_ROWS - 1);
							const fromCenter = Math.abs(normalizedX - 0.5) * 2;
							const stagger = ((row * 17 + column * 13) % 9) / 42;
							const branch = ((row * 11 + column * 7) % 5) / 90;
							const threshold = Math.min(1.15, fromCenter * 0.94 + stagger - branch);
							const isOpen = openProgress > threshold;
							const residual = !isOpen && (Math.abs(normalizedX - 0.5) > 0.72 || Math.abs(normalizedY - 0.5) > 0.72) && openProgress > threshold - 0.08;
							return (
								<span
									key={`${column}-${row}`}
									className={`hero-intro__pixel ${isOpen ? 'hero-intro__pixel--open' : ''} ${residual ? 'hero-intro__pixel--residual' : ''}`}
									style={
										{
											'--pixel-column': column,
											'--pixel-row': row,
										} as React.CSSProperties
									}
								/>
							);
						})}
					</div>
				</div>

				<div
					className={`hero-intro__content ${isRevealComplete ? 'hero-intro__content--revealed' : ''}`}
					style={{ opacity: contentOpacity, transform: contentTransform }}
				>
					<div className='hero-intro__lockup-stack'>
						<img
							src={heroWordmarkSrc}
							alt='BIG BANG! FUTURES'
							className='hero-intro__hero-asset hero-intro__hero-asset--title'
							style={{
								opacity: titleProgress,
								transform: `translate3d(0, ${(1 - titleProgress) * 2.8}rem, 0) scale(${0.92 + titleProgress * 0.08})`,
							}}
						/>
						<img
							src={heroTaichiSrc}
							alt='TAICHI26'
							className='hero-intro__hero-asset hero-intro__hero-asset--taichi'
							style={{
								opacity: taichiProgress,
								transform: `translate3d(0, ${(1 - taichiProgress) * 2.2}rem, 0) scale(${0.94 + taichiProgress * 0.06})`,
							}}
						/>
						<img
							src={heroDateSrc}
							alt='2026 8.05 WED to 8.06 TUE'
							className='hero-intro__hero-asset hero-intro__hero-asset--date'
							style={{
								opacity: dateProgress,
								transform: `translate3d(0, ${(1 - dateProgress) * 1.8}rem, 0) scale(${0.95 + dateProgress * 0.05})`,
							}}
						/>
					</div>
					<p className='hero-intro__scroll-hint'>Scroll to reveal</p>
				</div>
			</div>
		</section>
	);

	if (isEmbedded) {
		return <div className='hero-intro-embedded'>{content}</div>;
	}

	return (
		<div ref={containerRef} className='hero-intro-scroll-shell' style={{ height: HERO_SCROLL_HEIGHT }}>
			{content}
		</div>
	);
};

export default HomeHeroIntro;
