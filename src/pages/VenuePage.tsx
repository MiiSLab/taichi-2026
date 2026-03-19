import { ExternalLink, MapPin } from 'lucide-react';
import React from 'react';
import { CONTENT } from '../content';

const DefaultsIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<circle cx='12' cy='12' r='10' />
		<path d='M12 6v6l4 2' />
	</svg>
);

const VenuePage: React.FC = () => {
	return (
		<section className='py-24 px-6 md:px-20 bg-transparent'>
			<div className='max-w-6xl mx-auto'>
				<div className='flex flex-col items-center justify-center mb-16'>
					<h2 className='text-5xl md:text-7xl font-pixel text-lab-lime drop-shadow-md mb-4 text-center'>{CONTENT.venueSection.title}</h2>
				</div>

				<div className='flex flex-col gap-12 mb-24'>
					{CONTENT.venueSection.venues.map((venue, idx) => (
						<div
							key={idx}
							className='flex flex-col md:flex-row gap-12 items-center w-full max-w-5xl mx-auto py-8'
						>
							<div className='flex-1 w-full'>
								<div className='flex items-center gap-4 mb-6'>
									<span className='px-4 py-1.5 bg-lab-pink text-white font-mono text-sm md:text-base rounded-full shadow-md font-bold uppercase tracking-wider'>
										{venue.day}
									</span>
									<h3 className='font-pixel text-3xl md:text-4xl text-white tracking-widest'>{venue.name}</h3>
								</div>

								<div className='space-y-4 font-mono text-white/90'>
									<div className='flex items-start gap-4'>
										<MapPin className='text-lab-lime flex-shrink-0 mt-1' />
										<p className='text-lg break-all'>{venue.address}</p>
									</div>
									<div className='flex items-start gap-4'>
										<DefaultsIcon className='text-lab-lime flex-shrink-0 mt-1' />
										<p className='whitespace-pre-line text-white/60'>
											{/* Placeholder for detailed venue info (Floor, Classroom, Position) */}
											{venue.details}
										</p>
									</div>
								</div>

								{venue.mapLink && venue.mapLink !== '#' && (
									<a
										href={venue.mapLink}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center gap-2 mt-8 bg-lab-lime text-lab-black px-6 py-3 font-mono font-bold hover:bg-white transition-colors rounded-lg shadow-md hover:-translate-y-1 transform uppercase'
									>
										OPEN MAP <ExternalLink size={16} />
									</a>
								)}
							</div>

							{venue.embedSrc && (
								<div className='flex-1 w-full h-64 md:h-80 bg-gray-300 rounded-xl overflow-hidden relative shadow-[0_0_15px_rgba(255,255,255,0.1)] filter grayscale-[50%] hover:grayscale-0 transition-all border border-white/20'>
									<iframe
										width='100%'
										height='100%'
										frameBorder='0'
										scrolling='no'
										src={venue.embedSrc}
										title={`Map ${venue.name}`}
									></iframe>
								</div>
							)}
						</div>
					))}
				</div>

				<div className='bg-lab-pink text-white text-center rounded-3xl p-12 shadow-2xl'>
					<h2 className='font-pixel text-5xl mb-8'>{CONTENT.registrationSection.title}</h2>
					<p className='font-mono text-xl opacity-80 mb-12'>{CONTENT.registrationSection.info}</p>
					<button className='bg-white text-lab-pink font-pixel text-2xl px-12 py-4 rounded-full hover:scale-105 transition-transform shadow-lg'>
						{CONTENT.registrationSection.button}
					</button>
				</div>
			</div>
		</section>
	);
};
export default VenuePage;
