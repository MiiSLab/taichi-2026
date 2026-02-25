import React from 'react';
import { CONTENT } from '../content';

const Sponsors: React.FC = () => {
	const { organizers, coOrganizers, sponsors, organizerTitle, sponsorTitle } = CONTENT.sponsorsSection;

	const LogoPlaceholder = ({ name, size }: { name: string; size?: string }) => (
		<div
			className={`
            bg-gray-100 border border-gray-200 flex items-center justify-center text-center p-2 rounded-md transition-all hover:bg-white hover:border-lab-orange
            ${size === 'large' ? 'h-32 w-64 text-2xl' : 'h-24 w-48 text-xl'}
        `}
		>
			<span className='font-pixel text-gray-400'>{name}</span>
		</div>
	);

	const LogoItem = ({ item }: { item: { name: string; logo: string; size: string } }) => (
		<div className='flex items-center justify-start group'>
			{/* Use img tag here, but fall back gracefully if not found. For now, using placeholder logic */}
			<img
				src={item.logo}
				alt={item.name}
				onError={(e) => {
					e.currentTarget.style.display = 'none';
					e.currentTarget.parentElement?.classList.add('fallback-mode');
				}}
				className='h-auto max-h-24 w-auto object-contain hidden'
			/>
			{/* For now, purely Placeholder until user uploads images */}
			<LogoPlaceholder name={item.name} size={item.size} />
		</div>
	);

	// Actual Image Renderer that shows Placeholder if error
	const ImageOrPlaceholder = ({ item }: { item: { name: string; logo: string; size: string; className?: string } }) => {
		const [imgError, setImgError] = React.useState(false);

		// Helper to construct correct path with Base URL
		const getSafePath = (path: string) => {
			if (!path) return '';
			if (path.startsWith('http')) return path; // External link
			// Prevent double slash if BASE_URL ends with / and path starts with /
			const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
			const cleanPath = path.startsWith('/') ? path : `/${path}`;
			return `${base}${cleanPath}`;
		};

		const imgSrc = getSafePath(item.logo);

		if (imgError || !item.logo) {
			return <LogoPlaceholder name={item.name} size={item.size} />;
		}

		return (
			<div
				className={`transition-transform duration-300 hover:scale-105 flex items-center justify-center bg-transparent rounded-3xl hover:bg-black/5 transition-all duration-300 [&>img]:mix-blend-multiply  ${item.className || ''}`}
				title={item.name}
			>
				<img
					src={imgSrc}
					alt={item.name}
					onError={() => setImgError(true)}
					className={`object-contain ${item.size === 'large' ? 'h-32' : 'h-20'}`}
				/>
			</div>
		);
	};

	return (
		<section className='py-24 px-6 md:px-20 bg-gray-50 text-lab-dark border-t border-gray-200'>
			<div className='max-w-7xl mx-auto space-y-24'>
				{/* ORGANIZERS SECTION */}
				<div>
					<h2 className='font-pixel text-5xl mb-12 text-lab-dark'>{organizerTitle}</h2>
					<div className='bg-white rounded-3xl p-8 md:p-16 border border-gray-200 shadow-sm'>
						{/* Host */}
						<div className='mb-16 border-b border-gray-200 pb-16 last:border-0 last:pb-0'>
							<h3 className='font-pixel text-2xl text-lab-orange mb-10 tracking-widest uppercase'>Main Organizers</h3>
							<div className='flex flex-wrap gap-x-16 gap-y-8 items-center'>
								{organizers.map((item, idx) => (
									<ImageOrPlaceholder key={idx} item={item} />
								))}
							</div>
						</div>

						{/* Co-Host */}
						<div>
							<h3 className='font-pixel text-2xl text-gray-700 mb-10 tracking-widest uppercase'>Co-Organizers</h3>
							<div className='flex flex-wrap gap-x-16 gap-y-8 items-center'>
								{coOrganizers.map((item, idx) => (
									<ImageOrPlaceholder key={idx} item={item} />
								))}
							</div>
						</div>
					</div>
				</div>

				{/* SPONSORS SECTION */}
				<div>
					<h2 className='font-pixel text-5xl mb-12 text-lab-dark'>{sponsorTitle}</h2>
					<div className='bg-white rounded-3xl p-8 md:p-16 border border-gray-200 shadow-sm'>
						<div className='flex flex-wrap gap-x-16 gap-y-8 items-center'>
							{sponsors.map((item, idx) => (
								<ImageOrPlaceholder key={idx} item={item} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Sponsors;
