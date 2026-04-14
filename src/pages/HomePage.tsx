import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import ScrollReveal from '../components/ScrollReveal';
import ScrollCollapseSection from '../components/ScrollCollapseSection';
import Sponsors from '../components/Sponsors';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import ConstellationMapSection from '../components/ConstellationMap';
import { useSEO } from '../hooks/useSEO';

// 主視覺尚未完成，暫時隱藏整個 ScrollCollapseSection 過場動畫。
// 主圖製作完成後，將此旗標改回 true 即可恢復。
const HERO_COLLAPSE_ENABLED = false;

const HomePage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const homeCfpButtonLabel = language === 'zh' ? '立即投稿' : 'Submit Now';
	useSEO(
		language === 'zh' ? '首頁' : 'Home',
		language === 'zh'
			? 'TAICHI 2026 台灣人機互動研討會。主題：Big Bang! Futures!'
			: 'TAICHI 2026 conference website. Theme: Big Bang! Futures!',
	);

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
			{HERO_COLLAPSE_ENABLED && (
				<ScrollCollapseSection
					onProgress={(progress, active) => {
						setTransitionProgress(progress);
						setCollapseActive(active);
					}}
				/>
			)}

			{/*
				Negative margin pulls the document flow up by 100vh.
			  This aligns the top of this wrapper EXACTLY to the viewport top when ScrollCollapseSection finishes its 300vh scroll progress.
			*/}
			<div className='bg-black w-full min-h-screen flex flex-col' style={HERO_COLLAPSE_ENABLED ? { marginTop: '-100vh' } : undefined}>
				{/* 
					Placeholder to reserve height so layout doesn't shift when section becomes fixed out-of-flow.
					This prevents the "disappearing and reappearing from bottom" bug.
				*/}
				<div style={{ minHeight: '100dvh', width: '100%' }}>
					{/* THEME (Intro) AND COUNTDOWN */}
					<section
						id='theme'
						className='relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black px-5 pb-10 pt-[88px] sm:px-6 md:px-20 md:pb-12 md:pt-[100px]'
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
							className='relative z-10 my-auto flex w-full max-w-8xl flex-col items-center'
							style={collapseActive ? { transform: `translateY(${themeTranslateY}vh)` } : undefined}
						>
							<div className='flex w-full max-w-[22rem] flex-col gap-5 font-sans text-sm leading-7 text-white/90 sm:max-w-[28rem] md:max-w-5xl md:gap-8 md:text-base md:leading-loose'>
								<h1 className={`mb-1 font-dela ${typography.pattern.heroIntroTitle} text-lab-lime drop-shadow-[0_0_15px_rgba(168,240,32,0.5)] md:mb-2`}>
									{language === 'zh' ? (
										<>
											<span className='block text-center md:hidden'>TAICHI2026主題：</span>
											<span className='block text-center md:hidden'>Big Bang! Futures!</span>
											<span className='hidden md:block'>{content.theme.title}</span>
										</>
									) : (
										content.theme.title
									)}
								</h1>

								<div className='mb-1 flex flex-col md:mx-auto md:max-w-4xl'>
									<p className={`${typography.pattern.heroIntroLead} text-white`}>{content.theme.slogan}</p>
								</div>
								<div className='flex flex-col gap-4 md:mx-auto md:max-w-5xl md:gap-6'>
									<p className={`${typography.pattern.heroIntroBody} text-white/80`}>{content.theme.description}</p>
								</div>
							</div>
						</div>
					</section>
				</div>

				<ScrollReveal delay={40}>
					<section className='relative overflow-hidden bg-black px-5 py-16 sm:px-6 md:py-24'>
						<WarpBackground />
						<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
						<div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black' />

						<div className='relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10'>
							<div className='flex w-full max-w-[36rem] flex-col items-center text-center'>
								<div className='flex w-full flex-col items-center px-5 py-6 sm:px-6 md:px-8 md:py-8'>
									<ScrollReveal delay={0}>
										<p className='ds-section-kicker text-[16px] sm:text-[18px] md:text-[20px]'>
											{language === 'zh' ? '投稿截止日期：' : 'Submission Deadline: '}
											<span className='text-white'>{language === 'zh' ? '2026/06/18 23:59 (GMT+8)' : '2026/06/18 23:59 (GMT+8)'}</span>
										</p>
									</ScrollReveal>
									<ScrollReveal delay={90} className='mt-6 flex w-full justify-center'>
										<CountdownTimer targetDateStr='2026-06-18T23:59:00+08:00' variant='cfpHero' />
									</ScrollReveal>

									<ScrollReveal delay={180} className='mt-8'>
										<Link
											to='/cfp'
											className={`ds-button-submit min-w-[220px] px-5 py-4 ${typography.scale.buttonLabel} sm:min-w-[240px] sm:px-6`}
										>
											<span>{homeCfpButtonLabel}</span>
											<span className='text-[24px] leading-none'>→</span>
										</Link>
									</ScrollReveal>
								</div>
							</div>
						</div>
					</section>
				</ScrollReveal>

				<ConstellationMapSection language={language} />

				<ScrollReveal delay={80}>
					<section id='important-dates' className='relative flex min-h-[78dvh] w-full flex-col items-center justify-center bg-black px-5 pb-20 pt-16 sm:px-6 md:min-h-[88dvh] md:px-20 md:pb-24 md:pt-12'>
						<div className='relative z-10 flex w-full max-w-[1453px] flex-col items-center'>
							<ScrollReveal delay={0}>
								<h3 className='ds-section-title mb-10 text-center md:mb-12'>
									{content.cfpSection.importantDatesTitle}
								</h3>
							</ScrollReveal>
							<div className='mx-auto grid w-full auto-rows-fr grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-stretch xl:max-w-[1220px] xl:gap-0'>
								{content.cfpSection.heroTimelineItems.map((item, index) => (
									<ScrollReveal key={item.title} delay={80 + index * 70} className='w-full'>
										<div
											className={`flex h-full min-h-[112px] w-full max-w-[28rem] flex-col items-center justify-start rounded-none bg-white/5 px-3 py-4 text-center sm:max-w-none xl:bg-transparent xl:px-6 xl:py-0 ${index < content.cfpSection.heroTimelineItems.length - 1 ? 'xl:border-r xl:border-white/10' : ''}`}
										>
											<p className={`${typography.scale.sectionEyebrow} text-[#A8F020]`}>{item.title}</p>
											<p className={`mt-[14px] ${typography.scale.deadlineValue} text-white`}>{item.date}</p>
											<p className={`mt-2 ${typography.scale.deadlineMeta} text-white/50`}>{item.subtitle}</p>
										</div>
									</ScrollReveal>
								))}
							</div>
						</div>
					</section>
				</ScrollReveal>

				<ScrollReveal delay={120}>
					<div>
						<Sponsors />
					</div>
				</ScrollReveal>
			</div>
		</>
	);
};

export default HomePage;
