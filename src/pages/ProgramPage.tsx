import { ExternalLink } from 'lucide-react';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { useContent, useLanguage } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';

type ProgramScheduleRow = {
	time: string;
	label: string;
	sublabel?: string;
	/** 'break' = 報到/休息/午餐等非議程時段，時間表上以灰色虛線框呈現 */
	kind?: 'break';
	featured?: boolean;
	fullBio?: string;
	workHeading?: string;
	workDescription?: string;
};
type TimetableEvent = { time: string; title: string; subtitle?: string; tags?: string[]; kind?: 'break' };
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
	websiteUrl: string;
	venueColumns: { time: string; f5: string; f12: string };
	venueBlocks: { f5: Day1VenueBlock; f12: Day1VenueBlock };
	sessions: { id: string; time: string; schedule: readonly ProgramScheduleRow[] }[];
};
type ProgramDay2Session = { id: string; title: string; time: string; location: string; schedule?: readonly ProgramScheduleRow[] };

const TimeLocationBlock = ({ label, time, location }: { label: string; time: string; location: string }) => (
	<div className='flex flex-col'>
		<span className='font-mono text-[16px] font-medium leading-6 text-white/60'>{label}</span>
		<span className='font-mono text-[20px] font-bold leading-8 text-white sm:text-[24px] sm:leading-[40px]'>{time}</span>
		<span className='font-mono text-[20px] font-bold leading-8 text-white sm:text-[24px] sm:leading-[40px]'>{location}</span>
	</div>
);

// 通用時間表：左欄為時間區間列（各場地細粒度時程的聯集），場地區塊跨其
// 涵蓋的列。Day1 每場地一個大區塊（節目細節在正式網站）、Day2 逐活動成塊。
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
		<section>
			{/* 標題拉到深色表格外、套頁面段落標題樣式，與表內的場地欄名（小字、場地色）拉開層級 */}
			<h2 className='mb-6 border-b-2 border-white/20 pb-4 font-mono text-[24px] font-bold leading-8 text-white'>{title}</h2>
			<div className='bg-zinc-950/80 px-4 py-6 sm:px-8'>
				<div className='grid grid-cols-[60px_1fr_1fr] gap-x-2 sm:grid-cols-[150px_1fr_1fr] sm:gap-x-4'>
					{/* 表頭列：底線用中性色，場地色只留給欄名文字與區塊 */}
					<p className='border-b-2 border-white/25 pb-2 font-mono text-[12px] font-bold leading-5 text-white/60 sm:text-[13px]' style={{ gridColumn: 1, gridRow: 1 }}>
						{timeHeader}
					</p>
					{cols.map((col, colIndex) => (
						<p
							key={col.header}
							className={`border-b-2 border-white/25 pb-2 text-center font-mono text-[12px] font-bold leading-5 sm:text-[14px] ${col.tone.text}`}
							style={{ gridColumn: colIndex + 2, gridRow: 1 }}
						>
							{col.header}
						</p>
					))}

					{/* 時間區間列：手機起訖時間上下排（欄寬讓給議程欄），sm+ 恢復單行 */}
					{rows.map((row, rowIndex) => {
						const [startText, endText] = row.time.split(/\s*-\s*/);
						return (
							<div
								key={`${row.start}-${row.end}`}
								className='flex min-h-[48px] items-center border-b border-white/10 py-2 font-mono text-[12px] font-bold text-white/90 sm:min-h-[52px] sm:text-[14px]'
								style={{ gridColumn: 1, gridRow: rowIndex + 2 }}
							>
								<span className='flex flex-col leading-tight sm:hidden'>
									<span>{startText}</span>
									{endText && <span className='text-white/55'>{endText}</span>}
								</span>
								<span className='hidden leading-5 sm:block'>{row.time}</span>
							</div>
						);
					})}

					{/* 場地區塊：跨其涵蓋的時間列 */}
					{cols.map((col, colIndex) =>
						col.events.map((event, eventIndex) => {
							const span = rowSpanFor(event.start, event.end);
							if (!span) return null;
							const hero = span.count >= 3;
							// break（報到/休息/午餐）退為灰色虛線框，正式議程保留場地色，掃讀時自然分段
							const isBreak = event.kind === 'break';
							return (
								<div
									key={`${col.header}-${event.time}-${eventIndex}`}
									className={`my-px overflow-hidden border ${isBreak ? 'border-dashed border-white/20 bg-white/[0.03]' : `${col.tone.border} ${col.tone.bg}`}`}
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
											<p className={`font-mono text-[12px] leading-tight sm:text-[14px] ${isBreak ? 'text-white/55' : `font-bold ${col.tone.text}`}`}>{event.title}</p>
											{event.subtitle && <p className='font-mono text-[10px] leading-tight text-white/60 sm:text-[11px]'>{event.subtitle}</p>}
										</div>
									)}
								</div>
							);
						}),
					)}
				</div>
			</div>
		</section>
	);
};

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
			events: (day2Info.sessions[0]?.schedule ?? []).map((row) => ({ time: row.time, title: row.label, subtitle: row.sublabel, kind: row.kind })),
		},
		{
			header: day2Info.venueHeaders.second,
			// 教室的活動是細粒度時段，直接貢獻時間區間列（例如主廳沒事的午餐時段）
			scheduleTimes: day2Info.secondVenue.events.map((event) => event.time),
			events: day2Info.secondVenue.events,
		},
	];
	// 分頁由網址 hash 驅動（#day1 / #day2）：navbar 子選單與 /venue 的「詳細行程」
	// 按鈕都能直接指定日期；沒有 hash 時預設 day1
	const location = useLocation();
	const navigate = useNavigate();
	const activeDay: 'day1' | 'day2' = location.hash === '#day2' ? 'day2' : 'day1';

	// 帶 hash 進場（如 venue 的詳細行程按鈕）：頁面上沒有對應 id 的元素，
	// Layout 的 hash 捲動找不到目標也不會歸零，這裡補捲回頁頂
	useEffect(() => {
		if (window.location.hash) window.scrollTo(0, 0);
	}, []);

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

			<section className='px-4 pb-8 md:px-8'>
				<div className='mx-auto max-w-[1280px]'>
					<ScrollReveal delay={40}>
						{/* 兩張 banner 都掛進 DOM（隱藏的照樣預先下載），切換日期時零延遲 */}
						<img
							src='/images/program_hero_bigbang.avif'
							alt='Big Bang! Futures!'
							className={activeDay === 'day1' ? 'w-full' : 'hidden'}
						/>
						<img
							src='/images/program_hero_bigbang2.avif'
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
								<a
									href={day1.websiteUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex w-fit items-center gap-2 border border-primary bg-primary/15 px-6 py-3 font-mono text-[16px] font-bold text-primary transition-colors hover:bg-primary/25 sm:text-[18px]'
								>
									{section.labels.websiteButtonLabel}
									<ExternalLink size={18} />
								</a>
								<DayTimetable venues={day1Venues} timeHeader={day1.venueColumns.time} title={section.labels.scheduleTitle} />
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
