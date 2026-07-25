import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, ChevronUp, Clock, ExternalLink, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FramePanel from '../components/FramePanel';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { useContent, useLanguage } from '../context/LanguageContext';
import { panelFrame } from '../design-system/panel';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';

type V2Rate = { label: string; value: string };
type V2Stop = { name: string; routes: readonly string[] };
type V2TravelItem = {
	title: string;
	lines?: readonly string[];
	stops?: readonly V2Stop[];
	rates?: readonly V2Rate[];
	notes?: readonly string[];
};
type V2Link = { label: string; href: string };
type V2TravelPanel = {
	title: string;
	items: readonly V2TravelItem[];
	calloutTitle?: string;
	callout?: string;
	link?: V2Link;
	links?: readonly V2Link[];
	wide?: boolean;
	image?: { src: string; alt: string; caption?: string };
};
type V2Venue = {
	title: string;
	subtitle: string;
	addressLabel: string;
	addressZh: string;
	addressEn: string;
	venueLabel: string;
	venueName: string;
	hours?: string;
	entryNote?: string;
	photoImage: string;
	mapLink: string;
	mapEmbedSrc: string;
};
type V2EntryGuide = {
	title: string;
	badge: string;
	before: { timeLabel: string; text: string; mapLabel: string; mapLink: string };
	after: { timeLabel: string; text: string };
	sticker: { image: string; alt: string };
	locators: readonly { image: string; caption: string; alt: string }[];
	routeMap?: { image: string; caption: string; alt: string };
	videos: readonly { label: string; src: string }[];
};
type V2CampusMap = { title: string; image: string; caption: string; alt: string };
type V2Highlight = { label: string; venue: string; details: readonly string[]; scheduleLabel: string; scheduleTo: string };
type V2VenueInfo = {
	sectionTitle: string;
	name: string;
	addressLabel: string;
	address: string;
	schedule: readonly string[];
	entryNote?: string;
	mapEmbedSrc: string;
	mapLink: string;
};
type V2Day = {
	id: string;
	tabLabel: string;
	heroImage: string;
	heroTitle: string;
	heroBadge?: string;
	heroSubtitle: string;
	highlight: V2Highlight;
	venue: V2VenueInfo;
	entryGuide?: V2EntryGuide;
	campusMap?: V2CampusMap;
	travelPanels: readonly V2TravelPanel[];
};
type VenueV2Section = {
	title: string;
	topButton: string;
	overview: { title: string; intro: string; timeline: readonly { label: string; sublabel: string; key: 'preEvent' | 'day1' | 'day2' }[] };
	days: readonly V2Day[];
};

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

const LinkButton = ({ href, label }: { href: string; label: string }) => (
	<a
		href={href}
		target='_blank'
		rel='noopener noreferrer'
		className='inline-flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold transition-colors border border-primary bg-primary/10 text-primary hover:bg-primary/20'
	>
		<ExternalLink size={15} />
		{label}
	</a>
);

const ZoomableImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		document.addEventListener('keydown', onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = prev;
		};
	}, [open]);
	return (
		<>
			<img src={src} alt={alt} loading='lazy' onClick={() => setOpen(true)} className={`cursor-zoom-in transition hover:brightness-110 ${className ?? ''}`} />
			{open ? createPortal(
				<div className='fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 sm:p-10' onClick={() => setOpen(false)} role='dialog' aria-modal='true'>
					<img src={src} alt={alt} className='object-contain max-w-full max-h-full' onClick={(e) => e.stopPropagation()} />
					<button type='button' onClick={() => setOpen(false)} aria-label='關閉' className='absolute flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full right-4 top-4 bg-white/10 hover:bg-white/20'>
						<X size={22} />
					</button>
				</div>,
				document.body,
			) : null}
		</>
	);
};

const VideoCarousel = ({ videos, prevLabel, nextLabel }: { videos: readonly { label: string; src: string }[]; prevLabel: string; nextLabel: string }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);
	const [idx, setIdx] = useState(0);
	const touchX = useRef(0);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setActive(true);
					io.disconnect();
				}
			},
			{ rootMargin: '200px' },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);
	const n = videos.length;
	const go = (d: number) => setIdx((i) => (i + d + n) % n);
	const current = videos[idx];
	return (
		<div ref={ref} className='flex flex-col items-center gap-3'>
			<div className='flex items-center gap-2 sm:gap-4'>
				<button
					type='button'
					onClick={() => go(-1)}
					aria-label={prevLabel}
					className='flex items-center justify-center w-10 h-10 transition-colors border rounded-full shrink-0 border-primary/50 text-primary hover:bg-primary/15'
				>
					<ChevronLeft size={20} />
				</button>
				<div
					className='relative aspect-[9/16] w-[240px] max-w-[58vw] overflow-hidden rounded-[8px] border border-primary/20 bg-black sm:w-[340px] sm:max-w-none'
					onTouchStart={(e) => {
						touchX.current = e.touches[0].clientX;
					}}
					onTouchEnd={(e) => {
						const dx = e.changedTouches[0].clientX - touchX.current;
						if (dx > 40) go(-1);
						else if (dx < -40) go(1);
					}}
				>
					{active ? (
						<video key={current.src} src={current.src} controls playsInline preload='metadata' className='absolute inset-0 object-contain w-full h-full' />
					) : null}
				</div>
				<button
					type='button'
					onClick={() => go(1)}
					aria-label={nextLabel}
					className='flex items-center justify-center w-10 h-10 transition-colors border rounded-full shrink-0 border-primary/50 text-primary hover:bg-primary/15'
				>
					<ChevronRight size={20} />
				</button>
			</div>
			<p className='font-mono text-sm font-bold text-white/80'>{current.label}</p>
			<div className='flex gap-2'>
				{videos.map((video, i) => (
					<button
						key={video.src}
						type='button'
						onClick={() => setIdx(i)}
						aria-label={video.label}
						className={`h-2 w-2 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-white/30 hover:bg-white/50'}`}
					/>
				))}
			</div>
		</div>
	);
};

const OrientationPanel = ({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) => (
	<FramePanel className='bg-[rgba(9,9,11,0.8)]' contentClassName='px-6 py-6 md:px-10 md:py-10' cornerSize={16}>
		<div className={`${panelFrame.sectionDivider} mb-6 flex flex-wrap items-center gap-3`}>
			<h3 className='font-mono text-[24px] font-bold leading-8 text-white'>{title}</h3>
			{badge ? (
				<span className='inline-flex items-center rounded bg-secondary/15 px-2 py-0.5 font-pixel text-[14px] font-bold tracking-[0.1em] text-secondary'>
					{badge}
				</span>
			) : null}
		</div>
		{children}
	</FramePanel>
);

const EntryGuide = ({ guide, language }: { guide: V2EntryGuide; language: string }) => {
	const stickerHint = language === 'en' ? 'Follow the blue pumpkin markers on the ground' : '循地面「南瓜藍色指標」前進';
	const prevLabel = language === 'en' ? 'Previous video' : '上一支影片';
	const nextLabel = language === 'en' ? 'Next video' : '下一支影片';
	const locateLabel = language === 'en' ? 'On-site orientation' : '現場定位';
	const videoLabel = language === 'en' ? 'Walking route videos' : '路線影片';
	const scene = guide.locators[0];
	const locateImages = [...guide.locators.slice(1), ...(guide.routeMap ? [guide.routeMap] : [])];
	return (
		<OrientationPanel title={guide.title} badge={guide.badge}>
			<div className='rounded-[10px] border-l-4 border-primary bg-black/40 px-6 py-5'>
				<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-center'>
					<div>
						<div className='flex items-center gap-2 mb-3 font-mono text-sm font-bold text-primary'>
							<Clock size={15} />
							{guide.before.timeLabel}
						</div>
						<p className={`${typography.scale.body} text-white/85`}>{guide.before.text}</p>
						<div className='mt-4 flex w-fit items-center gap-3 rounded-[8px] border border-primary bg-black/40 p-3'>
							<ZoomableImage src={guide.sticker.image} alt={guide.sticker.alt} className='h-[76px] w-[76px] shrink-0 rounded-full border border-white/15 object-cover' />
							<div className='flex flex-col gap-1'>
								<span className='font-mono text-[13px] font-bold text-primary'>{stickerHint}</span>
								<span className='font-mono text-xs leading-5 text-white/60'>{guide.sticker.alt}</span>
							</div>
						</div>
					</div>
					{scene ? (
						<figure className='flex flex-col gap-2'>
							<ZoomableImage src={scene.image} alt={scene.alt} className='w-full rounded-[8px] border border-white/10' />
							<figcaption className='font-mono text-xs text-center text-white/60'>{scene.caption}</figcaption>
						</figure>
					) : null}
				</div>
			</div>
			<div className='mt-4 rounded-[10px] border-l-4 border-white/25 bg-black/40 px-6 py-5'>
				<div className='mb-2 flex items-center gap-2 font-mono text-sm font-bold text-white/80'>
					<Clock size={15} />
					{guide.after.timeLabel}
				</div>
				<p className={`${typography.scale.body} text-white/75`}>{guide.after.text}</p>
			</div>
			<div className='mt-10'>
				<h4 className='mb-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-secondary'>{locateLabel}</h4>
				<div className='grid gap-4 sm:grid-cols-2'>
					{locateImages.map((item) => (
						<figure key={item.image} className='flex flex-col overflow-hidden rounded-[10px] border border-white/10 bg-black/40'>
							<div className='flex h-[260px] items-center justify-center bg-black/50 p-3'>
								<ZoomableImage src={item.image} alt={item.alt} className='object-contain max-w-full max-h-full' />
							</div>
							<figcaption className='px-3 py-3 font-mono text-xs leading-5 text-center border-t border-white/10 text-white/70'>{item.caption}</figcaption>
						</figure>
					))}
				</div>
				<div className='flex justify-center mt-5'>
					<LinkButton href={guide.before.mapLink} label={guide.before.mapLabel} />
				</div>
			</div>
			<div className='mt-10'>
				<h4 className='mb-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-secondary'>{videoLabel}</h4>
				<VideoCarousel videos={guide.videos} prevLabel={prevLabel} nextLabel={nextLabel} />
			</div>
		</OrientationPanel>
	);
};

const CampusMap = ({ map }: { map: V2CampusMap }) => (
	<OrientationPanel title={map.title}>
		<div className='mx-auto max-w-2xl overflow-hidden rounded-[8px] bg-black p-2 md:p-4'>
			<ZoomableImage src={map.image} alt={map.alt} className='object-contain w-full h-auto mx-auto' />
		</div>
		<p className='mt-3 font-mono text-sm text-white/60'>{map.caption}</p>
	</OrientationPanel>
);

const RouteChips = ({ stops }: { stops: readonly V2Stop[] }) => (
	<div className='space-y-3'>
		{stops.map((stop) => (
			<div key={stop.name} className='flex flex-col gap-1.5'>
				<span className='font-mono text-sm text-white/70'>{stop.name}</span>
				<div className='flex flex-wrap gap-1.5'>
					{stop.routes.map((route) => (
						<span key={route} className='rounded bg-white/[0.08] px-2 py-0.5 font-mono text-xs text-white/80'>
							{route}
						</span>
					))}
				</div>
			</div>
		))}
	</div>
);

const TravelItemBody = ({ item }: { item: V2TravelItem }) => (
	<div className={`space-y-2 ${typography.scale.body} text-white/80`}>
		{item.lines ? item.lines.map((line) => <p key={line}>• {line}</p>) : null}
		{item.stops ? <RouteChips stops={item.stops} /> : null}
		{item.rates ? (
			<div className='mt-2 space-y-1'>
				{item.rates.map((rate) => (
					<div key={rate.label} className='flex gap-3'>
						<span className='shrink-0 text-white/55'>{rate.label}</span>
						<span>{rate.value}</span>
					</div>
				))}
			</div>
		) : null}
		{item.notes ? (
			<ul className='mt-2 space-y-1'>
				{item.notes.map((note) => (
					<li key={note}>• {note}</li>
				))}
			</ul>
		) : null}
	</div>
);

const VenueV2Page: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const venueContent = content.venueV2Section as unknown as VenueV2Section;
	const [showBackToTop, setShowBackToTop] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const activeIndex = location.hash === '#day2' ? 1 : 0;
	const activeDayData = venueContent.days[activeIndex] ?? venueContent.days[0];

	useSEO(
		language === 'zh' ? '場地資訊' : 'Venue',
		language === 'zh'
			? 'TAICHI 2026 場地與交通資訊：三創生活園區南瓜門進場指引與國立臺北科技大學。'
			: 'TAICHI 2026 venue and transit information: Pumpkin Gate entry guide at Syntrend Creative Park and NTUT.',
	);

	useEffect(() => {
		const handleScroll = () => setShowBackToTop(window.scrollY > 120);
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeIndex]);

	const scrollToTop = () => {
		setShowBackToTop(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<section className='w-full min-h-screen text-white bg-black'>
			<div className='relative flex flex-col items-center w-full px-6 pt-48 pb-16 overflow-hidden bg-black md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 flex flex-col items-center w-full max-w-7xl'>
					<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>{venueContent.title}</h1>
					<div className='flex w-full max-w-2xl'>
						{venueContent.days.map((day, index) => (
							<button
								key={day.id}
								type='button'
								onClick={() => navigate(`#day${index + 1}`)}
								className={`flex-1 border-2 py-3 font-mono text-xl font-bold transition-colors sm:text-2xl ${activeIndex === index ? 'border-primary bg-primary text-black' : 'border-primary/40 text-white/60 hover:text-white/80'}`}
							>
								{day.tabLabel}
							</button>
						))}
					</div>
				</ScrollReveal>
			</div>

			<div className='flex flex-col w-full'>
				{[activeDayData].map((day) => (
					<article key={day.id} id={day.id} className='scroll-mt-28'>
						<div
							className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-black md:min-h-[680px]'
							style={{
								backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.84) 52%, rgba(0, 0, 0, 0.45) 100%), url(${day.heroImage})`,
								backgroundPosition: 'center',
								backgroundSize: 'cover',
							}}
						>
							<div className='relative mx-auto flex h-full min-h-[420px] max-w-[1280px] items-center px-4 py-16 md:min-h-[680px] md:px-8 md:py-24'>
								<div className='max-w-[590px]'>
									<h2 className='ds-section-title mb-6 text-[2rem] md:text-[2.5rem] md:leading-[1.5]'>
										{day.heroTitle}
										{day.heroBadge ? (
											<span className='ms-3 inline-flex translate-y-[-0.2em] items-center rounded bg-secondary/15 px-2 py-0.5 align-middle font-pixel text-[16px] font-bold tracking-[0.1em] text-secondary'>
												{day.heroBadge}
											</span>
										) : null}
									</h2>
									<p className='mb-10 font-mono text-base font-bold text-primary md:text-[1.55rem] md:leading-9'>{day.heroSubtitle}</p>
									<ScrollReveal delay={40} className='max-w-[590px]'>
										<FramePanel className='bg-black/60' contentClassName='p-6 md:p-8'>
											<p className='mb-5 font-mono text-sm text-white/55'>{day.highlight.label}</p>
											<p className='mb-4 font-mono text-2xl font-bold leading-tight text-white md:text-[1.75rem]'>{day.highlight.venue}</p>
											<div className='space-y-2 font-mono text-sm leading-6 text-white/82 md:text-base'>
												{day.highlight.details.map((detail) => (
													<p key={detail}>{detail}</p>
												))}
											</div>
											<Link
												to={day.highlight.scheduleTo}
												className='mt-6 inline-flex items-center gap-2 border border-primary bg-primary/15 px-5 py-2.5 font-mono text-sm font-bold text-primary transition-colors hover:bg-primary/25'
											>
												<CalendarDays size={16} />
												{day.highlight.scheduleLabel}
											</Link>
										</FramePanel>
									</ScrollReveal>
								</div>
							</div>
						</div>

						<div className='bg-gradient-to-b from-black to-[#09090b] py-16 md:py-[65px]'>
							<div className='flex flex-col w-full gap-10 px-4 mx-auto max-w-7xl md:gap-12 md:px-8'>
								<ScrollReveal>
									<FramePanel className='bg-[rgba(9,9,11,0.8)]' contentClassName='px-6 py-6 md:px-10 md:py-10' cornerSize={16}>
										<div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-start'>
											<div>
												<div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
													<h3 className='font-mono text-[24px] font-bold leading-8 text-white'>{day.venue.sectionTitle}</h3>
													<span className='inline-flex items-center rounded bg-secondary/15 px-2.5 py-1 font-mono text-sm font-bold text-secondary'>{day.venue.name}</span>
												</div>
												<div className={`mt-4 ${typography.scale.body} text-white/80`}>
													<p>{day.venue.addressLabel}：{day.venue.address}</p>
													<div className='mt-4 space-y-4'>
														{day.venue.schedule.map((item) => {
															const [time, ...rest] = item.split('　');
															const place = rest.join('　');
															return (
																<div key={item} className='space-y-0.5'>
																	<p>{time}</p>
																	{place ? <p className='text-white/70'>{place}</p> : null}
																</div>
															);
														})}
													</div>
												</div>
												{day.venue.entryNote ? (
													<div className='mt-4 flex items-start gap-2 rounded-[8px] border border-primary bg-primary/10 px-3 py-2'>
														<AlertTriangle size={16} className='mt-0.5 shrink-0 text-primary' />
														<span className='font-mono text-[13px] font-bold leading-5 text-primary'>{day.venue.entryNote}</span>
													</div>
												) : null}
											</div>
											<div className='relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[#27272a] lg:aspect-[16/10]'>
												{day.venue.mapEmbedSrc ? (
													<iframe
														className='absolute inset-0 w-full h-full border-0'
														src={day.venue.mapEmbedSrc}
														title={day.venue.name}
														loading='lazy'
														referrerPolicy='no-referrer-when-downgrade'
													/>
												) : (
													<div className='flex items-center justify-center h-full px-6 font-mono text-sm text-center text-white/50'>[Google Maps 位置]</div>
												)}
											</div>
										</div>
									</FramePanel>
								</ScrollReveal>

								{day.entryGuide ? (
									<ScrollReveal>
										<EntryGuide guide={day.entryGuide} language={language} />
									</ScrollReveal>
								) : null}

								{day.campusMap ? (
									<ScrollReveal>
										<CampusMap map={day.campusMap} />
									</ScrollReveal>
								) : null}

								<div className='grid gap-6 xl:grid-cols-2 xl:gap-8'>
									{day.travelPanels.map((panel, index) => (
										<ScrollReveal key={`${day.id}-${panel.title}`} delay={index * 90} className={panel.wide ? 'xl:col-span-2' : ''}>
											<div className='ds-surface-soft h-full px-6 py-6 md:px-[41px] md:py-[41px]'>
												<h3 className='font-mono text-xl font-bold text-primary md:text-2xl'>{panel.title}</h3>
												<div className={panel.image ? 'mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start' : 'mt-8'}>
													<div className='space-y-8'>
														{panel.items.map((item) => (
															<div key={`${panel.title}-${item.title}`}>
																<h4 className='mb-3 font-mono text-lg font-bold text-white'>{item.title}</h4>
																<TravelItemBody item={item} />
															</div>
														))}

														{panel.callout ? (
															<div className='rounded-[10px] border-l-4 border-primary bg-black/40 px-6 py-5'>
																<p className='mb-3 font-mono text-sm font-bold text-primary'>{panel.calloutTitle}</p>
																<p className={`${typography.scale.body} text-white/80`}>{panel.callout}</p>
															</div>
														) : null}

														{panel.link || panel.links ? (
															<div className='flex flex-wrap gap-3'>
																{panel.link ? <LinkButton href={panel.link.href} label={panel.link.label} /> : null}
																{panel.links ? panel.links.map((l) => <LinkButton key={l.href} href={l.href} label={l.label} />) : null}
															</div>
														) : null}
													</div>
													{panel.image ? (
														<figure className='flex flex-col gap-2'>
															<ZoomableImage src={panel.image.src} alt={panel.image.alt} className='w-full rounded-[8px] border border-white/10' />
															{panel.image.caption ? <figcaption className='font-mono text-xs text-center text-white/60'>{panel.image.caption}</figcaption> : null}
														</figure>
													) : null}
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

export default VenueV2Page;
