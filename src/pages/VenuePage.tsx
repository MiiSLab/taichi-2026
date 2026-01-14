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
		<section className='pt-32 pb-24 px-6 md:px-20 bg-gray-50 min-h-screen'>
			<div className='max-w-6xl mx-auto'>
				<div className='flex flex-col items-center justify-center mb-16'>
					<h2 className='text-5xl md:text-7xl font-pixel text-lab-dark mb-4 text-center'>{CONTENT.venueSection.title}</h2>
				</div>

				<div className='flex flex-col md:flex-row gap-12 items-center mb-24'>
					<div className='flex-1'>
						<div className='space-y-4 font-mono text-gray-700'>
							<div className='flex gap-4'>
								<MapPin className='text-lab-orange flex-shrink-0' />
								<p>{CONTENT.venueSection.address}</p>
							</div>
							<div className='flex gap-4'>
								<DefaultsIcon className='text-lab-orange flex-shrink-0' />
								<p className='whitespace-pre-line'>{CONTENT.venueSection.transport}</p>
							</div>
						</div>
						<a
							href={CONTENT.venueSection.mapLink}
							target='_blank'
							rel='noopener noreferrer'
							className='inline-flex items-center gap-2 mt-8 bg-lab-dark text-white px-6 py-3 font-pixel hover:bg-lab-orange transition-colors'
						>
							OPEN MAP <ExternalLink size={16} />
						</a>
					</div>
					<div className='flex-1 w-full h-64 bg-gray-300 rounded overflow-hidden relative shadow-lg'>
						<iframe
							width='100%'
							height='100%'
							frameBorder='0'
							scrolling='no'
							src='https://maps.google.com/maps?q=National%20Taiwan%20University&t=&z=13&ie=UTF8&iwloc=&output=embed'
							className='filter grayscale hover:grayscale-0 transition-all'
							title='Map'
						></iframe>
					</div>
				</div>

				<div className='bg-lab-orange text-white text-center rounded-3xl p-12 shadow-xl'>
					<h2 className='font-pixel text-5xl mb-8'>{CONTENT.registrationSection.title}</h2>
					<p className='font-mono text-xl opacity-80 mb-12'>{CONTENT.registrationSection.info}</p>
					<button className='bg-white text-lab-orange font-pixel text-2xl px-12 py-4 rounded hover:scale-105 transition-transform'>
						{CONTENT.registrationSection.button}
					</button>
				</div>
			</div>
		</section>
	);
};
export default VenuePage;
