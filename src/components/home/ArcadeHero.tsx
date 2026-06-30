import React from 'react';

/**
 * The new "arcade terminal" main visual (BIG BANG! FUTURES!).
 * Pure presentational; the scroll/transition behaviour lives in ArcadeHeroScroll.
 * Assets in public/newhome/ (from test/update/BBF DEMO).
 */

const CHARACTERS = [
	{ src: '/newhome/explorer.png', name: 'Explorer' },
	{ src: '/newhome/navigator.png', name: 'Navigator' },
	{ src: '/newhome/observer.png', name: 'Observer' },
	{ src: '/newhome/maker.png', name: 'Maker' },
	{ src: '/newhome/designer.png', name: 'Designer' },
	{ src: '/newhome/engineer.png', name: 'Engineer' },
] as const;

const DEFAULT_SELECTED = 'Navigator';

const CharBox: React.FC<{ src: string; name: string; className?: string }> = ({ src, name, className = '' }) => (
	<div className={`nh-charbox ${name === DEFAULT_SELECTED ? 'nh-selected' : ''} ${className}`}>
		<span className='nh-aim' aria-hidden='true' />
		<img src={src} alt={name} className='nh-char nh-pixel' />
		<span className='nh-name'>{name}</span>
	</div>
);

// Green pixel cross marker (decorative), recreated from preview.jpg.
// Staggered green pixel blocks (decorative), recreated from preview.jpg:
// a 2×3 checkerboard of equal squares. Left → (0,0)(1,1)(0,2); right mirrors it.
const PixelBlocks: React.FC<{ side: 'left' | 'right'; className?: string; style?: React.CSSProperties }> = ({ side, className = '', style }) => {
	const cells = side === 'left' ? [[0, 0], [1, 1], [0, 2]] : [[1, 0], [0, 1], [1, 2]];
	return (
		<svg viewBox='0 0 2 3' shapeRendering='crispEdges' fill='#3ad13a' aria-hidden='true' className={className} style={style}>
			{cells.map(([x, y]) => (
				<rect key={`${x}-${y}`} x={x} y={y} width='1' height='1' />
			))}
		</svg>
	);
};

const ScrollHint: React.FC<{ className?: string; onClick?: () => void }> = ({ className = '', onClick }) => (
	<button
		type='button'
		onClick={onClick}
		aria-label='Scroll to continue'
		className={`flex animate-bounce cursor-pointer flex-col items-center gap-4 bg-transparent text-white transition-opacity hover:opacity-80 md:gap-5 ${className}`}
	>
		<span className='font-mono text-[11px] tracking-[0.2em] sm:text-[13px] md:text-[15px]'>SCROLL TO CONTINUE</span>
		<svg
			viewBox='0 0 56 28'
			fill='none'
			stroke='currentColor'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
			className='h-5 w-14 md:h-6 md:w-16'
		>
			<path d='M4 5 L28 18 L52 5' />
			<path d='M4 13 L28 26 L52 13' />
		</svg>
	</button>
);

const ArcadeHero: React.FC = () => {
	const firstGroup = CHARACTERS.slice(0, 3);
	const secondGroup = CHARACTERS.slice(3, 6);

	// Clicking the scroll hint nudges the page down; the hero's scroll wrapper
	// picks up the downward delta and auto-snaps into the content (same as scrolling).
	const handleScrollDown = () => {
		window.scrollBy({ top: Math.max(Math.round(window.innerHeight * 0.18), 80) });
	};

	return (
		<div className='relative h-full min-h-[100dvh] w-full overflow-hidden bg-[#0d0e12] text-white'>
			{/* Hardware bezel — opaque black centre doubles as the screen. Stretched to the viewport. */}
			<img src='/newhome/frame.png' alt='' aria-hidden='true' className='nh-pixel absolute inset-0 h-full w-full [object-fit:fill]' />

			{/* Black screen area (constant % insets map to the bezel cutout regardless of aspect) */}
			<div className='absolute bottom-[11%] left-[3%] right-[3%] top-[12%] overflow-hidden rounded-[2vw]'>
				{/* Retro 3D grid */}
				<div className='absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none nh-grid-wrap h-1/2'>
					<div className='nh-grid' />
				</div>

				{/* Stage content */}
				<div className='relative z-[2] flex h-full flex-col items-center justify-between py-[4%]'>
					{/* Title with flanking green blocks (aligned to the title's bottom edge).
					    Mobile (<md, blocks hidden) goes near-full-width; md+ keeps room for the blocks. */}
					<div className='relative flex w-full justify-center pt-[8vh] md:pt-[1vh]'>
						<img src='/newhome/title.png' alt='BIG BANG! FUTURES!' className='h-auto nh-title nh-pixel w-[min(84vw,560px)] md:w-[min(60vw,820px)]' />
						<PixelBlocks side='left' className='absolute bottom-0 left-[4%] z-[1] hidden md:block' style={{ width: 'clamp(46px, 5.6vw, 104px)' }} />
						<PixelBlocks side='right' className='absolute bottom-0 right-[4%] z-[1] hidden md:block' style={{ width: 'clamp(46px, 5.6vw, 104px)' }} />
					</div>

					{/* Subtitle — its own row so justify-between centres it in the gap (top: title, middle: subtitle, bottom: characters).
					    Mobile fills the width; lg+ caps at 440px (its half, 220px, drives the character-group alignment below). */}
					<img src='/newhome/subtitle.png' alt='TAICHI26 — 8.05 WED to 8.06 THU' className='h-auto nh-pixel w-[min(82vw,400px)] lg:w-[min(52vw,440px)]' />

					{/* Character select — wide screens. Each group is anchored precisely:
					    left group  = [green-block left 4%]  →  [subtitle.png left edge]
					    right group = [subtitle.png right edge]  →  [green-block right 4%]
					    (subtitle.png width = min(48vw,380px); its half = min(24vw,190px)) */}
					<div className='nh-zone relative hidden h-[150px] w-full lg:block xl:h-[185px] 2xl:h-[205px]'>
						<div className='absolute inset-y-0 flex items-end justify-between pb-7' style={{ left: '4%', right: 'calc(50% + min(26vw, 220px))' }}>
							{firstGroup.map((c) => (
								<CharBox key={c.name} src={c.src} name={c.name} className='h-[100px] xl:h-[130px] 2xl:h-[148px]' />
							))}
						</div>
						{/* Centered to the screen and bounded to the subtitle's width (the gap between the two groups). */}
						<div className='absolute inset-y-0 flex items-end justify-center pb-1' style={{ left: 'calc(50% - min(26vw, 220px))', right: 'calc(50% - min(26vw, 220px))' }}>
							<ScrollHint className='px-2' onClick={handleScrollDown} />
						</div>
						<div className='absolute inset-y-0 flex items-end justify-between pb-7' style={{ left: 'calc(50% + min(26vw, 220px))', right: '4%' }}>
							{secondGroup.map((c) => (
								<CharBox key={c.name} src={c.src} name={c.name} className='h-[100px] xl:h-[130px] 2xl:h-[148px]' />
							))}
						</div>
					</div>

					{/* Character select — narrow screens: 3×2 grid, hint below. Heights/gaps stay vh-aware
					    and there's bottom clearance so the bouncing arrow never clips the screen edge. */}
					<div className='flex w-full flex-col items-center gap-[clamp(1rem,4vh,2.5rem)] px-[4%] pb-[5vh] lg:hidden'>
						<div className='nh-zone grid w-full max-w-[380px] grid-cols-3 justify-items-center gap-x-[4vw] gap-y-[clamp(1rem,4vh,2.5rem)]'>
							{CHARACTERS.map((c) => (
								<CharBox key={c.name} src={c.src} name={c.name} className='h-[min(16vw,84px)] w-[min(16vw,84px)]' />
							))}
						</div>
						<ScrollHint onClick={handleScrollDown} />
					</div>
				</div>
			</div>

			<style>{`
				.nh-pixel { image-rendering: pixelated; image-rendering: crisp-edges; }

				/* Retro 3D grid */
				.nh-grid-wrap {
					perspective: 250px;
					-webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
					mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
				}
				.nh-grid {
					position: absolute; top: -100%; left: -50%; width: 200%; height: 400%;
					background-image:
						linear-gradient(to right, rgba(80,250,123,0.15) 1px, transparent 4px),
						linear-gradient(to bottom, rgba(80,250,123,0.15) 1px, transparent 4px);
					background-size: 150px 50px;
					transform: rotateX(65deg);
					animation: nh-grid-travel 2.5s linear infinite;
				}
				@keyframes nh-grid-travel {
					0% { transform: rotateX(65deg) translateY(0); }
					100% { transform: rotateX(65deg) translateY(50px); }
				}

				/* Title glow */
				.nh-title { animation: nh-title-glow 4s ease-in-out infinite alternate; }
				@keyframes nh-title-glow {
					0% { filter: drop-shadow(0 0 2px rgba(255,85,85,0.2)); }
					100% { filter: drop-shadow(0 0 10px rgba(255,85,85,0.5)); }
				}

				/* Character box — red targeting reticle cursor (arcade "lock-on" feel) */
				.nh-charbox {
					position: relative; display: flex; align-items: center; justify-content: center;
					cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' shape-rendering='crispEdges'><path d='M12 2v20M2 12h20' stroke='%23000' stroke-opacity='.5' stroke-width='5'/><path d='M12 2v20M2 12h20' stroke='%23ff2b2b' stroke-width='3'/></svg>") 12 12, crosshair;
				}
				.nh-char { height: 78%; width: auto; z-index: 2; }
				.nh-aim {
					position: absolute; inset: -12px; z-index: 1; opacity: 0; pointer-events: none;
					background: url('/newhome/aim.png') center / 100% 100% no-repeat;
					image-rendering: pixelated; transition: opacity 0.15s ease;
				}
				.nh-name {
					position: absolute; bottom: -1.9rem; left: 50%; transform: translateX(-50%);
					font-family: 'Courier New', monospace; font-size: 16px; letter-spacing: 1px; white-space: nowrap;
					opacity: 0; transition: opacity 0.15s ease; z-index: 3;
				}
				.nh-charbox:hover .nh-aim, .nh-selected .nh-aim { opacity: 1; animation: nh-blink 1s infinite alternate; }
				.nh-charbox:hover .nh-name, .nh-selected .nh-name { opacity: 1; }
				.nh-charbox:hover .nh-char, .nh-selected .nh-char { animation: nh-bounce 0.6s steps(2) infinite; }
				@keyframes nh-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
				@keyframes nh-blink {
					0% { filter: drop-shadow(0 0 1px rgba(255,85,85,0.4)); }
					100% { filter: drop-shadow(0 0 6px rgba(255,85,85,0.8)); }
				}

				/* Hovering another box dims the default-selected one */
				.nh-zone:hover .nh-selected:not(:hover) .nh-aim,
				.nh-zone:hover .nh-selected:not(:hover) .nh-name { opacity: 0; }
				.nh-zone:hover .nh-selected:not(:hover) .nh-char { animation: none; }
			`}</style>
		</div>
	);
};

export default ArcadeHero;
