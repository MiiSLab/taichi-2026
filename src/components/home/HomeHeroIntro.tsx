import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { detectPerformanceTier, type PerformanceTier } from '../../utils/performanceTier';

const HeroHologramBackground = lazy(() => import('./HeroHologramBackground'));

const HERO_REVEAL_DURATION_MS = 2400;
const HERO_SCROLL_HEIGHT = '320vh';
// Module-level flag: lives only as long as the current JS runtime.
// → Reset on hard reload (F5), new tab, or incognito (so reveal plays again).
// → Preserved across SPA route changes (so returning to "/" from /cfp does NOT replay).
let hasRevealedThisRuntime = false;
const heroWordmarkSrc = '/images/home_bg.avif';
const heroTaichiSrc = '/images/home_bg_TAICHI.avif';
const heroDateSrc = '/images/home_date.png';
// Pixel-curtain resolution scales with performance tier so weaker GPUs
// don't have to fillRect 2160 cells every frame during the reveal.
const PIXEL_GRID_BY_TIER: Record<PerformanceTier, { cols: number; rows: number }> = {
	full: { cols: 60, rows: 36 },
	medium: { cols: 40, rows: 24 },
	lite: { cols: 30, rows: 18 },
};
const PIXEL_FILL = '#a8f020';
const PIXEL_RESIDUAL_FILL = 'rgba(168, 240, 32, 0.82)';

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
	const hasRevealedBefore = hasRevealedThisRuntime;
	const [isRevealComplete, setIsRevealComplete] = useState(hasRevealedBefore);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const [openProgress, setOpenProgress] = useState(hasRevealedBefore ? 1 : 0);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [shouldMountHologram, setShouldMountHologram] = useState(hasRevealedBefore);
	const [tier] = useState<PerformanceTier>(detectPerformanceTier);
	const { cols: PIXEL_COLUMNS, rows: PIXEL_ROWS } = PIXEL_GRID_BY_TIER[tier];
	const containerRef = useRef<HTMLDivElement | null>(null);
	const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const openProgressRef = useRef(openProgress);
	const isEmbedded = layout === 'embedded';

	useEffect(() => {
		openProgressRef.current = openProgress;
	}, [openProgress]);

	useEffect(() => {
		if (shouldMountHologram) return;
		let cancelled = false;
		const arm = () => {
			if (cancelled) return;
			setShouldMountHologram(true);
		};
		const idleHandle =
			typeof window.requestIdleCallback === 'function'
				? window.requestIdleCallback(arm, { timeout: 1500 })
				: window.setTimeout(arm, 900);
		return () => {
			cancelled = true;
			if (typeof window.cancelIdleCallback === 'function' && typeof idleHandle === 'number') {
				try {
					window.cancelIdleCallback(idleHandle);
				} catch {
					window.clearTimeout(idleHandle);
				}
			} else {
				window.clearTimeout(idleHandle as number);
			}
		};
	}, [shouldMountHologram]);

	useEffect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		const applyPreference = () => setPrefersReducedMotion(media.matches);

		applyPreference();
		media.addEventListener('change', applyPreference);

		if (media.matches || hasRevealedBefore) {
			setIsRevealComplete(true);
			setOpenProgress(1);
			hasRevealedThisRuntime = true;
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
			hasRevealedThisRuntime = true;
		};

		frameId = window.requestAnimationFrame(animateOpen);

		return () => {
			window.cancelAnimationFrame(frameId);
			media.removeEventListener('change', applyPreference);
		};
	}, [hasRevealedBefore]);

	useEffect(() => {
		const canvas = pixelCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let cssWidth = 0;
		let cssHeight = 0;
		let lastDrawn = -1;

		const drawPixels = (progress: number) => {
			if (cssWidth === 0 || cssHeight === 0) return;
			lastDrawn = progress;
			ctx.clearRect(0, 0, cssWidth, cssHeight);
			if (progress >= 1.16) return;
			const cellW = cssWidth / PIXEL_COLUMNS;
			const cellH = cssHeight / PIXEL_ROWS;
			const fillW = Math.ceil(cellW) + 1;
			const fillH = Math.ceil(cellH) + 1;
			let currentFill: string | null = null;
			for (let row = 0; row < PIXEL_ROWS; row += 1) {
				const normalizedY = row / (PIXEL_ROWS - 1);
				const yEdge = Math.abs(normalizedY - 0.5) > 0.72;
				for (let col = 0; col < PIXEL_COLUMNS; col += 1) {
					const normalizedX = col / (PIXEL_COLUMNS - 1);
					const fromCenter = Math.abs(normalizedX - 0.5) * 2;
					const stagger = ((row * 17 + col * 13) % 9) / 42;
					const branch = ((row * 11 + col * 7) % 5) / 90;
					const threshold = Math.min(1.15, fromCenter * 0.94 + stagger - branch);
					if (progress > threshold) continue;
					const isResidual =
						(yEdge || Math.abs(normalizedX - 0.5) > 0.72) && progress > threshold - 0.08;
					const fill = isResidual ? PIXEL_RESIDUAL_FILL : PIXEL_FILL;
					if (fill !== currentFill) {
						ctx.fillStyle = fill;
						currentFill = fill;
					}
					ctx.fillRect(col * cellW, row * cellH, fillW, fillH);
				}
			}
		};

		const resize = () => {
			const parent = canvas.parentElement;
			if (!parent) return;
			cssWidth = parent.clientWidth;
			cssHeight = parent.clientHeight;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
			canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
			canvas.style.width = `${cssWidth}px`;
			canvas.style.height = `${cssHeight}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			drawPixels(openProgressRef.current);
		};

		const drawIfChanged = () => {
			const progress = openProgressRef.current;
			if (Math.abs(progress - lastDrawn) < 0.001 && progress < 1) return;
			drawPixels(progress);
		};

		(canvas as HTMLCanvasElement & { __drawIfChanged?: () => void }).__drawIfChanged = drawIfChanged;

		resize();
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);

	useEffect(() => {
		const canvas = pixelCanvasRef.current as
			| (HTMLCanvasElement & { __drawIfChanged?: () => void })
			| null;
		canvas?.__drawIfChanged?.();
	}, [openProgress]);

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
					{shouldMountHologram ? (
						<Suspense fallback={null}>
							<HeroHologramBackground
								openProgress={openProgress}
								scrollProgress={scrollProgress}
								reducedMotion={prefersReducedMotion}
							/>
						</Suspense>
					) : null}
					<div className='hero-intro__scanlines' />
					<div className='hero-intro__vignette' />
					<div className='hero-intro__pixel-curtain' aria-hidden='true'>
						<canvas ref={pixelCanvasRef} className='hero-intro__pixel-canvas' />
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
							loading='eager'
							decoding='async'
							fetchPriority='high'
							style={{
								opacity: titleProgress,
								transform: `translate3d(0, ${(1 - titleProgress) * 2.8}rem, 0) scale(${0.92 + titleProgress * 0.08})`,
							}}
						/>
						<img
							src={heroTaichiSrc}
							alt='TAICHI26'
							className='hero-intro__hero-asset hero-intro__hero-asset--taichi'
							loading='eager'
							decoding='async'
							fetchPriority='high'
							style={{
								opacity: taichiProgress,
								transform: `translate3d(0, ${(1 - taichiProgress) * 2.2}rem, 0) scale(${0.94 + taichiProgress * 0.06})`,
							}}
						/>
						<img
							src={heroDateSrc}
							alt='2026 8.05 WED to 8.06 THU'
							className='hero-intro__hero-asset hero-intro__hero-asset--date'
							loading='eager'
							decoding='async'
							fetchPriority='high'
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
