import React from 'react';
import { Link } from 'react-router-dom';
import AnnouncementsSection from '../components/AnnouncementsSection';
import ConstellationMapSection from '../components/ConstellationMap';
import CountdownTimer from '../components/CountdownTimer';
import ScrollCollapseSection from '../components/ScrollCollapseSection';
import ScrollReveal from '../components/ScrollReveal';
import Sponsors from '../components/Sponsors';
import WarpBackground from '../components/WarpBackground';
import { useContent, useLanguage } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
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

	const themeTitleParts = content.theme.title.split(/(?=Big Bang! Futures!)/);

	return (
		<>
			<ScrollCollapseSection />

			<div className='flex flex-col w-full min-h-screen bg-black' style={{ marginTop: '-100vh' }}>
				{/* Latest announcements — first section, revealed as the BOOM hero circle collapses */}
				<AnnouncementsSection />

				<div style={{ minHeight: '100dvh', width: '100%' }}>
					<section className='relative z-[25] px-5 py-16 overflow-hidden bg-black sm:px-6 md:py-24'>
						<WarpBackground />
						<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
						<div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black' />
						<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.15),transparent_36%),radial-gradient(circle_at_bottom,rgba(243,99,88,0.12),transparent_38%)]' />

						<div className='relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1180px] items-center justify-center'>
							<div className='flex w-full max-w-[54rem] flex-col items-start text-left'>
								<ScrollReveal delay={0}>
									<p className='ds-section-kicker'>{language === 'zh' ? 'Theme Introduction' : 'Theme Introduction'}</p>
								</ScrollReveal>
								<ScrollReveal delay={80}>
									<h2 className='mt-5 text-[2.5rem] font-semibold uppercase tracking-[0.04em] text-white sm:text-[3.2rem] md:text-[4.4rem]'>
										<span className='block'>{themeTitleParts[0]?.trim() ?? content.theme.title}</span>
										{themeTitleParts[1] ? <span className='block mt-2'>{themeTitleParts[1].trim()}</span> : null}
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

				<section className='relative px-5 py-16 overflow-hidden bg-black sm:px-6 md:py-24'>
					<WarpBackground />
					<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
					<div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black' />

					<div className='relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10'>
						<div className='flex w-full max-w-[40rem] flex-col items-center text-center'>
							<div className='flex flex-col items-center w-full px-5 py-6 sm:px-6 md:px-8 md:py-8'>
								<ScrollReveal delay={0}>
									<p className='ds-section-kicker text-[16px] sm:text-[18px] md:text-[20px]'>
										{language === 'zh' ? '投稿截止日期：' : 'Submission Deadline: '}

										<span className='mr-2 line-through text-white/40 decoration-2'>2026/06/18</span>
										<span className='mr-2 text-white '>2026/06/23 23:59 (GMT+8)</span>
										<span className='inline-flex items-center rounded border font-bold border-[#FF5C5C]/60 bg-[#FF5C5C]/15 px-2 py-0.5 align-middle font-pixel text-[12px] tracking-[0.1em] text-[#FF6B6B]'>
											{language === 'zh' ? '已延期' : 'EXTENDED'}
										</span>
									</p>
								</ScrollReveal>
								<ScrollReveal delay={90} className='flex justify-center w-full mt-6'>
									<CountdownTimer targetDateStr='2026-06-23T23:59:00+08:00' variant='cfpHero' />
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
					<section
						id='important-dates'
						className='relative flex min-h-[78dvh] w-full flex-col items-center justify-center bg-black px-5 pb-20 pt-16 sm:px-6 md:min-h-[88dvh] md:px-20 md:pb-24 md:pt-12'
					>
						<div className='relative z-10 flex w-full max-w-[1453px] flex-col items-center'>
							<ScrollReveal delay={0}>
								<h3 className='mb-10 text-center ds-section-title md:mb-12'>{content.cfpSection.importantDatesTitle}</h3>
							</ScrollReveal>
							<div className='mx-auto grid w-full auto-rows-fr grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-stretch xl:max-w-[1220px] xl:gap-0'>
								{content.cfpSection.heroTimelineItems.map((item, index) => (
									<ScrollReveal key={item.title} delay={80 + index * 70} className='w-full'>
										<div
											className={`flex h-full min-h-[112px] w-full max-w-[28rem] flex-col items-center justify-start rounded-none bg-white/5 px-3 py-4 text-center sm:max-w-none xl:bg-transparent xl:px-6 xl:py-0 ${index < content.cfpSection.heroTimelineItems.length - 1 ? 'xl:border-r xl:border-white/10' : ''}`}
										>
											<p className={`${typography.scale.sectionEyebrow} text-[#A8F020]`}>
												{item.title}
												{item.oldDate ? (
													<span className='ms-2 mt-1 inline-flex items-center rounded font-bold bg-[#FF5C5C]/15 px-2 py-0.5 font-pixel text-[11px] tracking-[0.1em] text-[#FF6B6B]'>
														{language === 'zh' ? '已延期' : 'EXTENDED'}
													</span>
												) : null}
											</p>

											<p className={`mt-[14px] ${typography.scale.deadlineValue} text-white`}>
												{item.oldDate ? (
													<span className='mr-2 line-through text-white/40 decoration-2'>{item.oldDate}</span>
												) : null}
												{item.date}
											</p>
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
