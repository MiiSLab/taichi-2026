import { ChevronUp, ExternalLink } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import FramePanel from '../components/FramePanel';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { panelFrame } from '../design-system/panel';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const TimelineItem = ({
	label,
	sublabel,
	highlighted,
	widthClass,
	onHover,
	onSelect,
}: {
	label: string;
	sublabel: string;
	highlighted: boolean;
	widthClass: string;
	onHover: () => void;
	onSelect: () => void;
}) => (
	<button
		type='button'
		onMouseEnter={onHover}
		onFocus={onHover}
		onClick={onSelect}
		className={`relative z-10 flex ${widthClass} flex-col items-center text-center`}
	>
		<span
			className={`min-h-[24px] w-full text-center font-mono text-[16px] font-bold leading-6 transition-all duration-300 ${
				highlighted ? 'scale-110 text-primary' : 'text-[#D9D9D9]/70'
			}`}
		>
			{label}
		</span>
		<span className='mt-3 flex h-[15px] w-[15px] items-center justify-center'>
			<span
				className={`size-[15px] rounded-full border transition-all duration-300 ${
					highlighted
						? 'scale-[1.3] border-primary bg-primary shadow-[0_0_18px_rgba(41,185,58,0.7)]'
						: 'border-[#D9D9D9]/60 bg-[#D9D9D9]'
				}`}
			/>
		</span>
		<span
			className={`mt-3 min-h-[48px] w-full whitespace-pre-line text-center font-mono text-[14px] font-bold leading-6 transition-colors duration-300 ${
				highlighted ? 'text-primary' : 'text-[#D9D9D9]/70'
			}`}
		>
			{sublabel}
		</span>
	</button>
);

const VenuePage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const venueContent = content.venueSection;
	const [hoveredTimelineKey, setHoveredTimelineKey] = useState<string | null>(null);
	const [showBackToTop, setShowBackToTop] = useState(false);
	const mobileTimeline = [
		{ label: '8/3-4', sublabel: 'APMAR', key: 'preEvent' as const },
		{ label: '8/5', sublabel: 'TAICHI\n晶創人文\nAPMAR\nISAT', key: 'day1' as const },
		{ label: '8/6', sublabel: 'TAICHI', key: 'day2' as const },
	];

	useSEO(
		language === 'zh' ? '場地資訊 VENUE' : 'Venue',
		language === 'zh'
			? 'TAICHI 2026 場地資訊：三創生活園區與國立臺北科技大學。'
			: 'TAICHI 2026 venue information for Syntrend Creative Park and National Taipei University of Technology.',
	);

	useEffect(() => {
		const handleScroll = () => {
			const scrolledPastHeader = window.scrollY > 120;
			const jumpedToSection = ['#venue-overview', '#venue-day-1', '#venue-day-2'].includes(window.location.hash);
			setShowBackToTop(scrolledPastHeader || jumpedToSection);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('hashchange', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('hashchange', handleScroll);
		};
	}, []);

	const scrollToSection = (target: string) => {
		document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		window.history.replaceState(null, '', `#${target}`);
	};

	const handleTimelineClick = (key: 'preEvent' | 'day1' | 'day2') => {
		if (key === 'preEvent') {
			window.open('https://sites.google.com/view/apmar2026/', '_blank', 'noopener,noreferrer');
		} else if (key === 'day1') {
			scrollToSection('venue-day-1');
		} else if (key === 'day2') {
			scrollToSection('venue-day-2');
		}
	};

	const scrollToTop = () => {
		if (window.location.hash) {
			window.history.replaceState(null, '', window.location.pathname + window.location.search);
		}
		setShowBackToTop(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<section className='min-h-screen w-full bg-black text-white'>
			<div className='relative flex w-full flex-col items-center overflow-hidden bg-black px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 flex w-full max-w-7xl flex-col items-center'>
						<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>
							{venueContent.title}
						</h1>
				</ScrollReveal>
			</div>

			<div className='flex w-full flex-col'>
				<section id='venue-overview' className='scroll-mt-28 bg-gradient-to-b from-black to-[#09090b] px-4 pb-20 pt-12 md:px-8 md:pb-24 md:pt-16'>
					<div className='mx-auto flex w-full max-w-7xl flex-col gap-10'>
						<ScrollReveal>
							<div className='ds-surface-panel px-6 py-8 md:px-10 md:py-10'>
								<h2 className={`mb-6 text-center ${typography.scale.sectionTitle} text-white`}>
									{venueContent.overview.title}
								</h2>
								<p className={`mx-auto max-w-[740px] ${typography.scale.body} text-white/80`}>
									{venueContent.overview.intro}
								</p>

								<div className='relative mx-auto mt-12 w-full max-w-[980px] pb-2 pt-6 md:mt-14'>
									<div className='mx-auto w-full max-w-[340px] md:hidden'>
										<div className='relative'>
											<div className='absolute left-[7.5%] right-[7.5%] top-[43px] h-px bg-white/30' />
											<div className='grid grid-cols-3 items-start'>
												{mobileTimeline.map((item) => (
													<TimelineItem
														key={`${item.label}-${item.sublabel}`}
														label={item.label}
														sublabel={item.sublabel}
														highlighted={hoveredTimelineKey === item.key}
														widthClass='w-full'
														onHover={() => setHoveredTimelineKey(item.key)}
														onSelect={() => handleTimelineClick(item.key)}
													/>
												))}
											</div>
										</div>
									</div>

									<div className='relative mx-auto hidden w-full max-w-[958px] md:block'>
										<div className='absolute left-[24.5px] top-[43px] h-px w-[875.5px] bg-white/30' />
										<div
											className='absolute left-[24.5px] top-[43px] h-px bg-primary transition-all duration-300'
											style={{ width: hoveredTimelineKey === 'preEvent' ? '250px' : '0px' }}
										/>

										<div className='flex items-start justify-between'>
											{venueContent.overview.timeline.map((item, index) => {
											const highlighted = hoveredTimelineKey === item.key;
											const widthClass =
												index === 0 || index === 1
													? 'w-[49px]'
													: index === 2
														? 'w-[141px]'
														: 'w-[116px]';

											return (
												<TimelineItem
													key={`${item.label}-${item.sublabel}`}
													label={item.label}
													sublabel={item.sublabel}
													highlighted={highlighted}
													widthClass={widthClass}
													onHover={() => setHoveredTimelineKey(item.key)}
													onSelect={() => handleTimelineClick(item.key)}
												/>
											);
										})}
										</div>
									</div>
								</div>
							</div>
						</ScrollReveal>
					</div>
				</section>

				{venueContent.days.map(day => (
					<article key={day.id} id={day.id} className='scroll-mt-28'>
						<div
							className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-black md:min-h-[680px]'
							style={{
								backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.84) 52%, rgba(0, 0, 0, 0.45) 100%), url(${day.heroImage})`,
								backgroundPosition: 'center',
								backgroundSize: 'cover',
							}}
						>
							<div className='relative mx-auto flex min-h-[420px] h-full max-w-[1280px] items-center px-4 py-16 md:min-h-[680px] md:px-8 md:py-24'>
								<div className='max-w-[590px]'>
									<h2 className='ds-section-title mb-6 text-[2rem] md:text-[2.5rem] md:leading-[1.5]'>
										{day.heroTitle}
									</h2>
									<p className='mb-10 font-mono text-base font-bold text-primary md:text-[1.55rem] md:leading-9'>
										{day.heroSubtitle}
									</p>
									<ScrollReveal delay={40} className='max-w-[590px]'>
										<FramePanel className='bg-black/60' contentClassName='p-6 md:p-8'>
											<p className='mb-5 font-mono text-sm text-white/55'>{day.highlight.label}</p>
											<p className='mb-4 font-mono text-2xl font-bold leading-tight text-white md:text-[1.75rem]'>
												{day.highlight.venue}
											</p>
											<div className='space-y-2 font-mono text-sm leading-6 text-white/82 md:text-base'>
												{day.highlight.details.map(detail => (
													<p key={detail}>{detail}</p>
												))}
											</div>
											<p className='mt-6 font-mono text-sm leading-6 text-white/90 md:text-base'>{day.highlight.note}</p>
										</FramePanel>
									</ScrollReveal>
								</div>
							</div>
						</div>

						<div className='bg-gradient-to-b from-black to-[#09090b] py-16 md:py-[65px]'>
							<div className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 md:gap-12 md:px-8'>
								<div className='flex flex-col gap-8'>
									{day.venues.map((venue, index) => (
										<ScrollReveal key={`${day.id}-${venue.title}`} delay={index * 90}>
											<div className='grid gap-6 xl:grid-cols-[minmax(0,592px)_minmax(0,592px)] xl:justify-between xl:gap-8'>
												<FramePanel className='min-h-[420px] bg-[rgba(9,9,11,0.8)] md:min-h-[475px]' contentClassName='relative flex h-full min-h-[420px] flex-col md:min-h-[475px]' cornerSize={16}>
													<div className={`${panelFrame.sectionDivider} px-6 py-6 md:px-10 md:pb-[18px] md:pt-10`}>
														<h3 className='font-mono text-[24px] font-bold leading-8 text-white'>{venue.title}</h3>
													</div>
													<div className={`px-6 pt-5 ${typography.scale.body} text-white/80 md:px-10 md:pt-6`}>
														<p>{venue.venueName}</p>
														<p>{venue.addressLabel}：{language === 'en' ? venue.addressEn : venue.addressZh}</p>
													</div>
													<div className='mx-4 mb-4 mt-5 h-[280px] bg-[rgba(9,9,11,0.8)] p-4 md:absolute md:inset-x-4 md:bottom-4 md:top-[196px] md:mx-0 md:mb-0 md:mt-0 md:h-auto md:p-6'>
														<div className='relative h-full overflow-hidden bg-[#27272a]'>
															{venue.mapEmbedSrc ? (
																<iframe
																	className='absolute inset-0 h-full w-full border-0'
																	src={venue.mapEmbedSrc}
																	title={venue.title}
																	loading='lazy'
																	referrerPolicy='no-referrer-when-downgrade'
																/>
															) : (
																<div className='flex h-full items-center justify-center px-6 text-center font-mono text-sm text-white/50'>
																	[Google Maps 位置]
																</div>
															)}
														</div>
													</div>
												</FramePanel>

												<div className='relative min-h-[320px] md:min-h-[475px]'>
													<div className='absolute inset-4 overflow-hidden md:inset-[26px]'>
														<img
															src={venue.photoImage}
															alt={venue.title}
															className='h-full w-full object-cover opacity-80'
														/>
													</div>
												</div>
											</div>
										</ScrollReveal>
									))}
								</div>

								<div className='grid gap-6 xl:grid-cols-2 xl:gap-8'>
									{day.travelPanels.map((panel, index) => (
										<ScrollReveal key={`${day.id}-${panel.title}`} delay={index * 90}>
											<div className='ds-surface-soft h-full px-6 py-6 md:px-[41px] md:py-[41px]'>
												<h3 className='font-mono text-xl font-bold text-primary md:text-2xl'>{panel.title}</h3>
												<div className='mt-8 space-y-8'>
													{panel.items.map(item => (
														<div key={`${panel.title}-${item.title}`}>
															<h4 className='mb-3 font-mono text-lg font-bold text-white'>{item.title}</h4>
															<div className={`space-y-2 ${typography.scale.body} text-white/80`}>
																{item.lines.map(line => (
																	<p key={line}>• {line}</p>
																))}
															</div>
														</div>
													))}

													{panel.callout && (
														<div className='rounded-[10px] border-l-4 border-primary bg-black/40 px-6 py-5'>
															<p className='mb-3 font-mono text-sm font-bold text-primary'>{panel.calloutTitle}</p>
															<p className={`${typography.scale.body} text-white/80`}>{panel.callout}</p>
														</div>
													)}
												</div>
											</div>
										</ScrollReveal>
									))}
								</div>
							</div>
						</div>
					</article>
				))}
			</div>

			<button
				type='button'
				onClick={scrollToTop}
				aria-label='Back to top'
				className={`ds-backtotop fixed bottom-6 right-6 z-50 text-lg ${
					showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
				}`}
			>
				<ChevronUp size={18} />
				{venueContent.topButton}
			</button>
		</section>
	);
};

export default VenuePage;
