import React from 'react';
import { CONTENT } from '../content';

const Sponsors: React.FC = () => {
	const { organizers, coOrganizers, sponsors, organizerTitle, sponsorTitle } = CONTENT.sponsorsSection;

	const LogoPlaceholder = ({ name, size }: { name: string; size?: string }) => (
		<div
			className={`
            bg-white/10 border border-white/20 flex items-center justify-center text-center p-2 rounded-md transition-all hover:bg-white/20 hover:border-lab-orange
            ${size === 'large' ? 'h-32 w-64 text-2xl' : 'h-24 w-48 text-xl'}
        `}
		>
			<span className='font-pixel text-white/50'>{name}</span>
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
	const ImageOrPlaceholder = ({ item }: { item: { name: string; logo: string; size: string } }) => {
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
			<img
				src={imgSrc}
				alt={item.name}
				onError={() => setImgError(true)}
				className={`object-contain transition-transform duration-300 hover:scale-105 ${item.size === 'large' ? 'h-32' : 'h-20'}`}
			/>
		);
	};

	return (
		<section className='py-24 px-6 md:px-20 bg-lab-dark text-white border-t border-white/10'>
			<div className='max-w-7xl mx-auto space-y-24'>
				{/* ORGANIZERS SECTION */}
				<div>
					<h2 className='font-pixel text-5xl mb-12 text-white'>{organizerTitle}</h2>
					<div className='bg-white/5 rounded-3xl p-8 md:p-16 border border-white/10 backdrop-blur-sm'>
						{/* Host */}
						<div className='mb-16 border-b border-white/10 pb-16 last:border-0 last:pb-0'>
							<h3 className='font-pixel text-2xl text-lab-orange mb-10 tracking-widest uppercase'>Main Organizers</h3>
							<div className='flex flex-wrap gap-x-16 gap-y-8 items-center'>
								{organizers.map((item, idx) => (
									<ImageOrPlaceholder key={idx} item={item} />
								))}
							</div>
						</div>

						{/* Co-Host */}
						<div>
							<h3 className='font-pixel text-2xl text-white/70 mb-10 tracking-widest uppercase'>Co-Organizers</h3>
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
					<h2 className='font-pixel text-5xl mb-12 text-white'>{sponsorTitle}</h2>
					<div className='bg-white/5 rounded-3xl p-8 md:p-16 border border-white/10 backdrop-blur-sm'>
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
