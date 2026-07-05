import React from 'react';
import { Link } from 'react-router-dom';
import ConstellationMapSection from '../ConstellationMap';
import CountdownTimer from '../CountdownTimer';
import ScrollReveal from '../ScrollReveal';
import Sponsors from '../Sponsors';
import WarpBackground from '../WarpBackground';
import { useContent, useLanguage } from '../../context/LanguageContext';
import { typography } from '../../design-system/typography';

/**
 * The homepage content that lives below the hero (theme intro, event countdown,
 * constellation, important dates, sponsors). Kept separate from the hero so the
 * hero transition can be swapped independently. News lives on /news only.
 */
const HomeSections: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const homeCfpButtonLabel = language === 'zh' ? '立即投稿' : 'Submit Now';
	const themeTitleParts = content.theme.title.split(/(?=Big Bang! Futures!)/);

	return (
		<div className='flex w-full flex-col bg-black'>
			<section className='relative z-[25] overflow-hidden bg-black px-5 py-16 sm:px-6 md:py-24'>
				<WarpBackground />
				<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
				<div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black' />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.15),transparent_36%),radial-gradient(circle_at_bottom,rgba(243,99,88,0.12),transparent_38%)]' />

				<div className='relative z-10 mx-auto flex w-full max-w-[1180px] items-center justify-center'>
					<div className='flex w-full max-w-[54rem] flex-col items-start text-left'>
						<ScrollReveal delay={0}>
							<p className='ds-section-kicker'>{language === 'zh' ? 'Theme Introduction' : 'Theme Introduction'}</p>
						</ScrollReveal>
						<ScrollReveal delay={80}>
							<h2 className='mt-5 text-[2.5rem] font-semibold uppercase tracking-[0.04em] text-white sm:text-[3.2rem] md:text-[4.4rem]'>
								<span className='block'>{themeTitleParts[0]?.trim() ?? content.theme.title}</span>
								{themeTitleParts[1] ? <span className='mt-2 block'>{themeTitleParts[1].trim()}</span> : null}
							</h2>
						</ScrollReveal>
						<ScrollReveal delay={140}>
							<p className='mt-6 max-w-[42rem] text-[1.15rem] font-medium leading-relaxed text-primary sm:text-[1.28rem] md:text-[1.45rem]'>
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

			<section className='relative overflow-hidden bg-black px-5 py-16 sm:px-6 md:py-24'>
				<WarpBackground />
				<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
				<div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black' />

				<div className='relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10'>
					<div className='flex w-full max-w-[40rem] flex-col items-center text-center'>
						<div className='flex w-full flex-col items-center px-5 py-6 sm:px-6 md:px-8 md:py-8'>
							<ScrollReveal delay={0}>
								<p className='ds-section-kicker text-[16px] sm:text-[18px] md:text-[20px]'>
									{language === 'zh' ? '距離活動開始：' : 'Countdown to the event: '}
									<span className='mr-2 text-white'>2026/08/05 (GMT+8)</span>
								</p>
							</ScrollReveal>
							<ScrollReveal delay={90} className='mt-6 flex w-full justify-center'>
								<CountdownTimer targetDateStr='2026-08-05T00:00:00+08:00' variant='cfpHero' />
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
							<h3 className='ds-section-title mb-10 text-center md:mb-12'>{content.cfpSection.importantDatesTitle}</h3>
						</ScrollReveal>
						<div className='mx-auto grid w-full auto-rows-fr grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-stretch xl:max-w-[1220px] xl:gap-0'>
							{content.cfpSection.heroTimelineItems.map((item, index) => (
								<ScrollReveal key={item.title} delay={80 + index * 70} className='w-full'>
									<div
										className={`flex h-full min-h-[112px] w-full max-w-[28rem] flex-col items-center justify-start rounded-none bg-white/5 px-3 py-4 text-center sm:max-w-none xl:bg-transparent xl:px-6 xl:py-0 ${index < content.cfpSection.heroTimelineItems.length - 1 ? 'xl:border-r xl:border-white/10' : ''}`}
									>
										<p className={`${typography.scale.sectionEyebrow} text-primary`}>
											{item.title}
											{item.oldDate ? (
												<span className='ms-2 mt-1 inline-flex items-center rounded bg-secondary/15 px-2 py-0.5 font-pixel text-[11px] font-bold tracking-[0.1em] text-secondary'>
													{language === 'zh' ? '已延期' : 'EXTENDED'}
												</span>
											) : null}
										</p>

										<p className={`mt-[14px] ${typography.scale.deadlineValue} text-white`}>
											{item.oldDate ? <span className='mr-2 line-through decoration-2 text-white/40'>{item.oldDate}</span> : null}
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
	);
};

export default HomeSections;
