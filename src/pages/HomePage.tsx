import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import PixelTransition from '../components/PixelTransition';
import Sponsors from '../components/Sponsors';
import WarpBackground from '../components/WarpBackground';
import { CONTENT } from '../content';
import OrganizationPage from './OrganizationPage';
import VenuePage from './VenuePage';

const HomePage: React.FC = () => {
	return (
		<>
			{/* HERO SECTION */}
			<section className='relative w-full min-h-screen bg-lab-lime flex flex-col justify-center items-center px-4 overflow-hidden text-center pt-16'>
				<div className='z-10 flex flex-col items-center max-w-7xl w-full'>
					<img
						src='/images/home_bg.png'
						alt='Big Bang Futures'
						className='w-[90%] md:w-[85%] max-w-5xl mb-8 object-contain drop-shadow-xl'
					/>

					<div className='relative mt-16 md:mt-24 max-w-[876px] w-full mx-auto pb-12 px-8'>
						{/* TIMELINE GRAPHIC (Line + Dots) */}
						<div className='relative w-full h-4 flex items-center mb-6'>
							{/* The Line */}
							<div className='absolute left-0 right-0 h-[2px] bg-[#F7616C] z-0'></div>

							{/* The Dots */}
							<div className='absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7616C] rounded-full z-10 -translate-x-1/2'></div>
							<div className='absolute left-[31.7%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7616C] rounded-full z-10 -translate-x-1/2'></div>
							<div className='absolute left-[66.6%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7616C] rounded-full z-10 -translate-x-1/2'></div>
							<div className='absolute left-[100%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7616C] rounded-full z-10 -translate-x-1/2'></div>
						</div>

						{/* TEXT COLUMNS */}
						<div className='relative w-full text-black font-mono h-24'>
							<div className='absolute left-0 top-0 -translate-x-1/2 flex flex-col items-center w-32'>
								<div className='text-xl md:text-2xl font-bold'>8/3</div>
								<div className='text-sm md:text-lg'>APMAR</div>
							</div>

							<div className='absolute left-[31.7%] top-0 -translate-x-1/2 flex flex-col items-center w-32'>
								<div className='text-xl md:text-2xl font-bold'>8/4</div>
								<div className='text-sm md:text-lg'>APMAR</div>
							</div>

							<div className='absolute left-[66.6%] top-0 -translate-x-1/2 flex flex-col items-center w-48'>
								<div className='text-xl md:text-2xl font-bold'>8/5</div>
								<div className='text-sm md:text-lg text-center leading-tight mt-1'>
									TAICHI BIG BANG
									<br />
									互動夜市
								</div>
							</div>

							<div className='absolute left-[100%] top-0 -translate-x-1/2 flex flex-col items-center w-40'>
								<div className='text-xl md:text-2xl font-bold'>8/6</div>
								<div className='text-sm md:text-lg text-center'>TAICHI ISAT</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className='bg-black w-full min-h-screen flex flex-col'>
				{/* THEME (Intro) AND COUNTDOWN */}
				<section
					id='theme'
					className='bg-black w-full min-h-[100dvh] flex flex-col items-center justify-center py-20 px-6 md:px-20 relative overflow-hidden'
				>
					<WarpBackground />

					<div className='relative z-10 flex flex-col items-center w-full max-w-6xl'>
						<div className='text-[#FF0033] font-mono font-bold tracking-widest mb-6 md:mb-8 uppercase text-lg md:text-xl'>
							TIL THE SUBMITION DEADLINE
						</div>

						<div className='mb-6 transform scale-75 md:scale-100'>
							<CountdownTimer />
						</div>

						<button className='bg-[#FF0033] text-white font-bold py-3 md:py-4 px-12 md:px-16 rounded-full hover:bg-white hover:text-[#FF0033] transition-colors text-lg md:text-xl tracking-wider mb-10 shadow-[0_0_20px_rgba(255,0,77,0.6)]'>
							SUBMIT NOW!
						</button>

						<div className='w-full flex flex-col gap-10 font-mono text-white/90 leading-loose text-sm md:text-base'>
							<h2 className='text-xl md:text-3xl text-center mb-8 md:mb-12 tracking-widest font-normal drop-shadow-lg text-white'>
								TAICHI'26's Main Theme -- Big Bang! Futures!
							</h2>

							<div className='flex flex-col gap-12 max-w-5xl mx-auto'>
								<p className='text-justify tracking-wide '>
									未來將不再以低語傳遞，而是以爆炸式發生。本次大會主題 Big Bang! Futures,
									源自宇宙霹靂般的起始瞬間——爆炸、火花與生命的誕生，也象徵想法快速擴散、改變世界的一刻。我們將這個瞬間帶進城市，化為一個可以逛、可以玩、可以一起參與的未來現場，透過互動裝置、實驗作品與夜市般的體驗空間，邀請民眾親身感受並討論科技如何影響未來生活與彼此之間的關係，讓多重未來在連鎖爆發中持續
									Big Bang!
								</p>

								<p className='text-justify tracking-wide '>
									The future doesn't whisper; it bangs! The theme Big Bang! Futures is inspired by the universe’s first
									spark—when explosion, energy, and life began. We bring this moment into the city as a future you can
									walk through, play with, and experience together. Through interactive works, experimental pieces, and a
									night-market atmosphere, the public is invited to explore how technology shapes future ways of living
									and relating—letting us BANG i nto multiple futures again and again!
								</p>
							</div>
						</div>
					</div>
				</section>

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
