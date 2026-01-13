import React from 'react';

const VoxelCube: React.FC = () => {
	return (
		<div className='relative w-64 h-64 flex items-center justify-center animate-float'>
			<div className='absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 transform rotate-45 scale-75 opacity-90'>
				{/* Creating a pixelated voxel shape illusion */}
				{[...Array(16)].map((_, i) => (
					<div
						key={i}
						className={`
              w-full h-full bg-white transition-all duration-500 hover:scale-110 shadow-lg
              ${i === 5 || i === 6 || i === 9 || i === 10 ? 'opacity-0' : 'opacity-100'}
              ${i % 2 === 0 ? 'bg-opacity-90' : 'bg-opacity-70'}
            `}
					></div>
				))}
			</div>

			{/* Inner Core */}
			<div className='absolute w-20 h-20 bg-lab-blue border-4 border-white transform rotate-12 z-10 shadow-[0_0_30px_rgba(255,255,255,0.5)]'></div>

			{/* Glitch Particles */}
			<div className='absolute -right-10 -top-10 w-4 h-4 bg-white animate-pulse'></div>
			<div className='absolute -left-5 bottom-10 w-8 h-8 bg-white opacity-50'></div>
			<div className='absolute right-0 bottom-0 w-2 h-2 bg-white'></div>
		</div>
	);
};

export default VoxelCube;
