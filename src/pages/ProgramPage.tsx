import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useContent, useLanguage } from '../context/LanguageContext';
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
type ProgramSession = {
	id: string;
	title: string;
	tagline: string;
	time: string;
	location: string;
	tags: string[];
	description: string;
	gradient: boolean;
	schedule: ProgramScheduleRow[];
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

const ScheduleRowHeader = ({ row }: { row: ProgramScheduleRow }) => (
	<div className='grid min-h-[57px] grid-cols-[72px_1fr] items-center gap-3 py-3 sm:grid-cols-[202px_1fr]'>
		<span className={`font-mono text-[14px] font-bold leading-5 ${row.featured ? 'text-primary' : 'text-white/90'}`}>{row.time}</span>
		<div className='flex items-center justify-between min-w-0 gap-3'>
			<div className='min-w-0'>
				<p className={`font-mono text-[14px] font-bold leading-5 ${row.featured ? 'text-primary' : 'text-white/90'}`}>{row.label}</p>
				{row.sublabel && <p className='mt-0.5 font-mono text-[14px] font-bold leading-5 text-white/90'>{row.sublabel}</p>}
			</div>
			{row.fullBio && <ChevronDown className='transition-transform shrink-0 text-program-green group-open/row:rotate-180' size={20} strokeWidth={3} />}
		</div>
	</div>
);

const ScheduleRow = ({ row, photoLabel }: { row: ProgramScheduleRow; photoLabel: string }) => {
	if (!row.fullBio) {
		return (
			<div className='border-b border-zinc-800'>
				<ScheduleRowHeader row={row} />
			</div>
		);
	}

	return (
		<details className='border-b group/row border-zinc-800'>
			<summary className='list-none cursor-pointer'>
				<ScheduleRowHeader row={row} />
			</summary>
			<div className='flex flex-col gap-4 pb-6 sm:flex-row sm:gap-6 sm:pl-[214px]'>
				<div className='flex h-[194px] w-full items-center justify-center rounded-[14px] bg-zinc-950/80 p-[24px] sm:w-[289px] sm:shrink-0'>
					<div className='flex items-center justify-center w-full h-full bg-zinc-800'>
						<span className='font-mono text-[16px] leading-6 text-white/50'>{photoLabel}</span>
					</div>
				</div>
				<div className='flex flex-col flex-1 gap-3'>
					<p className='whitespace-pre-line font-sans text-[14px] leading-relaxed text-white'>{row.fullBio}</p>
					{row.workHeading && <p className='font-mono text-[14px] font-bold leading-5 text-primary'>{row.workHeading}</p>}
					{row.workDescription && <p className='whitespace-pre-line font-sans text-[14px] leading-relaxed text-white'>{row.workDescription}</p>}
				</div>
			</div>
		</details>
	);
};

const ScheduleTable = ({ rows, title, photoLabel }: { rows: readonly ProgramScheduleRow[]; title: string; photoLabel: string }) => (
	<div className='px-4 py-6 bg-zinc-950/80 sm:px-8'>
		<p className='mb-4 font-mono text-[14px] font-bold leading-5 text-primary'>{title}</p>
		<div className='flex flex-col'>
			{rows.map((row, index) => (
				<ScheduleRow key={`${row.time}-${index}`} row={row} photoLabel={photoLabel} />
			))}
		</div>
	</div>
);

const SessionAccordion = ({
	session,
	labels,
	children,
}: {
	session: ProgramSession;
	labels: { scheduleTitle: string; photoPlaceholder: string; timeLocationLabel: string };
	children?: React.ReactNode;
}) => (
	<ScrollReveal>
		<details className='border-b group border-primary'>
			<summary className='flex cursor-pointer list-none flex-col gap-6 px-4 pb-8 pt-12 sm:px-8 md:gap-[45px] md:px-16 md:pt-20'>
				<div className='flex flex-col gap-2 md:gap-[7px]'>
					<h3 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{session.title}</h3>
					<p className='font-mono text-[18px] leading-normal text-program-green sm:text-[24px]'>{session.tagline}</p>
				</div>
				<TimeLocationBlock label={labels.timeLocationLabel} time={session.time} location={session.location} />
				<div className='flex items-start justify-between gap-4'>
					<div className='flex flex-col gap-3'>
						<p className='font-mono text-[16px] font-bold leading-normal text-white sm:text-[18px]'>[ {session.tags.join(' • ')} ]</p>
						<p className='font-mono text-[14px] font-bold leading-normal text-white/90'>{session.description}</p>
					</div>
					<ChevronDown className='mt-1 transition-transform shrink-0 text-primary group-open:rotate-180' size={24} strokeWidth={3} />
				</div>
			</summary>
			<div className={`flex flex-col gap-8 px-4 pb-16 pt-6 sm:px-8 md:px-16 ${session.gradient ? 'bg-gradient-to-b from-black to-zinc-950' : ''}`}>
				<ScheduleTable rows={session.schedule} title={labels.scheduleTitle} photoLabel={labels.photoPlaceholder} />
				{children}
			</div>
		</details>
	</ScrollReveal>
);

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
	labels: { scheduleTitle: string; photoPlaceholder: string; timeLocationLabel: string };
}) => (
	<ScrollReveal>
		<details className='border-b group border-primary'>
			<summary className='flex cursor-pointer list-none flex-col gap-6 px-4 pb-8 pt-12 sm:px-8 md:gap-[45px] md:px-16 md:pt-20'>
				<div className='flex items-start justify-between gap-4'>
					<h3 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{session.title}</h3>
					<ChevronDown className='mt-1 transition-transform shrink-0 text-primary group-open:rotate-180' size={24} strokeWidth={3} />
				</div>
				<TimeLocationBlock label={labels.timeLocationLabel} time={session.time} location={session.location} />
			</summary>
			{session.schedule && (
				<div className='flex flex-col gap-8 px-4 pb-16 pt-6 sm:px-8 md:px-16'>
					<ScheduleTable rows={session.schedule} title={labels.scheduleTitle} photoLabel={labels.photoPlaceholder} />
				</div>
			)}
		</details>
	</ScrollReveal>
);

const ProgramPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const section = content.programPageSection;
	const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

	useSEO(
		language === 'zh' ? 'Program 議程' : 'Program',
		language === 'zh' ? 'TAICHI 2026 完整議程與活動安排。' : 'TAICHI 2026 full program and event schedule.',
	);

	return (
		<div className='w-full min-h-screen text-white bg-black'>
			<div className='relative w-full px-6 pt-40 pb-8 overflow-hidden md:px-20 md:pt-48'>
				<ScrollReveal className='mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 md:gap-[85px]'>
					<h1 className='text-5xl font-pixel text-primary sm:text-6xl md:text-7xl'>{section.title}</h1>
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
						<img
							src={activeDay === 'day1' ? '/images/program_hero_bigbang.png' : '/images/program_hero_bigbang2.png'}
							alt='Big Bang! Futures!'
							className='w-full'
						/>
						<div className='flex flex-col gap-3 mt-6'>
							<h2 className='font-mono text-[16px] font-bold leading-normal text-white sm:text-[18px]'>{section.heroCaption}</h2>
							<p className='font-sans text-[13px] leading-relaxed text-white/70 sm:text-[14px]'>{section.heroDescription}</p>
						</div>
					</ScrollReveal>
				</div>
			</section>

			<div className='mx-auto max-w-[1280px]'>
				{activeDay === 'day1' ? (
					<div className='pb-16'>
						{section.day1.sessions.map((sessionData) => {
							const session = sessionData as unknown as ProgramSession;
							return (
								<SessionAccordion key={session.id} session={session} labels={section.labels}>
									{session.id === 'day1-12f' && (
										<>
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
										</>
									)}
								</SessionAccordion>
							);
						})}
					</div>
				) : (
					<div className='pb-16'>
						{section.day2.sessions.map((sessionData) => (
							<Day2StaticSession key={sessionData.id} session={sessionData} labels={section.labels} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProgramPage;
