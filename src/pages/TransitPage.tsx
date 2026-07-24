import { CalendarDays, ExternalLink } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import FramePanel from '../components/FramePanel';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

// content.transitSection 以 as unknown as 斷言成明確型別（仿 ProgramPage），
// 避開 as const tuple 讓選填欄位（link / map）在 union 上不可存取的問題。
type TransitMap = { embedSrc?: string | null; mapLink?: string | null };
type TransitTravelItem = { title: string; lines: readonly string[] };
type TransitTravelPanel = {
	title: string;
	items: readonly TransitTravelItem[];
	link?: { label: string; href: string };
	map?: TransitMap;
};
type TransitVenue = {
	title: string;
	name: string;
	addressLabel: string;
	address: string;
	schedule: readonly string[];
	mapEmbedSrc: string | null;
	mapLink: string | null;
};
type TransitEntryGuide = { title: string; steps: readonly string[]; mapEmbedSrc: string | null; mapLink: string | null };
type TransitRouteMap = { image: string | null; alt: string; subtitles: readonly string[] };
type TransitVideo = { label: string; src: string | null };
type TransitHighlight = { label: string; venue: string; details: readonly string[]; scheduleLabel: string; scheduleTo: string };
type TransitDay = {
	id: string;
	heroImage: string;
	heroTitle: string;
	heroBadge?: string;
	heroSubtitle: string;
	highlight: TransitHighlight;
	sectionTitle: string;
	venue: TransitVenue;
	entryGuide: TransitEntryGuide;
	areaMap?: { image: string; alt: string };
	routeMap: TransitRouteMap;
	videos: readonly TransitVideo[];
	travelPanels: readonly TransitTravelPanel[];
};
type TransitSection = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	dateTabs: readonly { key: string; date: string; day: string }[];
	openMapLabel: string;
	mapPlaceholder: string;
	videoPlaceholder: string;
	days: readonly TransitDay[];
};

// 橘色區塊大標（08/05 交通方式 / 南瓜門 / 大眾交通…）— 沿用 ProgramPage 段落標題樣式
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
	<h2 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{children}</h2>
);

// 綠色子標題（場地名 / 捷運 MRT / 城市車旅…）
const SubHeading = ({ children }: { children: React.ReactNode }) => (
	<p className='font-mono text-[22px] font-bold leading-8 text-secondary sm:text-[24px]'>{children}</p>
);

// 白色內文段落群
const Lines = ({ lines }: { lines: readonly string[] }) => (
	<div className={`space-y-1 ${typography.scale.body} leading-8 text-white/80`}>
		{lines.map((line) => (
			<p key={line}>{line}</p>
		))}
	</div>
);

// 「在 Google Maps 開啟」/ 外部連結按鈕
const LinkButton = ({ href, label }: { href: string; label: string }) => (
	<a
		href={href}
		target='_blank'
		rel='noopener noreferrer'
		className='inline-flex w-fit items-center gap-2 border border-primary bg-primary/15 px-5 py-2.5 font-mono text-sm font-bold text-primary transition-colors hover:bg-primary/25'
	>
		<ExternalLink size={16} />
		{label}
	</a>
);

// 每日開頭沿用 venue 舊版 hero：全寬背景圖 + 標題/徽章/副標 + highlight 卡（含詳細行程連結）
const VenueHero = ({ day }: { day: TransitDay }) => (
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
);

// Google Map 框（灰底）：有 embed → iframe；否則佔位框；有 mapLink → 開啟按鈕
const MapFrame = ({
	embedSrc,
	mapLink,
	title,
	openLabel,
	placeholder,
}: {
	embedSrc?: string | null;
	mapLink?: string | null;
	title: string;
	openLabel: string;
	placeholder: string;
}) => (
	<div className='flex flex-col gap-3'>
		<div className='relative aspect-[572/309] w-full overflow-hidden bg-[#27272a]'>
			{embedSrc ? (
				<iframe
					className='absolute inset-0 h-full w-full border-0'
					src={embedSrc}
					title={title}
					loading='lazy'
					referrerPolicy='no-referrer-when-downgrade'
				/>
			) : (
				<div className='flex h-full items-center justify-center px-6 text-center font-mono text-sm text-white/50'>
					{placeholder}
				</div>
			)}
		</div>
		{mapLink ? <LinkButton href={mapLink} label={openLabel} /> : null}
	</div>
);

// 手繪示意圖：直接放（無框，寬圖可橫向平移）
const IllustratedMap = ({ image, alt }: { image: string; alt: string }) => (
	<div className='w-full overflow-x-auto'>
		<img src={image} alt={alt} loading='lazy' className='mx-auto h-auto w-full min-w-[640px] max-w-[1120px]' />
	</div>
);

// 影片框：手機直式 9:16
const VideoFrame = ({ label, src, placeholder }: { label: string; src: string | null; placeholder: string }) => (
	<div className='flex w-[260px] max-w-full flex-col items-center gap-2'>
		<div className='relative aspect-[9/16] w-full overflow-hidden bg-black'>
			{src ? (
				<video src={src} controls playsInline preload='metadata' className='absolute inset-0 h-full w-full object-contain' />
			) : (
				<div className='flex h-full items-center justify-center px-6 text-center font-mono text-sm text-white/50'>{placeholder}</div>
			)}
		</div>
		<p className='font-mono text-sm text-white/60'>{label}</p>
	</div>
);

const TransitPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const section = content.transitSection as unknown as TransitSection;

	useSEO(language === 'zh' ? section.seoTitle : 'Transit', section.seoDescription);

	const location = useLocation();
	const navigate = useNavigate();
	const activeDay: 'day1' | 'day2' = location.hash === '#day2' ? 'day2' : 'day1';

	// 帶 hash 進場時捲回頂部（hash 只用來切分頁，不是錨點；仿 ProgramPage）
	useEffect(() => {
		if (window.location.hash) window.scrollTo(0, 0);
	}, []);

	// 資訊 ⇄ 地圖 兩欄（手機單欄）
	const infoMapGrid = 'grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,572px)] xl:items-start xl:gap-12';

	const renderDay = (day: TransitDay) => (
		<>
			<VenueHero day={day} />

			<div className='mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-16 pt-12 md:gap-16 md:px-8 md:pt-16'>
				{/* 交通方式標題 + 場地資訊（綠名 + 地址 + 樓層 + 地圖） */}
				<ScrollReveal>
					<div className='flex flex-col gap-6'>
						<SectionTitle>{day.sectionTitle}</SectionTitle>
						<div className={infoMapGrid}>
							<div className='flex flex-col gap-3'>
								<SubHeading>{day.venue.name}</SubHeading>
								<p className={`${typography.scale.body} leading-8 text-white/80`}>
									{day.venue.addressLabel}：{day.venue.address}
								</p>
								<Lines lines={day.venue.schedule} />
							</div>
							<MapFrame
								embedSrc={day.venue.mapEmbedSrc}
								mapLink={day.venue.mapLink}
								title={day.venue.name}
								openLabel={section.openMapLabel}
								placeholder={section.mapPlaceholder}
							/>
						</div>
					</div>
				</ScrollReveal>

				{/* 進場指引（南瓜門 / 場館）：橘標 + 白段落 + 地圖 */}
				<ScrollReveal delay={40}>
					<div className='flex flex-col gap-6'>
						<SectionTitle>{day.entryGuide.title}</SectionTitle>
						<div className={infoMapGrid}>
							<Lines lines={day.entryGuide.steps} />
							{day.entryGuide.mapEmbedSrc || day.entryGuide.mapLink ? (
								<MapFrame
									embedSrc={day.entryGuide.mapEmbedSrc}
									mapLink={day.entryGuide.mapLink}
									title={day.entryGuide.title}
									openLabel={section.openMapLabel}
									placeholder={section.mapPlaceholder}
								/>
							) : null}
						</div>
					</div>
				</ScrollReveal>

				{/* 南瓜門定位與三創外部地圖（無框） */}
				{day.areaMap ? (
					<ScrollReveal delay={70}>
						<div className='w-full overflow-x-auto'>
							<img src={day.areaMap.image} alt={day.areaMap.alt} loading='lazy' className='mx-auto h-auto w-full max-w-[1120px]' />
						</div>
					</ScrollReveal>
				) : null}

				{/* 手繪示意圖（無框）+ 從左/從右找南瓜 */}
				{day.routeMap.image ? (
					<ScrollReveal delay={80}>
						<div className='flex flex-col gap-4'>
							<IllustratedMap image={day.routeMap.image} alt={day.routeMap.alt} />
							{day.routeMap.subtitles.length ? (
								<div className='flex flex-wrap gap-x-10 gap-y-2'>
									{day.routeMap.subtitles.map((label) => (
										<p key={label} className='font-mono text-lg font-bold text-primary'>
											{label}
										</p>
									))}
								</div>
							) : null}
						</div>
					</ScrollReveal>
				) : null}

				{/* 影片 */}
				{day.videos.length ? (
					<ScrollReveal delay={120}>
						<div className='flex flex-wrap justify-center gap-8 sm:justify-start'>
							{day.videos.map((video) => (
								<VideoFrame key={video.label} label={video.label} src={video.src} placeholder={section.videoPlaceholder} />
							))}
						</div>
					</ScrollReveal>
				) : null}

				{/* 交通面板（大眾交通 / 自行開車 / 停車場）：橘標 + 綠子標 + 白段落 */}
				{day.travelPanels.map((panel, index) => (
					<ScrollReveal key={panel.title} delay={160 + index * 40}>
						<div className='flex flex-col gap-6'>
							<SectionTitle>{panel.title}</SectionTitle>
							{panel.map ? (
								<div className={infoMapGrid}>
									<div className='flex flex-col gap-6'>
										{panel.items.map((item) => (
											<div key={`${panel.title}-${item.title}`} className='flex flex-col gap-2'>
												<SubHeading>{item.title}</SubHeading>
												<Lines lines={item.lines} />
											</div>
										))}
										{panel.link ? <LinkButton href={panel.link.href} label={panel.link.label} /> : null}
									</div>
									<MapFrame
										embedSrc={panel.map.embedSrc}
										mapLink={panel.map.mapLink}
										title={panel.title}
										openLabel={section.openMapLabel}
										placeholder={section.mapPlaceholder}
									/>
								</div>
							) : (
								<div className='flex max-w-3xl flex-col gap-6'>
									{panel.items.map((item) => (
										<div key={`${panel.title}-${item.title}`} className='flex flex-col gap-2'>
											<SubHeading>{item.title}</SubHeading>
											<Lines lines={item.lines} />
										</div>
									))}
									{panel.link ? <LinkButton href={panel.link.href} label={panel.link.label} /> : null}
								</div>
							)}
						</div>
					</ScrollReveal>
				))}
			</div>
		</>
	);

	const activeDayData = section.days.find((day) => day.id === activeDay) ?? section.days[0];

	return (
		<div className='min-h-screen w-full bg-black text-white'>
			<div className='relative flex w-full flex-col items-center overflow-hidden bg-black px-6 pb-8 pt-40 md:px-20 md:pt-48'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 md:gap-[85px]'>
					<h1 className={`ds-page-title text-center ${typography.scale.pageTitle}`}>{section.title}</h1>
					<div className='flex w-full max-w-2xl'>
						{section.dateTabs.map((tab) => (
							<button
								key={tab.key}
								type='button'
								onClick={() => navigate(`#${tab.key}`)}
								className={`flex-1 border-2 py-3 font-mono text-xl font-bold transition-colors sm:text-2xl ${
									activeDay === tab.key ? 'border-primary bg-primary text-black' : 'border-primary/40 text-white/60 hover:text-white/80'
								}`}
							>
								{tab.date} {tab.day}
							</button>
						))}
					</div>
				</ScrollReveal>
			</div>

			{/* 預載兩天 hero 背景圖，切換零延遲 */}
			<div className='hidden' aria-hidden>
				{section.days.map((day) => (
					<img key={day.id} src={day.heroImage} alt='' />
				))}
			</div>

			{renderDay(activeDayData)}
		</div>
	);
};

export default TransitPage;
