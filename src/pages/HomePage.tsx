import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import ScrollCollapseSection from '../components/ScrollCollapseSection';
import Sponsors from '../components/Sponsors';
import WarpBackground from '../components/WarpBackground';
import { CONTENT } from '../content';
import { useSEO } from '../hooks/useSEO';
import OrganizationPage from './OrganizationPage';
import VenuePage from './VenuePage';

const HomePage: React.FC = () => {
	useSEO('首頁', 'TAICHI 2026 台灣人機互動研討會。主題：Big Bang! Futures! 探索未來人機互動。');

	// 這裡接收從 ScrollCollapseSection 傳來的純粹動畫進度 (0 到 1)
	const [transitionProgress, setTransitionProgress] = useState(0);
	const [collapseActive, setCollapseActive] = useState(false);

	// 從什麼時候開始 (0~1) 讓底下的內容浮出來。0.5 代表當向下捲動動畫跑到一半 (50%) 時開始浮現。
	const CONTENT_APPEAR_THRESHOLD = 0.5;

	// 重新推算底層內容的專屬動畫比例 (先算出 0~1 的線性進度)
	const rawContentProgress = Math.max(0, (transitionProgress - CONTENT_APPEAR_THRESHOLD) / (1 - CONTENT_APPEAR_THRESHOLD));

	// ⭐ 新增：底部文字「浮出與淡入」的專屬 Ease-In / Ease-Out 曲線設定！
	// 數字越大，文字浮出來的時候就會「極快地先出現大半，然後花時間慢慢到位 (Ease-Out 煞車感)」。
	// 這樣就不會死板板的等速出現了！你可以把這裡設定成 3 或 4 感受一下。
	const FADE_EASE_RATE = 4;
	const contentProgress = 1 - Math.pow(1 - rawContentProgress, FADE_EASE_RATE);

	// 可以自由決定淡入的曲線 (現在是直接沿用原本的線性變數)
	const themeFade = contentProgress;

	// 控制底下物件從多深的地方浮上來 (單位: vh)，數字越大浮起距離越長
	const FLOAT_DISTANCE_VH = 20;
	const themeTranslateY = (1 - contentProgress) * FLOAT_DISTANCE_VH;

	return (
		<>
			{/* HERO — scroll-collapse animation */}
			<ScrollCollapseSection
				onProgress={(progress, active) => {
					setTransitionProgress(progress);
					setCollapseActive(active);
				}}
			/>

			{/* 
				Negative margin pulls the document flow up by 100vh.
			  This aligns the top of this wrapper EXACTLY to the viewport top when ScrollCollapseSection finishes its 300vh scroll progress.
			*/}
			<div className='bg-black w-full min-h-screen flex flex-col' style={{ marginTop: '-100vh' }}>
				{/* 
					Placeholder to reserve height so layout doesn't shift when section becomes fixed out-of-flow.
					This prevents the "disappearing and reappearing from bottom" bug.
				*/}
				<div style={{ minHeight: '100dvh', width: '100%' }}>
					{/* THEME (Intro) AND COUNTDOWN */}
					<section
						id='theme'
						className='bg-black w-full min-h-[100dvh] flex flex-col items-center justify-start pt-[120px] pb-20 px-6 md:px-20 relative overflow-x-hidden overflow-y-auto'
						style={
							collapseActive
								? {
										position: 'fixed',
										inset: 0,
										zIndex: 45, // Places theme ON TOP of lime circle (which is z-index 40) avoiding the "green ball obscuring" bug.
										opacity: themeFade,
										// Remove transform from here so the black background + stars only fade in, and don't slide up!
										pointerEvents: themeFade > 0 ? 'auto' : 'none',
									}
								: {
										position: 'relative',
										zIndex: 45,
									} // Normal flow once animation is perfectly aligned
						}
					>
						<WarpBackground />

						<div
							className='relative z-10 flex flex-col items-center w-full max-w-8xl my-auto'
							style={collapseActive ? { transform: `translateY(${themeTranslateY}vh)` } : undefined}
						>
							<div className='w-full mb-5'>
								<div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-6'>
									<div className='text-white font-roboto font-bold text-center'>
										<div className='text-2xl md:text-3xl text-lab-lime mb-2 tracking-wider font-mono'>
											THE SUBMISSION DEADLINE
										</div>
										<div className='text-base md:text-lg text-gray-200 font-bold'>2026/6/18(四) 23:59 (GMT+8)</div>
									</div>
									<div className='transform scale-[70%] md:scale-[80%] mt-2'>
										<CountdownTimer targetDateStr='2026-06-18T23:59:00+08:00' />
									</div>
								</div>
							</div>
							<Link to='/cfp'>
								<button className='bg-[#FF0033] text-white font-bold py-3 md:py-4 px-12 md:px-16 rounded-full hover:bg-white hover:text-[#FF0033] transition-colors text-lg md:text-xl tracking-wider mb-14 shadow-[0_0_20px_rgba(255,0,77,0.6)]'>
									SUBMIT NOW!
								</button>
							</Link>

							<div className='w-full flex flex-col gap-10 font-mono text-white/90 leading-loose text-sm md:text-base'>
								<h1 className='text-xl md:text-3xl text-center mb-2 md:mb-4 tracking-widest font-normal drop-shadow-lg text-white'>
									TAICHI2026主題：Big Bang! Futures!
								</h1>

								<div className='flex flex-col max-w-7xl mx-auto mb-4'>
									<p className='text-center tracking-wide text-lg md:text-xl leading-relaxed'>
										未來將不再以低語傳遞，而是以爆炸式發生。
										<br />
										The future doesn't whisper; it bangs!
									</p>
								</div>
								<div className='flex flex-col gap-12 max-w-7xl mx-auto'>
									<p className='text-justify tracking-wide '>
										本次大會主題「Big Bang! Futures」
										源自宇宙霹靂般的起始瞬間——爆炸、火花與生命的誕生，也象徵想法快速擴散、改變世界的一刻。我們將這個瞬間帶進城市，化為一個可以逛、可以玩、可以一起參與的未來現場，透過互動裝置、實驗作品與夜市般的體驗空間，邀請民眾親身感受並討論科技如何影響未來生活與彼此之間的關係，讓多重未來在連鎖爆發中持續
										Big Bang！
									</p>
									<p className='text-justify tracking-wide '>
										The future doesn't whisper; it bangs! The theme Big Bang! Futures is inspired by the universe’s
										first spark—when explosion, energy, and life began. We bring this moment into the city as a future
										you can walk through, play with, and experience together. Through interactive works, experimental
										pieces, and a night-market atmosphere, the public is invited to explore how technology shapes future
										ways of living and relating—letting us BANG i nto multiple futures again and again!
									</p>
								</div>
							</div>
						</div>
					</section>
				</div>

				{/* VENUE Section */}
				{/* <section id='venue'>
					<VenuePage />
				</section> */}

				{/* ORGANIZATION Section */}
				<section id='organization'>
					<OrganizationPage hidePeople={true} />
				</section>
			</div>
		</>
	);
};

export default HomePage;
