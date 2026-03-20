import { ExternalLink } from 'lucide-react';
import React from 'react';
import { CONTENT } from '../content';

const VenuePage: React.FC = () => {
	return (
		<section className='py-24 px-6 md:px-20 bg-black min-h-screen'>
			<div className='max-w-6xl mx-auto'>
				<div className='flex flex-col items-center justify-center mb-24'>
					<h2 className='text-5xl md:text-7xl font-mono md:font-pixel font-bold text-lab-lime tracking-widest text-center uppercase'>
						{CONTENT.venueSection.title}
					</h2>
				</div>

				<div className='flex flex-col gap-24 md:gap-32 mb-24'>
					{CONTENT.venueSection.venues.map((venue, idx) => (
						<div key={idx} className='flex flex-col md:flex-row gap-12 md:gap-20 items-start w-full max-w-5xl mx-auto'>
							<div className='flex flex-col flex-1'>
								{/* Pill Badge */}
								<div className='mb-10'>
									<div className='inline-flex items-center px-6 md:px-12 py-2 bg-[#FF004D] text-white font-mono text-lg md:text-xl font-bold tracking-widest rounded-full whitespace-nowrap shadow-lg shadow-[#FF004D]/30'>
										{idx === 0 ? '8/5' : '8/6'} &nbsp; [{venue.day.toUpperCase()}]
									</div>
								</div>

								{/* Titles */}
								<div className='flex flex-col gap-8 flex-1 justify-center mb-8'>
									<h3 className='font-mono font-bold text-xl md:text-3xl text-white tracking-widest leading-snug break-all md:break-normal'>
										{idx === 0 ? 'TAICHI BIG BANG 互動夜市' : 'TAICHI ISAT'}
									</h3>

									<div className='flex flex-col gap-4 font-mono mt-2 md:mt-4'>
										<p className='text-white text-sm md:text-base max-w-sm tracking-wide leading-relaxed'>
											{venue.name}
										</p>
										<p className='text-white text-sm md:text-base max-w-sm tracking-wide leading-relaxed'>
											{venue.address}
										</p>
									</div>
								</div>

								{/* Open Map Button (Optional / Original logic kept for mobile users) */}
								{venue.mapLink && venue.mapLink !== '#' && (
									<a
										href={venue.mapLink}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex md:hidden items-center justify-center gap-2 mt-4 bg-lab-lime text-black px-6 py-3 font-mono font-bold hover:bg-white transition-colors rounded-lg shadow-md uppercase self-start w-full sm:w-auto'
									>
										OPEN MAP <ExternalLink size={16} />
									</a>
								)}
							</div>

							{/* Map iframe */}
							{venue.embedSrc && (
								<div className='flex-1 w-full relative h-[300px] md:h-[400px] rounded-[24px] overflow-hidden shadow-2xl'>
									{/* The container for google map should clip the corners */}
									<div className='w-full h-full bg-white/10 rounded-[24px] overflow-hidden border-2 border-white/5 filter opacity-90 hover:opacity-100 transition-opacity'>
										<iframe
											width='100%'
											height='100%'
											frameBorder='0'
											scrolling='no'
											src={venue.embedSrc}
											title={`Map ${venue.name}`}
											className='w-full h-full'
										></iframe>
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Hidden temporarily to match Image 7, uncomment if needed later */}
				{/* <div className='bg-lab-pink text-white text-center rounded-3xl p-12 shadow-2xl mt-48 hidden'>
					<h2 className='font-pixel text-5xl mb-8'>{CONTENT.registrationSection.title}</h2>
					<p className='font-mono text-xl opacity-80 mb-12'>{CONTENT.registrationSection.info}</p>
					<button className='bg-white text-lab-pink font-pixel text-2xl px-12 py-4 rounded-full hover:scale-105 transition-transform shadow-lg'>
						{CONTENT.registrationSection.button}
					</button>
				</div> */}
			</div>
		</section>
	);
};

export default VenuePage;
