import React from 'react';
import { CONTENT } from '../content';

const Sponsors: React.FC = () => {
	const { organizers, coOrganizers, sponsors, organizerTitle, sponsorTitle } = CONTENT.sponsorsSection;

	// Actual Image Renderer that robustly handles fallbacks
	const ImageBlock = ({ item }: { item: { name: string; logo: string; size: string } }) => {
		const [imgError, setImgError] = React.useState(false);

		const getSafePath = (path: string) => {
			if (!path) return '';
			if (path.startsWith('http')) return path; // External link
			const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
			const cleanPath = path.startsWith('/') ? path : `/${path}`;
			return `${base}${cleanPath}`;
		};

		const imgSrc = getSafePath(item.logo);

		if (imgError || !item.logo) {
			// Placeholder
			return (
				<div className='bg-[#F5F5F5] border border-gray-200 flex items-center justify-center text-center p-4 rounded-xl transition-all h-24 w-48'>
					<span className='font-mono text-xs text-gray-500 font-bold'>{item.name}</span>
				</div>
			);
		}

		return (
			<div
				className='bg-[#F7F7F7] rounded-xl px-6 py-4 flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 shadow-sm'
				title={item.name}
			>
				<img
					src={imgSrc}
					alt={item.name}
					onError={() => setImgError(true)}
					className='object-contain h-16 md:h-16 mix-blend-darken'
				/>
			</div>
		);
	};

	return (
		<section className='py-20 px-10 md:px-16 bg-black min-h-screen'>
			<div className='max-w-4xl mx-auto flex flex-col items-center'>
				{/* ORGANIZERS SECTION */}
				<div className='w-full mb-24'>
					{/* Title */}
					<h2 className='font-mono md:font-pixel text-4xl md:text-5xl font-bold mb-12 text-lab-lime uppercase tracking-[0.2em] text-center'>
						{organizerTitle}
					</h2>

					<div className='flex flex-col gap-8 w-full'>
						{/* Main Organizers Card */}
						<div className='bg-white rounded-[20px] p-6 md:p-8 w-full shadow-2xl'>
							<h3 className='font-mono text-xs md:text-sm font-bold tracking-widest uppercase mb-6 text-black'>
								Main Organizers
							</h3>
							<div className='flex flex-wrap gap-4'>
								{organizers.map((item, idx) => (
									<ImageBlock key={idx} item={item} />
								))}
							</div>
						</div>

						{/* Co-Organizers Card */}
						<div className='bg-white rounded-[20px] p-6 md:p-8 w-full shadow-2xl'>
							<h3 className='font-mono text-xs md:text-sm font-bold tracking-widest uppercase mb-6 text-black'>
								Co-Organizers
							</h3>
							<div className='flex flex-wrap gap-4'>
								{coOrganizers.map((item, idx) => (
									<ImageBlock key={idx} item={item} />
								))}
							</div>
						</div>
					</div>
				</div>

				{/* SPONSORS SECTION */}
				<div className='w-full'>
					{/* Title */}
					<h2 className='font-mono md:font-pixel text-4xl md:text-5xl font-bold mb-12 text-lab-lime uppercase tracking-[0.2em] text-center'>
						{sponsorTitle}
					</h2>

					{/* Sponsors Card */}
					<div className='bg-white rounded-[20px] p-6 md:p-8 w-full shadow-2xl'>
						<div className='flex flex-wrap gap-4'>
							{sponsors.map((item, idx) => (
								<ImageBlock key={idx} item={item} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Sponsors;
