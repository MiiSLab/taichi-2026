import { ChevronDown, ExternalLink } from 'lucide-react';
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
type Day1Session = {
	id: string;
	title: string;
	tagline: string;
	time: string;
	location: string;
	tags: string[];
	description: string;
	websiteUrl: string;
};
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

const Day1PartnerCard = ({
	session,
	labels,
}: {
	session: Day1Session;
	labels: { timeLocationLabel: string; websiteButtonLabel: string };
}) => (
	<ScrollReveal>
		<div className='flex flex-col gap-6 border-b border-primary px-4 pb-12 pt-12 sm:px-8 md:gap-[45px] md:px-16 md:pt-20'>
			<div className='flex flex-col gap-2 md:gap-[7px]'>
				<h3 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{session.title}</h3>
				<p className='font-mono text-[18px] leading-normal text-program-green sm:text-[24px]'>{session.tagline}</p>
			</div>
			<TimeLocationBlock label={labels.timeLocationLabel} time={session.time} location={session.location} />
			<div className='flex flex-col gap-3'>
				<p className='font-mono text-[16px] font-bold leading-normal text-white sm:text-[18px]'>[ {session.tags.join(' • ')} ]</p>
				<p className='font-mono text-[14px] font-bold leading-normal text-white/90'>{session.description}</p>
			</div>
			<a
				href={session.websiteUrl}
				target='_blank'
				rel='noreferrer'
				className='inline-flex w-fit items-center gap-2 border border-primary px-6 py-3 font-mono text-[16px] font-bold text-primary transition-colors hover:bg-primary hover:text-black sm:text-[18px]'
			>
				{labels.websiteButtonLabel}
				<ExternalLink size={18} strokeWidth={2.5} />
			</a>
		</div>
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
		<div className='flex flex-col gap-6 px-4 py-12 sm:px-8 md:px-16 md:py-20'>
			<h3 className='font-mono text-[28px] font-bold leading-tight text-primary sm:text-[40px]'>{session.title}</h3>
			<TimeLocationBlock label={labels.timeLocationLabel} time={session.time} location={session.location} />
			{session.schedule && <ScheduleTable rows={session.schedule} title={labels.scheduleTitle} photoLabel={labels.photoPlaceholder} />}
		</div>
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
							const session = sessionData as unknown as Day1Session;
							return <Day1PartnerCard key={session.id} session={session} labels={section.labels} />;
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
