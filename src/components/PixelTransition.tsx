import React, { useEffect, useState } from 'react';

const PixelTransition: React.FC = () => {
	const [pixels, setPixels] = useState<Array<{ id: number; left: string; size: number; delay: number }>>([]);

	useEffect(() => {
		// Generate static pixel data only once on mount
		const newPixels = Array.from({ length: 150 }).map((_, i) => ({
			id: i,
			left: `${Math.random() * 100}%`,
			size: Math.random() * 10 + 4, // 4px to 14px
			delay: Math.random() * 2,
		}));
		setPixels(newPixels);
	}, []);

	return (
		<div className='relative w-full h-32 overflow-hidden -mt-16 z-20 pointer-events-none'>
			{/* This mimics the scatter of pixels from blue (top) to white (bottom) */}
			{pixels.map((p) => (
				<div
					key={p.id}
					className='absolute bg-lab-white'
					style={{
						left: p.left,
						top: `${Math.random() * 100}%`,
						width: `${p.size}px`,
						height: `${p.size}px`,
						opacity: Math.random() > 0.5 ? 1 : 0.5,
					}}
				/>
			))}
			<div className='absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-transparent to-lab-white'></div>
		</div>
	);
};

export default PixelTransition;
