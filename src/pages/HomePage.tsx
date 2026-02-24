import React from 'react';
import NewsSection from '../components/NewsSection';
import PixelTransition from '../components/PixelTransition';
import Sponsors from '../components/Sponsors';
import VoxelCube from '../components/VoxelCube';
import { CONTENT } from '../content';

const HomePage: React.FC = () => {
	return (
		<>
			{/* HERO SECTION */}
			<section className='relative w-full min-h-screen bg-lab-orange flex flex-col justify-center items-center px-4 overflow-hidden text-center text-white'>
				<div className='z-10 flex flex-col items-center max-w-5xl w-full'>
					<div className='mb-8'>
						<VoxelCube />
					</div>
					<h1 className='text-6xl md:text-9xl font-pixel leading-none tracking-tighter mb-4 animate-pulse'>
						{CONTENT.hero.titleLine1}
						<br />
						{CONTENT.hero.titleLine2}
					</h1>
					<div className='text-white text-xl md:text-2xl font-mono tracking-wide mt-8 border-l-4 border-white/50 pl-6 text-left inline-block max-w-full'>
						<div className='mb-2'>{CONTENT.hero.subtitle}</div>
						<div className='text-3xl md:text-5xl font-bold text-white tracking-normal mt-3 leading-tight drop-shadow-md'>
							<span className='block xl:inline'>{CONTENT.hero.date}</span>
							<br />
							<span className='block xl:inline mt-2 xl:mt-0'>{CONTENT.hero.location}</span>
						</div>
					</div>
				</div>
			</section>

			<PixelTransition />

			{/* THEME (Intro) */}
			<section id='theme' className='py-24 px-6 md:px-20 bg-lab-white'>
				<div className='max-w-4xl mx-auto text-center md:text-left'>
					<h2 className='text-4xl md:text-6xl font-pixel text-lab-orange mb-12 uppercase whitespace-pre-line'>
						{CONTENT.theme.title}
					</h2>
					<div className='grid md:grid-cols-2 gap-12 text-lg leading-relaxed text-gray-800'>
						<p>{CONTENT.theme.p1}</p>
						<p>{CONTENT.theme.p2}</p>
					</div>
				</div>
			</section>

			<NewsSection limit={3} />

			<Sponsors />
		</>
	);
};

export default HomePage;
