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

	const [transitionProgress, setTransitionProgress] = useState(0);
	const [collapseActive, setCollapseActive] = useState(false);

	const CONTENT_APPEAR_THRESHOLD = 0.5;
	const rawContentProgress = Math.max(0, (transitionProgress - CONTENT_APPEAR_THRESHOLD) / (1 - CONTENT_APPEAR_THRESHOLD));
	const FADE_EASE_RATE = 4;
	const contentProgress = 1 - Math.pow(1 - rawContentProgress, FADE_EASE_RATE);
	const FLOAT_DISTANCE_VH = 20;
	const nextSectionOpacity = contentProgress;
	const nextSectionTranslateY = (1 - contentProgress) * FLOAT_DISTANCE_VH;
	const themeTitleParts = content.theme.title.split(/(?=Big Bang! Futures!)/);

		return (
		<>
			<ScrollCollapseSection
				onProgress={(progress, active) => {
					setTransitionProgress(progress);
					setCollapseActive(active);
				}}
			/>

			<div className='bg-black w-full min-h-screen flex flex-col' style={{ marginTop: '-100vh' }}>
				<div style={{ minHeight: '100dvh', width: '100%' }}>
					<section
						className='relative overflow-hidden bg-black px-5 py-16 sm:px-6 md:py-24'
						style={
							collapseActive
								? {
										position: 'fixed',
										inset: 0,
										zIndex: 25,
										opacity: nextSectionOpacity,
										transform: `translateY(${nextSectionTranslateY}vh)`,
										pointerEvents: nextSectionOpacity > 0 ? 'auto' : 'none',
									}
								: {
										position: 'relative',
										zIndex: 25,
									}
						}
					>
						<WarpBackground />
						<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
						<div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black' />
						<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.15),transparent_36%),radial-gradient(circle_at_bottom,rgba(243,99,88,0.12),transparent_38%)]' />

						<div className='relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1180px] items-center justify-center'>
							<div className='flex w-full max-w-[54rem] flex-col items-start text-left'>
								<ScrollReveal delay={0}>
									<p className='ds-section-kicker'>
										{language === 'zh' ? 'Theme Introduction' : 'Theme Introduction'}
									</p>
								</ScrollReveal>
								<ScrollReveal delay={80}>
									<h2 className='mt-5 text-[2.5rem] font-semibold uppercase tracking-[0.04em] text-white sm:text-[3.2rem] md:text-[4.4rem]'>
										<span className='block'>{themeTitleParts[0]?.trim() ?? content.theme.title}</span>
										{themeTitleParts[1] ? <span className='mt-2 block'>{themeTitleParts[1].trim()}</span> : null}
									</h2>
								</ScrollReveal>
								<ScrollReveal delay={140}>
									<p className='mt-6 max-w-[42rem] text-[1.15rem] font-medium leading-relaxed text-[#A8F020] sm:text-[1.28rem] md:text-[1.45rem]'>
										{content.theme.slogan}
									</p>
								</ScrollReveal>
								<ScrollReveal delay={220}>
									<p className='mt-8 max-w-[52rem] text-[1rem] leading-8 text-white/78 sm:text-[1.05rem] md:text-[1.12rem]'>
										{content.theme.description}
									</p>
								</ScrollReveal>
							</div>
						</div>
					</section>
				</div>

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
