import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import PixelTransition from '../components/PixelTransition';
import Sponsors from '../components/Sponsors';
import { CONTENT } from '../content';
import OrganizationPage from './OrganizationPage';
import VenuePage from './VenuePage';

const HomePage: React.FC = () => {
	return (
		<>
			{/* HERO SECTION */}
			<section className='relative w-full min-h-screen bg-lab-lime flex flex-col justify-center items-center px-4 overflow-hidden text-center pt-16'>
				<div className='z-10 flex flex-col items-center max-w-5xl w-full'>
					<img
						src='/images/home_bg.png'
						alt='Big Bang Futures'
						className='w-[90%] md:w-[70%] max-w-3xl mb-8 object-contain drop-shadow-xl'
					/>

					<div className='flex justify-center gap-12 mt-8 text-lab-black font-bold text-sm md:text-base'>
						<div className='flex flex-col items-center gap-2'>
							<div className='w-4 h-4 bg-lab-pink rounded-full shadow-[0_0_10px_rgba(255,0,102,0.6)]'></div>
							<div className='font-mono text-center'>
								AUG
								<br />
								4/Tue
							</div>
							<div className='text-xs font-mono uppercase mt-2 opacity-80'>VENUE 1</div>
						</div>
						<div className='flex flex-col items-center gap-2'>
							<div className='w-4 h-4 bg-lab-pink rounded-full shadow-[0_0_10px_rgba(255,0,102,0.6)]'></div>
							<div className='font-mono text-center'>
								AUG
								<br />
								5/Wed
							</div>
							<div className='text-xs font-mono uppercase text-center mt-2 opacity-80'>
								VENUE 1<br />
								VENUE 2
							</div>
						</div>
						<div className='flex flex-col items-center gap-2'>
							<div className='w-4 h-4 bg-lab-pink rounded-full shadow-[0_0_10px_rgba(255,0,102,0.6)]'></div>
							<div className='font-mono text-center'>
								AUG
								<br />
								6/Thu
							</div>
							<div className='text-xs font-mono uppercase mt-2 opacity-80'>VENUE 2</div>
						</div>
					</div>
				</div>
			</section>

			<div className='bg-starry w-full min-h-screen flex flex-col'>
				{/* COUNTDOWN & SUBTITLE */}
				<section className='py-20 flex flex-col items-center text-center px-4'>
					<div className='text-lab-pink font-pixel tracking-widest mb-4 uppercase text-sm md:text-base'>
						TILL THE SUBMISSION DEADLINE
					</div>

					<CountdownTimer />

					<button className='bg-lab-pink text-white font-bold py-3 px-12 rounded-full hover:bg-white hover:text-lab-pink transition-colors text-lg tracking-wider border-2 border-transparent hover:border-lab-pink'>
						SUBMIT NOW
					</button>

					<div className='mt-20 text-white font-mono text-2xl md:text-3xl tracking-widest max-w-3xl px-6 uppercase opacity-90'>
						TAICHI 2026's Main Theme — Big Bang! Futures!
					</div>
				</section>

				{/* THEME (Intro) */}
				<section id='theme' className='py-12 px-6 md:px-20'>
					<div className='max-w-4xl mx-auto bg-white text-black rounded-xl p-8 md:p-12 shadow-2xl'>
						<h2 className='text-4xl md:text-5xl font-pixel text-lab-lime bg-lab-black inline-block px-6 py-3 rounded-lg mb-8 uppercase whitespace-pre-line shadow-md'>
							{CONTENT.theme.title}
						</h2>
						<div className='grid md:grid-cols-2 gap-8 text-lg leading-relaxed font-medium'>
							<p>{CONTENT.theme.p1}</p>
							<p>{CONTENT.theme.p2}</p>
						</div>
					</div>
				</section>

				{/* Theme Intro Note: Ensure next section handles any padding appropriately */}

				{/* VENUE Section */}
				<section id='venue'>
					<VenuePage />
				</section>

				{/* ORGANIZATION Section */}
				<section id='organization'>
					<OrganizationPage />
				</section>
			</div>
		</>
	);
};

export default HomePage;
