import React from 'react';

type HeroPixelRevealProps = {
	active: boolean;
};

const LEFT_BLOCKS = [
	{ top: '0%', height: '15%', width: '60%', delay: '0ms' },
	{ top: '14%', height: '14%', width: '74%', delay: '60ms' },
	{ top: '28%', height: '11%', width: '53%', delay: '140ms' },
	{ top: '37%', height: '16%', width: '68%', delay: '90ms' },
	{ top: '54%', height: '13%', width: '78%', delay: '180ms' },
	{ top: '67%', height: '10%', width: '49%', delay: '120ms' },
	{ top: '75%', height: '15%', width: '70%', delay: '40ms' },
	{ top: '88%', height: '12%', width: '62%', delay: '170ms' },
];

const RIGHT_BLOCKS = [
	{ top: '2%', height: '12%', width: '68%', delay: '20ms' },
	{ top: '11%', height: '17%', width: '52%', delay: '110ms' },
	{ top: '27%', height: '13%', width: '80%', delay: '50ms' },
	{ top: '40%', height: '15%', width: '61%', delay: '150ms' },
	{ top: '55%', height: '12%', width: '73%', delay: '95ms' },
	{ top: '65%', height: '14%', width: '58%', delay: '190ms' },
	{ top: '80%', height: '10%', width: '77%', delay: '80ms' },
	{ top: '88%', height: '12%', width: '56%', delay: '160ms' },
];

const HeroPixelReveal: React.FC<HeroPixelRevealProps> = ({ active }) => {
	return (
		<div
			className={`hero-pixel-reveal ${active ? 'hero-pixel-reveal--active' : ''}`}
			aria-hidden='true'
		>
			<div className='hero-pixel-reveal__half hero-pixel-reveal__half--left'>
				{LEFT_BLOCKS.map((block) => (
					<span
						key={`${block.top}-${block.width}`}
						className='hero-pixel-reveal__block hero-pixel-reveal__block--left'
						style={
							{
								top: block.top,
								height: block.height,
								width: block.width,
								['--hero-reveal-delay' as string]: block.delay,
							} as React.CSSProperties
						}
					/>
				))}
			</div>
			<div className='hero-pixel-reveal__center-band' />
			<div className='hero-pixel-reveal__half hero-pixel-reveal__half--right'>
				{RIGHT_BLOCKS.map((block) => (
					<span
						key={`${block.top}-${block.width}`}
						className='hero-pixel-reveal__block hero-pixel-reveal__block--right'
						style={
							{
								top: block.top,
								height: block.height,
								width: block.width,
								['--hero-reveal-delay' as string]: block.delay,
							} as React.CSSProperties
						}
					/>
				))}
			</div>
			<span className='hero-pixel-reveal__chip hero-pixel-reveal__chip--top' />
			<span className='hero-pixel-reveal__chip hero-pixel-reveal__chip--bottom' />
		</div>
	);
};

export default HeroPixelReveal;
