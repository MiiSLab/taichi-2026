import React from 'react';

interface SkeletonProps {
	variant?: 'card' | 'text' | 'circle' | 'news' | 'person';
	count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ variant = 'card', count = 1 }) => {
	const items = Array.from({ length: count }, (_, i) => i);

	if (variant === 'news') {
		return (
			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{items.map((i) => (
					<div key={i} className='animate-pulse'>
						{/* Image skeleton */}
						<div className='aspect-[3/2] bg-gray-200 rounded-t'></div>
						{/* Content skeleton */}
						<div className='p-6 bg-white border border-gray-200 rounded-b'>
							<div className='h-3 bg-gray-200 rounded w-1/4 mb-3'></div>
							<div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
							<div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
							<div className='h-4 bg-gray-200 rounded w-5/6'></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (variant === 'person') {
		return (
			<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
				{items.map((i) => (
					<div key={i} className='animate-pulse text-center'>
						<div className='w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4'></div>
						<div className='h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2'></div>
						<div className='h-3 bg-gray-200 rounded w-1/2 mx-auto'></div>
					</div>
				))}
			</div>
		);
	}

	if (variant === 'circle') {
		return (
			<div className='flex gap-4'>
				{items.map((i) => (
					<div key={i} className='w-24 h-24 rounded-full bg-gray-200 animate-pulse'></div>
				))}
			</div>
		);
	}

	if (variant === 'text') {
		return (
			<div className='space-y-3'>
				{items.map((i) => (
					<div key={i} className='h-4 bg-gray-200 rounded animate-pulse'></div>
				))}
			</div>
		);
	}

	// Default card variant
	return (
		<div className='space-y-4'>
			{items.map((i) => (
				<div key={i} className='border border-gray-200 rounded-lg p-6 animate-pulse'>
					<div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
					<div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
					<div className='h-4 bg-gray-200 rounded w-5/6'></div>
				</div>
			))}
		</div>
	);
};

export default Skeleton;
