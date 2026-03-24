import { ExternalLink } from 'lucide-react';
import React from 'react';
import { CONTENT } from '../content';
import { useSEO } from '../hooks/useSEO';

const VenuePage: React.FC = () => {
	useSEO('場地資訊VENUE', 'TAICHI 2026 會議地點資訊。DAY 1: 三創生活園區, DAY 2: 國立臺北科技大學。');
	return (
		<section className='bg-black min-h-screen text-white w-full'>
			{/* Top Hero-like Title Section without 100dvh to prevent vertical centering */}
			<div className='w-full pt-32 pb-16 px-6 md:px-20 relative overflow-hidden'>
				<div className='flex flex-col items-center max-w-7xl mx-auto relative z-10 w-full'>
					<h1 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] uppercase'>
						{CONTENT.venueSection.title}
					</h1>
				</div>
				{/* Global Venue Descriptions from content.ts */}
				{CONTENT.venueSection.description && (
					<div className='max-w-7xl mx-auto'>
						<div className='w-full mb-20'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
								{CONTENT.venueSection.description.map((desc, idx) => {
									return (
										<div
											key={idx}
											className='bg-[#111111] border border-white/5 p-4 md:p-8 rounded-[24px] hover:bg-[#151515] hover:border-[#a8f020]/30 transition-all duration-300 flex flex-col gap-3 group shadow-lg'
										>
											<div className='font-pixel text-[#a8f020] text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 origin-left'>
												0{idx + 1}
											</div>
											<p className='text-gray-300 text-sm md:text-base tracking-wide leading-relaxed text-justify'>
												{desc}
											</p>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</div>

			<div className='max-w-6xl mx-auto px-6 md:px-20 pb-24'>
				<div className='flex flex-col gap-24 md:gap-32 mb-24'>
					{CONTENT.venueSection.venues.map((venue, idx) => (
						<div key={idx} className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 w-full max-w-5xl mx-auto'>
							{/* Left: text content */}
							<div className='flex flex-col'>
								{/* Pill Badge */}
								<div className='mb-10'>
									<div className='inline-flex items-center px-6 md:px-12 py-2 bg-[#FF0033] text-white font-mono text-lg md:text-xl font-bold tracking-widest rounded-full whitespace-nowrap shadow-lg shadow-[#FF0033]/30'>
										{venue.day.toUpperCase()}&nbsp;[{idx === 0 ? '8/5 四' : '8/6 五'}]
									</div>
								</div>

								{/* Titles */}
								<div className='flex flex-col gap-8 flex-1 justify-center mb-8'>
									<h3 className='font-mono font-bold text-xl md:text-3xl text-white tracking-widest leading-snug break-all md:break-normal'>
										{idx === 0 ? 'TAICHI BIG BANG 互動夜市' : 'TAICHI'}
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

								{/* Open Map Button (mobile only) */}
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

							{/* Right: Map — fills the entire grid cell */}
							{venue.embedSrc && (
								<div className='relative min-h-[300px] rounded-[24px] overflow-hidden shadow-2xl'>
									<iframe
										style={{
											position: 'absolute',
											inset: 0,
											width: '100%',
											height: '100%',
											border: 'none',
											opacity: 0.9,
										}}
										src={venue.embedSrc}
										title={`Map ${venue.name}`}
										scrolling='no'
									></iframe>
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
