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
			<div className='flex items-center justify-center transition-transform duration-300 hover:-translate-y-1' title={item.name}>
				<img
					src={imgSrc}
					alt={item.name}
					onError={() => setImgError(true)}
					className='object-contain h-14 md:h-16 mix-blend-darken filter drop-shadow-sm'
				/>
			</div>
		);
	};

	return (
		<section className='py-28 px-10 md:px-16 bg-[#FAFAFA] text-black w-full min-h-screen flex flex-col justify-center'>
			<div className='max-w-4xl mx-auto flex flex-col items-center w-full'>
				{/* ORGANIZERS SECTION */}
				<div className='w-full mb-32 flex flex-col items-center'>
					{/* Title */}
					<h2 className='font-mono md:font-pixel text-4xl md:text-5xl font-bold mb-16 text-[#FF0033] uppercase tracking-[0.2em] text-center'>
						{organizerTitle}
					</h2>

					<div className='flex flex-col gap-16 w-full'>
						{/* Main Organizers */}
						<div className='w-full flex flex-col'>
							<h3 className='font-mono text-base md:text-lg font-bold tracking-[0.2em] uppercase mb-8 text-[#111]'>
								Main Organizers
							</h3>
							<div className='flex flex-wrap gap-8 md:gap-12'>
								{organizers.map((item, idx) => (
									<ImageBlock key={idx} item={item} />
								))}
							</div>
						</div>

						{/* Co-Organizers */}
						{coOrganizers.length > 0 && (
							<div className='w-full flex flex-col'>
								<h3 className='font-mono text-base md:text-lg font-bold tracking-[0.2em] uppercase mb-8 text-[#111]'>
									Co-Organizers
								</h3>
								<div className='flex flex-wrap gap-8 md:gap-12'>
									{coOrganizers.map((item, idx) => (
										<ImageBlock key={idx} item={item} />
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='w-full flex flex-col items-center'>
					{/* Title */}
					<h2 className='font-mono md:font-pixel text-4xl md:text-5xl font-bold mb-16 text-[#FF0033] uppercase tracking-[0.2em] text-center'>
						{sponsorTitle}
					</h2>

					{/* Sponsors List */}
					<div className='w-full flex flex-col'>
						<div className='flex flex-wrap gap-8 md:gap-12'>
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
