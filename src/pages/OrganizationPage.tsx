import { Copy, RotateCcw, Settings } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import FramePanel from '../components/FramePanel';
import ScrollReveal from '../components/ScrollReveal';
import Skeleton from '../components/Skeleton';
import Sponsors from '../components/Sponsors';
import { CONFIG } from '../content';
import { panelFrame } from '../design-system/panel';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';

interface OrganizationPageProps {
	hidePeople?: boolean;
}

type GroupedMembers = Record<string, PersonItem[]>;

const getNormalizedChairType = (chairType: string) => {
	let normalizedType = chairType.toLowerCase().trim();
	if (normalizedType.endsWith('chair')) {
		normalizedType += 's';
	}
	return normalizedType;
};

const getDisplayName = (member: PersonItem, language: 'zh' | 'en') => {
	if (language === 'en' && member.nameEn) {
		return { primary: member.nameEn, secondary: member.name };
	}
	// Try splitting "Chinese / English" format
	const segments = member.name
		.split('/')
		.map((segment) => segment.trim())
		.filter(Boolean);

	if (segments.length >= 2) {
		const [first, second] = segments;
		const firstHasChinese = /[\u3400-\u9fff]/.test(first);
		const secondHasChinese = /[\u3400-\u9fff]/.test(second);

		if (language === 'en') {
			if (firstHasChinese && !secondHasChinese) return { primary: second, secondary: first };
			if (!firstHasChinese && secondHasChinese) return { primary: first, secondary: second };
		} else {
			if (firstHasChinese && !secondHasChinese) return { primary: first, secondary: second };
			if (!firstHasChinese && secondHasChinese) return { primary: second, secondary: first };
		}
		return { primary: first, secondary: second };
	}

	if (language === 'en' && member.nameEn) {
		return { primary: member.nameEn, secondary: member.name };
	}
	return { primary: member.name, secondary: member.nameEn || '' };
};

const buildMetaLines = (member: PersonItem, language: 'zh' | 'en') => {
	const institution = (language === 'en' && member.institutionEn) ? member.institutionEn : member.institution;
	const department = (language === 'en' && member.departmentEn) ? member.departmentEn : member.department;
	return [institution, department].filter(Boolean);
};

const toTitleCase = (value: string) =>
	value
		.toLowerCase()
		.split(' ')
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

const MemberCard = ({
	member,
	localAdjustments,
	updateAdjustment,
	resetAdjustment,
	isEditMode,
	variant,
}: {
	member: PersonItem;
	localAdjustments: Record<string, ImageAdjustment>;
	updateAdjustment: (id: string, field: keyof ImageAdjustment, value: string | number) => void;
	resetAdjustment: (id: string) => void;
	isEditMode: boolean;
	variant: 'hero' | 'feature' | 'row';
}) => {
	const { language } = useLanguage();
	const adjustment = localAdjustments[member.id];
	const name = getDisplayName(member, language);
	const metaLines = buildMetaLines(member, language);
	const isHero = variant === 'hero';
	const isFeature = variant === 'feature';
	const isRow = variant === 'row';
	const frameClasses = isHero
		? 'group flex min-h-[214px] flex-col gap-4 bg-[rgba(24,24,27,0.5)] px-[41px] py-[41px] transition-all duration-300 hover:bg-[rgba(32,32,36,0.72)] hover:shadow-[0_0_0_1px_rgba(168,240,32,0.28)] md:flex-row md:items-start md:gap-4'
		: isFeature
			? 'group flex min-h-[290px] flex-col items-center bg-[rgba(24,24,27,0.5)] px-[33px] py-[33px] text-center transition-all duration-300 hover:bg-[rgba(32,32,36,0.72)] hover:shadow-[0_0_0_1px_rgba(168,240,32,0.28)]'
			: 'group flex min-h-[80px] flex-row items-center gap-4 rounded-[10px] bg-[rgba(0,0,0,0.4)] pl-4 pr-4 transition-colors duration-200 hover:bg-[rgba(168,240,32,0.08)]';
	const avatarClasses = isHero
		? 'size-[80px] border-2 border-[rgba(168,240,32,0.3)]'
		: isFeature
			? 'size-[96px] border-2 border-[rgba(168,240,32,0.3)]'
			: 'size-[48px] border border-[rgba(168,240,32,0.3)]';
	const primaryNameClasses = isHero
		? 'text-[24px] leading-[32px]'
		: isFeature
			? 'text-[20px] leading-[28px]'
			: 'text-[16px] leading-[24px]';
	const secondaryNameClasses = isHero
		? 'text-[18px] leading-[28px]'
		: isFeature
			? 'text-[14px] leading-[20px]'
			: 'text-[13px] leading-[18px]';
	const metaClasses = isHero
		? 'text-[14px] leading-[20px] text-[rgba(255,255,255,0.7)]'
		: isFeature
			? 'text-[12px] leading-[16px] text-[rgba(255,255,255,0.6)]'
			: 'text-[11px] leading-[14px] text-[rgba(255,255,255,0.6)]';

	return (
		<div className={`relative overflow-visible ${frameClasses}`}>
			<div
				className={`relative shrink-0 overflow-hidden rounded-full bg-zinc-900 ${avatarClasses} ${isHero ? 'mx-auto md:mx-0' : isFeature ? 'mx-auto' : ''}`}
			>
				{member.image ? (
					<div
						className='h-full w-full transition-transform duration-300'
						style={{
							transform: `scale(${adjustment?.scale || 1})`,
						}}
					>
						<img
							src={member.image}
							alt={member.name}
							className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]'
							style={{
								objectPosition: adjustment?.objectPosition || '50% 50%',
							}}
						/>
					</div>
				) : (
					<div className='flex h-full w-full items-center justify-center bg-zinc-800 font-roboto text-xs uppercase tracking-[0.3em] text-zinc-400'>
						Photo
					</div>
				)}
			</div>

			<div
				className={`flex min-w-0 flex-1 flex-col ${isHero ? 'items-center text-center md:items-start md:text-left' : isFeature ? 'items-center text-center' : 'items-start'
					}`}
			>
				<h3 className={`font-roboto font-bold ${isRow ? 'transition-colors duration-200 group-hover:text-primary' : 'text-white'} ${primaryNameClasses}`}>
					{name.primary}
				</h3>
				{name.secondary && (
					<p className={`mt-1 font-roboto text-primary ${isRow ? 'transition-opacity duration-200 group-hover:opacity-100' : ''} ${secondaryNameClasses}`}>
						{name.secondary}
					</p>
				)}
				<div className={`${isRow ? 'mt-0.5' : 'mt-2'} font-roboto ${metaClasses}`}>
					{metaLines.map((line) => (
						<p key={line}>{line}</p>
					))}
				</div>
			</div>

			{isEditMode && (
				<div className='absolute right-4 top-4 z-20 flex w-32 flex-col gap-3 rounded-xl border border-white/15 bg-black/85 p-3 shadow-2xl'>
					<div className='text-[9px] uppercase tracking-[0.3em] text-zinc-400'>Adjust</div>
					<div className='flex flex-col gap-1'>
						<label className='text-[9px] text-zinc-400'>Pos X: {adjustment?.objectPosition?.split(' ')[0] || '50%'}</label>
						<input
							type='range'
							min='0'
							max='100'
							value={parseInt(adjustment?.objectPosition?.split(' ')[0] || '50')}
							onChange={(event) => {
								const y = adjustment?.objectPosition?.split(' ')[1] || '50%';
								updateAdjustment(member.id, 'objectPosition', `${event.target.value}% ${y}`);
							}}
							className='h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-lab-lime'
						/>
					</div>
					<div className='flex flex-col gap-1'>
						<label className='text-[9px] text-zinc-400'>Pos Y: {adjustment?.objectPosition?.split(' ')[1] || '50%'}</label>
						<input
							type='range'
							min='0'
							max='100'
							value={parseInt(adjustment?.objectPosition?.split(' ')[1] || '50')}
							onChange={(event) => {
								const x = adjustment?.objectPosition?.split(' ')[0] || '50%';
								updateAdjustment(member.id, 'objectPosition', `${x} ${event.target.value}%`);
							}}
							className='h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-lab-lime'
						/>
					</div>
					<div className='flex flex-col gap-1'>
						<label className='text-[9px] text-zinc-400'>Scale: {adjustment?.scale || 1}</label>
						<input
							type='range'
							min='0.5'
							max='3'
							step='0.05'
							value={adjustment?.scale || 1}
							onChange={(event) => updateAdjustment(member.id, 'scale', parseFloat(event.target.value))}
							className='h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-lab-lime'
						/>
					</div>
					<button
						onClick={() => resetAdjustment(member.id)}
						className='mt-1 inline-flex items-center justify-center gap-1 rounded-md bg-red-500/20 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-red-300 transition-colors hover:bg-red-500/35'
					>
						<RotateCcw size={10} />
						Reset
					</button>
				</div>
			)}
		</div>
	);
};

const SectionHeader = ({ normalizedType }: { normalizedType: string }) => {
	const content = useContent();
	const { language } = useLanguage();
	const titleMap = content.committeeSection.chairTitles as Record<string, { zh: string; en: string }>;
	const titleData = titleMap[normalizedType];
	const displayTitle = language === 'zh' ? titleData?.zh || normalizedType : toTitleCase(titleData?.en || normalizedType);

	return (
		<div className={`mb-5 ${panelFrame.sectionDivider} border-primary text-center`}>
			<h2 className='ds-panel-subheading text-[24px] leading-[32px] text-primary'>
				{displayTitle}
			</h2>
		</div>
	);
};

const SmallGroupPanel = ({
	normalizedType,
	members,
	localAdjustments,
	updateAdjustment,
	resetAdjustment,
	isEditMode,
}: {
	normalizedType: string;
	members: PersonItem[];
	localAdjustments: Record<string, ImageAdjustment>;
	updateAdjustment: (id: string, field: keyof ImageAdjustment, value: string | number) => void;
	resetAdjustment: (id: string) => void;
	isEditMode: boolean;
}) => {
	const content = useContent();
	const { language } = useLanguage();
	const titleMap = content.committeeSection.chairTitles as Record<string, { zh: string; en: string }>;
	const titleData = titleMap[normalizedType];
	const displayTitle = language === 'zh' ? titleData?.zh || normalizedType : toTitleCase(titleData?.en || normalizedType);

	return (
		<FramePanel className='h-full' contentClassName='px-[24px] py-[28px] md:px-[42px] md:py-[42px]' showCorners={false}>
			<h3 className='ds-panel-subheading mb-8 text-[24px] leading-[32px] text-primary'>
				{displayTitle}
			</h3>
			<div className='flex flex-col gap-4'>
				{members.map((member) => (
					<MemberCard
						key={member.id}
						member={member}
						localAdjustments={localAdjustments}
						updateAdjustment={updateAdjustment}
						resetAdjustment={resetAdjustment}
						isEditMode={isEditMode}
						variant='row'
					/>
				))}
			</div>
		</FramePanel>
	);
};

const OrganizationPage: React.FC<OrganizationPageProps> = ({ hidePeople = false }) => {
	const content = useContent();
	const { language } = useLanguage();
	useSEO(
		language === 'zh' ? '組織委員會' : 'Organization',
		language === 'zh'
			? 'TAICHI 2026 研討會籌備委員與大會主席名單。'
			: 'TAICHI 2026 organizing committee and conference chairs.',
	);

	const { people, isSyncing } = useData();
	const [searchParams] = useSearchParams();
	const isEditMode = searchParams.get('edit') === 'true';
	const [localAdjustments, setLocalAdjustments] = useState<Record<string, ImageAdjustment>>(CONFIG.imageAdjustments);

	const updateAdjustment = (id: string, field: keyof ImageAdjustment, value: string | number) => {
		setLocalAdjustments((prev) => {
			const current = prev[id] || {};
			const member = people.find((person) => person.id === id);

			return {
				...prev,
				[id]: {
					...current,
					[field]: value,
					lastUrl: member?.image || current.lastUrl,
				},
			};
		});
	};

	const resetAdjustment = (id: string) => {
		setLocalAdjustments((prev) => {
			const next = { ...prev };
			delete next[id];
			return next;
		});
	};

	const groupedMembers = useMemo(() => {
		const groups: GroupedMembers = {};
		people
			.filter((person) => !(person.chairType ? person.chairType.toLowerCase() : '').includes('keynote'))
			.forEach((member) => {
				const chairType = member.chairType || 'Committee Member';
				if (!groups[chairType]) {
					groups[chairType] = [];
				}
				groups[chairType].push(member);
			});

		Object.values(groups).forEach((members) => {
			members.sort((a, b) => {
				const orderA = typeof a.order === 'number' ? a.order : 999999;
				const orderB = typeof b.order === 'number' ? b.order : 999999;
				return orderA - orderB;
			});
		});

		return Object.entries(groups)
			.sort(([chairTypeA], [chairTypeB]) => {
				const normalizedA = getNormalizedChairType(chairTypeA);
				const normalizedB = getNormalizedChairType(chairTypeB);
				const indexA = CONFIG.notion.chairTypeOrder.findIndex((type) => type.toLowerCase() === normalizedA);
				const indexB = CONFIG.notion.chairTypeOrder.findIndex((type) => type.toLowerCase() === normalizedB);

				if (indexA === -1 && indexB === -1) return chairTypeA.localeCompare(chairTypeB);
				if (indexA === -1) return 1;
				if (indexB === -1) return -1;
				return indexA - indexB;
			})
			.map(([chairType, members]) => ({
				chairType,
				normalizedType: getNormalizedChairType(chairType),
				members,
			}));
	}, [people]);

	const showPeople = !hidePeople;
	const generalChairs = groupedMembers.find((group) => group.normalizedType === 'general chairs');
	const featuredGroups = groupedMembers.filter((group) =>
		['steering committees', 'best paper award committee'].includes(group.normalizedType),
	);
	const remainingGroups = groupedMembers.filter(
		(group) =>
			group.normalizedType !== 'general chairs' &&
			!['steering committees', 'best paper award committee', 'program chairs'].includes(group.normalizedType),
	);

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			{showPeople && (
				<div className='relative w-full overflow-hidden px-6 pb-16 pt-48 md:px-20'>
					<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
						<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>
							{content.committeeSection.title}
						</h1>
					</ScrollReveal>
				</div>
			)}

			{showPeople && (
				<section className='px-4 pb-8 md:px-8 md:pb-12'>
					<div className='mx-auto max-w-[1280px]'>
						<ScrollReveal delay={70}>
							<div className='ds-surface-panel px-6 py-12 text-center md:px-16 md:py-16'>
							<div className='mx-auto flex max-w-4xl flex-col items-center gap-8 md:gap-10'>
								<h2 className='ds-section-title text-[28px] leading-[1.35] md:text-[30px]'>
									{content.committeeSection.aboutTitle}
								</h2>
								<div className={`space-y-4 ${typography.scale.body} text-white/85`}>
									{content.committeeSection.aboutDescription.map((paragraph) => (
										<p key={paragraph}>{paragraph}</p>
									))}
								</div>
								<a
									href={content.committeeSection.aboutButtonUrl}
									target='_blank'
									rel='noreferrer'
									className='ds-button-secondary min-h-[46px] px-8 text-[18px] leading-[28px]'
								>
									{content.committeeSection.aboutButtonText}
								</a>
							</div>
							</div>
						</ScrollReveal>
					</div>
				</section>
			)}

			{showPeople && (
				<section className='pb-24 pt-16 md:pt-20'>
					<div className='mx-auto max-w-[1280px] px-4 md:px-8'>
						{isSyncing && people.length === 0 ? (
							<div className='space-y-40'>
								<div className='h-8 w-56 animate-pulse rounded bg-zinc-800' />
								<Skeleton variant='person' count={8} />
							</div>
						) : (
							<div className='space-y-36 md:space-y-40'>
								{generalChairs && (
									<section>
										<SectionHeader normalizedType={generalChairs.normalizedType} />
										<div className='grid gap-6 xl:grid-cols-2'>
											{generalChairs.members.map((member, index) => (
												<ScrollReveal key={member.id} delay={index * 90}>
													<MemberCard
														member={member}
														localAdjustments={localAdjustments}
														updateAdjustment={updateAdjustment}
														resetAdjustment={resetAdjustment}
														isEditMode={isEditMode}
														variant='hero'
													/>
												</ScrollReveal>
											))}
										</div>
									</section>
								)}

								{featuredGroups.map((group) => (
									<section key={group.chairType}>
										<SectionHeader normalizedType={group.normalizedType} />
										<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
											{group.members.map((member, index) => (
												<ScrollReveal key={member.id} delay={index * 80}>
													<MemberCard
														member={member}
														localAdjustments={localAdjustments}
														updateAdjustment={updateAdjustment}
														resetAdjustment={resetAdjustment}
														isEditMode={isEditMode}
														variant='feature'
													/>
												</ScrollReveal>
											))}
										</div>
									</section>
								))}

								{remainingGroups.length > 0 && (
									<div className='grid gap-8 xl:grid-cols-2 items-stretch'>
										{remainingGroups.map((group, index) => (
											<ScrollReveal key={group.chairType} delay={(index % 2) * 90}>
												<SmallGroupPanel
													normalizedType={group.normalizedType}
													members={group.members}
													localAdjustments={localAdjustments}
													updateAdjustment={updateAdjustment}
													resetAdjustment={resetAdjustment}
													isEditMode={isEditMode}
												/>
											</ScrollReveal>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</section>
			)}

			<Sponsors />

			{isEditMode && (
				<div className='fixed bottom-8 right-8 z-[100] w-[400px] max-w-[90vw]'>
					<div className='flex max-h-[500px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-zinc-900 shadow-2xl'>
						<div className='flex items-center justify-between border-b border-white/10 bg-zinc-800 px-5 py-3'>
							<div className='flex items-center gap-3'>
								<Settings className='animate-spin-slow text-lab-lime' size={18} />
								<span className='font-pixel text-sm tracking-widest'>CONFIG GENERATOR</span>
							</div>
							<div className='text-[10px] uppercase opacity-40'>Notion Image ID Map</div>
						</div>
						<div className='custom-scrollbar overflow-y-auto bg-black/40 p-4'>
							<p className='mb-3 text-[11px] leading-relaxed opacity-60'>
								Adjust images above, then copy this object into <code className='text-lab-lime'>src/content.ts</code>.
							</p>
							<div className='group relative'>
								<pre className='overflow-x-auto rounded-lg border border-white/5 bg-black/60 p-4 font-mono text-[10px] leading-relaxed text-gray-300 selection:bg-lab-lime/30'>
									{`imageAdjustments: ${JSON.stringify(localAdjustments, null, 2)} as Record<string, ImageAdjustment>,`}
								</pre>
								<button
									onClick={() => {
										const code = `imageAdjustments: ${JSON.stringify(localAdjustments, null, 2)} as Record<string, ImageAdjustment>,`;
										navigator.clipboard.writeText(code);
										const button = document.getElementById('copy-btn');
										if (button) button.innerText = 'COPIED!';
										setTimeout(() => {
											if (button) button.innerText = 'COPY CODE';
										}, 2000);
									}}
									className='absolute right-3 top-3 inline-flex items-center gap-2 rounded-md bg-lab-lime px-3 py-1.5 text-[10px] font-bold text-black shadow-lg transition-all hover:scale-105 active:scale-95'
								>
									<Copy size={12} />
									<span id='copy-btn'>COPY CODE</span>
								</button>
							</div>
						</div>
						<div className='flex items-center justify-between bg-zinc-800/50 px-5 py-2 text-[9px] opacity-50'>
							<span>{Object.keys(localAdjustments).length} Member(s) adjusted</span>
							<span className='font-bold text-lab-lime'>DEVELOPER MODE ACTIVE</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrganizationPage;
