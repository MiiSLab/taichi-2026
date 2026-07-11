import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { useContent, useLanguage } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';

type ProgramScheduleRow = {
	time: string;
	label: string;
	sublabel?: string;
	featured?: boolean;
	fullBio?: string;
	workHeading?: string;
	workDescription?: string;
};
type TimetableEvent = { time: string; title: string; subtitle?: string; tags?: string[] };
type TimetableVenue = {
	header: string;
	/** 左欄時間區間列的來源（細粒度時程）；議程未定的場地可省略，其區塊跨既有列 */
	scheduleTimes?: string[];
	events: TimetableEvent[];
};
type Day1VenueBlock = { title: string; tags: string[] };
type Day1Joint = {
	title: string;
	description: string;
	time: string;
	location: string;
	venueColumns: { time: string; f5: string; f12: string };
	venueBlocks: { f5: Day1VenueBlock; f12: Day1VenueBlock };
	sessions: { id: string; time: string; schedule: readonly ProgramScheduleRow[] }[];
};
type ProgramIntroCard = { name: string; description: string; toggleLabel?: string; toggleContent?: string; longform?: boolean };
type ProgramDay2Session = { id: string; title: string; time: string; location: string; schedule?: readonly ProgramScheduleRow[] };

const TimeLocationBlock = ({ label, time, location }: { label: string; time: string; location: string }) => (
	<div className='flex flex-col'>
		<span className='font-mono text-[16px] font-medium leading-6 text-white/60'>{label}</span>
		<span className='font-mono text-[20px] font-bold leading-8 text-white sm:text-[24px] sm:leading-[40px]'>{time}</span>
		<span className='font-mono text-[20px] font-bold leading-8 text-white sm:text-[24px] sm:leading-[40px]'>{location}</span>
	</div>
);

// 通用時間表：日曆式比例時間軸（calendar day view）。左側整點刻度，
// 兩場地各是一個依實際時長等比例佔位的區塊——一眼看出 5F 白天場、
// 12F 傍晚場與 15:30–16:40 的交疊。個別節目細節不上站（正式網站才有）。
const parseTimeRange = (time: string): [number, number] => {
	const range = time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
	if (range) return [Number(range[1]) * 60 + Number(range[2]), Number(range[3]) * 60 + Number(range[4])];
	// 單點時間（如 Day1 12F 的「15:30」）視為零長度區間
	const point = time.match(/(\d{1,2}):(\d{2})/);
	if (point) {
		const minutes = Number(point[1]) * 60 + Number(point[2]);
		return [minutes, minutes];
	}
	return [0, 0];
};

// 場地色彩編碼：第 1 場地品牌主色（橘紅）、第 2 場地副色（綠），平行掃讀更快
const VENUE_TONES = [
	{ border: 'border-primary/45', bg: 'bg-primary/10', text: 'text-primary', line: 'border-primary/35' },
	{ border: 'border-secondary/45', bg: 'bg-secondary/10', text: 'text-secondary', line: 'border-secondary/35' },
] as const;

const DayTimetable = ({ venues, timeHeader, title }: { venues: TimetableVenue[]; timeHeader: string; title: string }) => {
	const cols = venues.map((venue, index) => ({
		header: venue.header,
		tone: VENUE_TONES[index % VENUE_TONES.length],
		scheduleTimes: venue.scheduleTimes,
		events: venue.events.map((event) => {
			const [start, end] = parseTimeRange(event.time);
			return { ...event, start, end };
		}),
	}));

	// 左欄「時間區間」列：所有場地細粒度時程的聯集，依開始時間排序。
	// 沒提供細粒度時程的場地（如議程未定的教室）不貢獻列，其區塊跨既有列。
	const rowTimes = cols.flatMap((col) => col.scheduleTimes ?? []);
	const fallbackTimes = rowTimes.length ? rowTimes : cols.flatMap((col) => col.events.map((event) => event.time));
	const seenRows = new Set<string>();
	const rows = fallbackTimes
		.map((time) => {
			const [start, end] = parseTimeRange(time);
			return { time, start, end };
		})
		.filter((row) => {
			const key = `${row.start}-${row.end}`;
			if (seenRows.has(key)) return false;
			seenRows.add(key);
			return true;
		})
		.sort((a, b) => a.start - b.start || a.end - b.end);

	// 區塊跨列：涵蓋所有與其時間範圍重疊的列（單點列落在範圍內也算）
	const rowSpanFor = (start: number, end: number) => {
		const hit = rows
			.map((row, index) => ({ row, index }))
			.filter(({ row }) =>
				row.start === row.end ? row.start >= start && row.start <= end : row.start < end && row.end > start,
			);
		if (!hit.length) return null;
		return { first: hit[0].index, last: hit[hit.length - 1].index, count: hit.length };
	};

	return (
		<div className='bg-zinc-950/80 px-4 py-6 sm:px-8'>
			<p className='mb-4 font-mono text-[14px] font-bold leading-5 text-primary'>{title}</p>

			<div className='grid grid-cols-[92px_1fr_1fr] gap-x-2 sm:grid-cols-[150px_1fr_1fr] sm:gap-x-4'>
				{/* 表頭列 */}
				<p className='border-b-2 border-primary/40 pb-2 font-mono text-[12px] font-bold leading-5 text-white/60 sm:text-[13px]' style={{ gridColumn: 1, gridRow: 1 }}>
					{timeHeader}
				</p>
				{cols.map((col, colIndex) => (
					<p
						key={col.header}
						className={`border-b-2 border-primary/40 pb-2 text-center font-mono text-[12px] font-bold leading-5 sm:text-[14px] ${col.tone.text}`}
						style={{ gridColumn: colIndex + 2, gridRow: 1 }}
					>
						{col.header}
					</p>
				))}

				{/* 時間區間列 */}
				{rows.map((row, rowIndex) => (
					<div
						key={`${row.start}-${row.end}`}
						className='flex min-h-[48px] items-center border-b border-white/10 py-2 font-mono text-[12px] font-bold leading-5 text-white/90 sm:min-h-[52px] sm:text-[14px]'
						style={{ gridColumn: 1, gridRow: rowIndex + 2 }}
					>
						{row.time}
					</div>
				))}

				{/* 場地區塊：跨其涵蓋的時間列 */}
				{cols.map((col, colIndex) =>
					col.events.map((event, eventIndex) => {
						const span = rowSpanFor(event.start, event.end);
						if (!span) return null;
						const hero = span.count >= 3;
						return (
							<div
								key={`${col.header}-${event.time}-${eventIndex}`}
								className={`my-px overflow-hidden border ${col.tone.border} ${col.tone.bg}`}
								style={{ gridColumn: colIndex + 2, gridRow: `${span.first + 2} / ${span.last + 3}` }}
							>
								{hero ? (
									<div className='flex h-full flex-col items-center justify-center gap-3 px-2 py-4 text-center sm:gap-4 sm:px-4'>
										<p className={`whitespace-pre-line font-mono text-[14px] font-bold leading-snug sm:text-[19px] ${col.tone.text}`}>{event.title}</p>
										<p className='font-mono text-[11px] font-bold text-white/70 sm:text-[12px]'>{event.time}</p>
										{event.tags && (
											<div className='flex flex-wrap items-center justify-center gap-1.5 sm:gap-2'>
												{event.tags.map((tag) => (
													<span
														key={tag}
														className='border border-white/15 bg-black/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/70 sm:text-[10px]'
													>
														{tag}
													</span>
												))}
											</div>
										)}
									</div>
								) : (
									<div className='flex h-full flex-col items-center justify-center gap-0.5 px-2 py-1 text-center sm:px-3'>
										<p className={`font-mono text-[12px] font-bold leading-tight sm:text-[14px] ${col.tone.text}`}>{event.title}</p>
										{event.subtitle && <p className='font-mono text-[10px] leading-tight text-white/60 sm:text-[11px]'>{event.subtitle}</p>}
									</div>
								)}
							</div>
						);
					}),
				)}
			</div>
		</div>
	);
};

const ToggleReveal = ({ label, content, full }: { label: string; content?: string; full?: boolean }) => (
	<details className='group/toggle'>
		<summary
			className={`flex h-6 cursor-pointer list-none items-center gap-2 border-l border-solid border-primary pl-[15px] font-mono text-[14px] font-bold leading-[22.75px] text-white/80 ${
				full ? 'w-full bg-zinc-950/80' : 'w-fit'
			}`}
		>
			{label}
			<span className='h-0 w-0 shrink-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-white/80 transition-transform group-open/toggle:rotate-180' />
		</summary>
		{content && <p className='mt-3 whitespace-pre-line pl-[15px] font-sans text-[14px] leading-relaxed text-white/80'>{content}</p>}
	</details>
);

const SideBySideIntro = ({ title, cards, photoLabel }: { title: string; cards: ProgramIntroCard[]; photoLabel: string }) => (
	<ScrollReveal>
		<section className='py-12 md:py-20'>
			<h2 className='mb-6 border-b-2 border-primary/30 pb-4 font-mono text-[24px] font-bold leading-8 text-white'>{title}</h2>
			<div className='flex flex-col gap-6'>
				{cards.map((card) => (
					<div key={card.name} className='flex flex-col gap-6 sm:flex-row sm:items-center'>
						<div className='flex h-[200px] w-full items-center justify-center bg-zinc-800 sm:h-[256px] sm:w-[320px] sm:shrink-0 md:w-[400px]'>
							<span className='font-mono text-[16px] leading-6 text-white/50'>{photoLabel}</span>
						</div>
						<div className='flex flex-col gap-3.5'>
							<p className='font-mono text-[24px] font-bold leading-none text-primary'>{card.name}</p>
							<p className={`text-[14px] leading-normal text-white/80 ${card.longform ? 'font-sans' : 'font-mono'}`}>{card.description}</p>
							{card.toggleLabel && <ToggleReveal label={card.toggleLabel} content={card.toggleContent} />}
						</div>
					</div>
				))}
			</div>
		</section>
	</ScrollReveal>
);

const PerformanceSection = ({
	title,
	cards,
	photoLabel,
	closingLine1,
	closingLine2,
}: {
	title: string;
	cards: ProgramIntroCard[];
	photoLabel: string;
	closingLine1: string;
	closingLine2: string;
}) => (
	<>
		<SideBySideIntro title={title} cards={cards} photoLabel={photoLabel} />
		<ScrollReveal>
			<p className='pb-8 text-center font-mono text-[20px] font-bold leading-normal text-primary sm:text-[24px]'>
				{closingLine1}
				<br />
				{closingLine2}
			</p>
		</ScrollReveal>
	</>
);

const ResidencySection = ({
	title,
	introTitle,
	introInstructor,
	introDescription,
	cards,
	photoLabel,
}: {
	title: string;
	introTitle: string;
	introInstructor: string;
	introDescription: string;
	cards: ProgramIntroCard[];
	photoLabel: string;
}) => (
	<ScrollReveal>
		<section className='py-12 md:py-20'>
			<h2 className='mb-6 border-b-2 border-primary/30 pb-4 font-mono text-[24px] font-bold leading-8 text-white'>{title}</h2>
			<div className='mb-8 rounded-[10px] border border-white/40 p-6 sm:p-10'>
				<p className='mb-2 font-mono text-[24px] font-bold leading-normal text-primary'>{introTitle}</p>
				<p className='mb-4 font-mono text-[16px] font-bold leading-normal text-white/80'>{introInstructor}</p>
				<p className='font-mono text-[14px] leading-[22px] text-white/80'>{introDescription}</p>
			</div>
			<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
				{cards.map((card) => (
					<div key={card.name} className='flex flex-col gap-[36px]'>
						<div className='flex h-[256px] w-full items-center justify-center bg-zinc-800'>
							<span className='font-mono text-[16px] leading-6 text-white/50'>{photoLabel}</span>
						</div>
						<div className='flex flex-col gap-3.5'>
							<p className='font-mono text-[18px] font-bold leading-normal text-white/80'>{card.name}</p>
							<p className='font-mono text-[14px] leading-normal text-white/80'>{card.description}</p>
							{card.toggleLabel && <ToggleReveal label={card.toggleLabel} content={card.toggleContent} full />}
						</div>
					</div>
				))}
			</div>
		</section>
	</ScrollReveal>
);

const FoodSection = ({
	title,
	cards,
	photoLabel,
	promoHeading,
	promoItems,
}: {
	title: string;
	cards: ProgramIntroCard[];
	photoLabel: string;
	promoHeading: string;
	promoItems: string[];
}) => (
	<ScrollReveal>
		<section className='px-4 py-10 bg-gradient-to-b from-black to-zinc-950 sm:px-8'>
			<h2 className='mb-6 border-b-2 border-primary/30 pb-4 font-mono text-[24px] font-bold leading-8 text-white'>{title}</h2>
			<div className='flex flex-col gap-8'>
				{cards.map((card, index) => (
					<div key={card.name} className='flex flex-col gap-6 sm:flex-row sm:items-start'>
						<div className='flex h-[200px] w-full items-center justify-center bg-zinc-800 sm:h-[256px] sm:w-[320px] sm:shrink-0 md:w-[400px]'>
							<span className='font-mono text-[16px] leading-6 text-white/50'>{photoLabel}</span>
						</div>
						<div className='flex flex-col gap-3.5'>
							<p className='font-mono text-[24px] font-bold leading-none text-primary'>{card.name}</p>
							<p className={`text-[14px] leading-normal text-white ${card.longform ? 'font-sans' : 'font-mono text-white/80'}`}>{card.description}</p>
							{index === cards.length - 1 && (
								<div className='inline-flex w-fit flex-col gap-3.5 border-l border-solid border-primary bg-zinc-950/80 px-6 py-3'>
									<p className='font-mono text-[14px] font-bold leading-normal text-program-green'>{promoHeading}</p>
									<div className='flex flex-col gap-1'>
										{promoItems.map((item) => (
											<p key={item} className='font-mono text-[14px] leading-normal text-program-green'>
												{item}
											</p>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	</ScrollReveal>
);

const Day2StaticSession = ({
	session,
	labels,
}: {
	session: ProgramDay2Session;
	labels: { timeLocationLabel: string };
}) => (
	<ScrollReveal>
		<div className='flex flex-col gap-6 px-4 py-12 sm:px-8 md:px-16 md:py-20'>
			<h3 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{session.title}</h3>
			<TimeLocationBlock label={labels.timeLocationLabel} time={session.time} location={session.location} />
		</div>
	</ScrollReveal>
);

const ProgramPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const section = content.programPageSection;
	const day1 = section.day1 as unknown as Day1Joint;
	// Day1 = 每場地一個大區塊的簡化版；Day2 = 每個活動各自成塊（同一套時間表格式）
	const day1Venues: TimetableVenue[] = (['f5', 'f12'] as const).map((venue) => {
		const session = day1.sessions.find((s) => s.id === (venue === 'f5' ? 'day1-5f' : 'day1-12f'));
		return {
			header: day1.venueColumns[venue],
			// 細部節目只貢獻時間區間列，內容以場地大區塊呈現（細節在正式網站）
			scheduleTimes: (session?.schedule ?? []).map((row) => row.time),
			events: [{ time: session?.time ?? '', title: day1.venueBlocks[venue].title, tags: day1.venueBlocks[venue].tags }],
		};
	});

	const day2Info = section.day2 as unknown as {
		venueHeaders: { main: string; second: string };
		secondVenue: { events: TimetableEvent[] };
		sessions: ProgramDay2Session[];
	};
	const day2Venues: TimetableVenue[] = [
		{
			header: day2Info.venueHeaders.main,
			scheduleTimes: (day2Info.sessions[0]?.schedule ?? []).map((row) => row.time),
			events: (day2Info.sessions[0]?.schedule ?? []).map((row) => ({ time: row.time, title: row.label, subtitle: row.sublabel })),
		},
		{
			header: day2Info.venueHeaders.second,
			// 教室的活動是細粒度時段，直接貢獻時間區間列（例如主廳沒事的午餐時段）
			scheduleTimes: day2Info.secondVenue.events.map((event) => event.time),
			events: day2Info.secondVenue.events,
		},
	];
	const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

	useSEO(
		language === 'zh' ? 'Program 議程' : 'Program',
		language === 'zh' ? 'TAICHI 2026 完整議程與活動安排。' : 'TAICHI 2026 full program and event schedule.',
	);

	return (
		<div className='w-full min-h-screen text-white bg-black'>
			<div className='relative w-full px-6 pt-40 pb-8 overflow-hidden md:px-20 md:pt-48'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 md:gap-[85px]'>
					<h1 className={`ds-page-title text-center ${typography.scale.pageTitle}`}>{section.title}</h1>
					<div className='flex w-full max-w-2xl'>
						{section.dateTabs.map((tab) => (
							<button
								key={tab.key}
								type='button'
								onClick={() => setActiveDay(tab.key as 'day1' | 'day2')}
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

			<section className='px-4 pb-8 md:px-8'>
				<div className='mx-auto max-w-[1280px]'>
					<ScrollReveal delay={40}>
						{/* 兩張 banner 都掛進 DOM（隱藏的照樣預先下載），切換日期時零延遲 */}
						<img
							src='/images/program_hero_bigbang.png'
							alt='Big Bang! Futures!'
							className={activeDay === 'day1' ? 'w-full' : 'hidden'}
						/>
						<img
							src='/images/program_hero_bigbang2.png'
							alt='Big Bang! Futures!'
							className={activeDay === 'day2' ? 'w-full' : 'hidden'}
						/>
					</ScrollReveal>
				</div>
			</section>

			<div className='mx-auto max-w-[1280px]'>
				{activeDay === 'day1' ? (
					<div className='pb-16'>
						<ScrollReveal>
							<div className='flex flex-col gap-6 px-4 py-12 sm:px-8 md:gap-[45px] md:px-16 md:py-20'>
								<div className='flex flex-col gap-3'>
									<h3 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{day1.title}</h3>
									<p className='max-w-4xl font-sans text-[14px] leading-relaxed text-white/80 sm:text-[15px]'>{day1.description}</p>
								</div>
								<TimeLocationBlock label={section.labels.timeLocationLabel} time={day1.time} location={day1.location} />
								{/* 類型 tags 依場地拆開，顏色對應時間表的場地色（5F 主色 / 12F 副色） */}
								<div className='flex flex-col gap-2'>
									{(['f5', 'f12'] as const).map((venue) => (
										<p key={venue} className='font-mono text-[14px] font-bold leading-normal sm:text-[16px]'>
											<span className={venue === 'f5' ? 'text-primary' : 'text-secondary'}>{day1.venueColumns[venue]}</span>
											<span className='ms-3 text-white'>[ {day1.venueBlocks[venue].tags.join(' • ')} ]</span>
										</p>
									))}
								</div>
								{/* Big Bang! Futures 官網還在 prototype — 先 disable，正式部署後換回 <a href> */}
								<div className='flex flex-col gap-2'>
									<button
										type='button'
										disabled
										className='inline-flex w-fit cursor-not-allowed items-center gap-2 border border-white/20 bg-white/5 px-6 py-3 font-mono text-[16px] font-bold text-white/35 sm:text-[18px]'
									>
										{section.labels.websiteButtonLabel}
									</button>
									<p className='font-mono text-[12px] text-white/45'>{section.labels.websitePendingLabel}</p>
								</div>
								<DayTimetable venues={day1Venues} timeHeader={day1.venueColumns.time} title={section.labels.scheduleTitle} />
								<PerformanceSection
									title={section.day1.performance.title}
									cards={section.day1.performance.cards as unknown as ProgramIntroCard[]}
									photoLabel={section.labels.photoPlaceholder}
									closingLine1={section.day1.performance.closingLine1}
									closingLine2={section.day1.performance.closingLine2}
								/>
								<ResidencySection
									title={section.day1.residency.title}
									introTitle={section.day1.residency.introTitle}
									introInstructor={section.day1.residency.introInstructor}
									introDescription={section.day1.residency.introDescription}
									cards={section.day1.residency.cards as unknown as ProgramIntroCard[]}
									photoLabel={section.labels.photoPlaceholder}
								/>
								<FoodSection
									title={section.day1.food.title}
									cards={section.day1.food.cards as unknown as ProgramIntroCard[]}
									photoLabel={section.labels.photoPlaceholder}
									promoHeading={section.day1.food.promo.heading}
									promoItems={section.day1.food.promo.items as unknown as string[]}
								/>
							</div>
						</ScrollReveal>
					</div>
				) : (
					<div className='pb-16'>
						{section.day2.sessions.map((sessionData) => (
							<Day2StaticSession key={sessionData.id} session={sessionData} labels={section.labels} />
						))}
						<div className='px-4 sm:px-8 md:px-16'>
							<ScrollReveal>
								<DayTimetable venues={day2Venues} timeHeader={day1.venueColumns.time} title={section.labels.scheduleTitle} />
							</ScrollReveal>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProgramPage;
