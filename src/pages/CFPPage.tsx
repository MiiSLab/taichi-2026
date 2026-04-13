import { ChevronUp, ChevronsDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import FramePanel from '../components/FramePanel';
import CountdownTimer from '../components/CountdownTimer';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import ConstellationMapSection from '../components/ConstellationMap';
import { panelFrame } from '../design-system/panel';
import { typography } from '../design-system/typography';
import { SiteContent } from '../content';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

type Category = SiteContent['cfpSection']['categories'][number];

type PaperSectionContent = {
	intro: string;
	contact: string;
	fullPaperHeading: string;
	fullPaperIntro: string;
	fullPaperBullets: string[];
	fullPaperSummary: string;
	pictorialHeading: string;
	pictorialIntro: string;
	pictorialBullets: string[];
	pictorialSummary: string;
	noteHeading: string;
	noteBullets: string[];
	deskRejectHeading: string;
	deskRejectIntro: string;
	deskRejectBullets: string[];
	chairHeading: string;
	chairs: string[];
};

type PosterDemoSectionContent = {
	intro: string;
	extraIntro?: string;
	contact: string;
	formatHeading: string;
	formatBullets: string[];
	noteHeading: string;
	noteBullets: string[];
	chairHeading: string;
	chairs: string[];
};

type DeskRejectCard = {
	title: string;
	subtitle: string;
	body: string;
};



type SectionTheme = {
	mainTitle: string;
	accentTitle: string;
	backgroundImage: string;
	backgroundPosition?: string;
	submissionLabel: string;
};

const getCategoryThemes = (language: 'zh' | 'en'): Record<'papers' | 'posters' | 'demos', SectionTheme> => ({
	papers: {
		mainTitle: language === 'zh' ? '論文與圖像式論文' : 'Full Paper & Pictorial',
		//accentTitle: 'Full Paper & Pictorial',
		backgroundImage: '/images/oral_presentation_bg.png',
		backgroundPosition: 'center',
		submissionLabel: 'SUBMISSION DEADLINE',
	},
	posters: {
		mainTitle: language === 'zh' ? '海報論文' : 'Poster',
		//accentTitle: 'Poster',
		backgroundImage: '/images/poster_presentation_bg.jpg',
		backgroundPosition: 'center',
		submissionLabel: 'SUBMISSION DEADLINE',
	},
	demos: {
		mainTitle: language === 'zh' ? '互動展示' : 'Interactivity and Demo',
		//accentTitle: 'Demo',
		backgroundImage: '/images/demo_presentation.png',
		backgroundPosition: 'center',
		submissionLabel: 'SUBMISSION DEADLINE',
	},
});

const parseText = (text: string) => {
	const regex = /\*\*([^*]+)\*\*|__([^_]+)__|\[(.*?)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|((?:https?:\/\/|mailto:)[^\s)]+)/g;
	const parts = [];
	let lastIndex = 0;
	let match;
	let count = 0;
	const getLinkClassName = (href: string) =>
		`${href.startsWith('mailto:') ? 'inline-block whitespace-nowrap break-normal' : 'min-w-0 break-words [overflow-wrap:anywhere]'} text-[#F5FF33] transition-colors hover:text-[#A8F020] hover:underline`;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(<span key={`text-${count}`}>{text.slice(lastIndex, match.index)}</span>);
			count++;
		}

		if (match[1]) {
			parts.push(
				<strong key={`bold-highlight-${count}`} className='font-extrabold text-[#A8F020]'>
					{match[1]}
				</strong>,
			);
		} else if (match[2]) {
			parts.push(
				<strong key={`bold-only-${count}`} className='font-extrabold text-white'>
					{match[2]}
				</strong>,
			);
		} else if (match[5]) {
			parts.push(
				<a
					key={`url-${count}`}
					href={match[5]}
					className={getLinkClassName(match[5])}
					target='_blank'
					rel='noreferrer'
				>
					{match[5]}
				</a>,
			);
		} else {
			parts.push(
				<a
					key={`link-${count}`}
					href={match[4]}
					className={getLinkClassName(match[4])}
					target='_blank'
					rel='noreferrer'
				>
					{match[3]}
				</a>,
			);
		}

		count++;
		lastIndex = regex.lastIndex;
	}

	if (lastIndex < text.length) {
		parts.push(<span key={`text-${count}`}>{text.slice(lastIndex)}</span>);
	}

	return parts;
};

const stripBullet = (text: string) => text.replace(/^●\s*/, '');

const findDescriptionIndex = (lines: string[], candidates: string[]) =>
	lines.findIndex((line) => candidates.includes(line.trim()));

const sliceBetween = (lines: string[], start: number, end?: number) => {
	if (start < 0) {
		return [];
	}

	const safeEnd = end === undefined || end < 0 ? lines.length : end;
	return lines.slice(start, safeEnd);
};

const getPaperSectionContent = (category: Category): PaperSectionContent => {
	const fullPaperIndex = findDescriptionIndex(category.description, ['論文（Full Paper）', 'Full Paper']);
	const pictorialIndex = findDescriptionIndex(category.description, ['圖像式論文（Pictorial）', 'Pictorial']);
	const notesIndex = findDescriptionIndex(category.description, ['備註', 'Notes']);
	const chairsIndex = findDescriptionIndex(category.description, ['Paper Chairs', '論文主席']);
	const contactIndex = category.description.findIndex((line) => line.includes('taiwanchi26+paper@gmail.com'));
	const deskRejectIndex = category.description.findIndex((line) => line.includes('Desk Reject Policy') || line === '直接退稿規定');

	return {
		intro: category.description[0],
		contact: category.description[contactIndex],
		fullPaperHeading: category.description[fullPaperIndex],
		fullPaperIntro: category.description[fullPaperIndex + 1],
		fullPaperBullets: sliceBetween(category.description, fullPaperIndex + 2, pictorialIndex - 1),
		fullPaperSummary: category.description[pictorialIndex - 1] ?? '',
		pictorialHeading: category.description[pictorialIndex],
		pictorialIntro: category.description[pictorialIndex + 1],
		pictorialBullets: sliceBetween(category.description, pictorialIndex + 2, notesIndex - 1),
		pictorialSummary: category.description[notesIndex - 1] ?? '',
		noteHeading: category.description[notesIndex] ?? 'Notes',
		noteBullets: sliceBetween(category.description, notesIndex + 1, deskRejectIndex),
		deskRejectHeading: 'Desk Reject Policy',
		deskRejectIntro: category.description[deskRejectIndex + 1],
		deskRejectBullets: sliceBetween(category.description, deskRejectIndex + 2, chairsIndex),
		chairHeading: 'Paper & Pictorial Chairs',
		chairs: sliceBetween(category.description, chairsIndex + 1, contactIndex),
	};
};

const getPosterSectionContent = (category: Category, language: 'zh' | 'en'): PosterDemoSectionContent => {
	const formatIndex = findDescriptionIndex(category.description, ['投稿格式', 'Submission Format']);
	const noteIndex = findDescriptionIndex(category.description, ['備註', 'Notes']);
	const chairsIndex = findDescriptionIndex(category.description, ['Poster Chairs', '海報主席']);
	const contactIndex = category.description.findIndex((line) => line.includes('taiwanchi26+poster@gmail.com'));

	return {
		intro: category.description[0],
		extraIntro: language === 'zh' ? '今年海報展出會開放大眾參觀。' : 'This year, the poster exhibition will also be open to the public.',
		contact: stripBullet(category.description[contactIndex]),
		formatHeading: category.description[formatIndex],
		formatBullets: sliceBetween(category.description, formatIndex + 1, noteIndex),
		noteHeading: category.description[noteIndex] ?? 'Notes',
		noteBullets: sliceBetween(category.description, noteIndex + 1, chairsIndex),
		chairHeading: 'Poster Chairs',
		chairs: sliceBetween(category.description, chairsIndex + 1, contactIndex),
	};
};

const getDemoSectionContent = (category: Category): PosterDemoSectionContent => {
	const formatIndex = findDescriptionIndex(category.description, ['投稿格式', 'Submission Format']);
	const noteIndex = findDescriptionIndex(category.description, ['備註', 'Notes']);
	const chairsIndex = findDescriptionIndex(category.description, ['Demo Chairs', '展示主席']);
	const contactIndex = category.description.findIndex((line) => line.includes('taiwanchi26+demo@gmail.com'));

	return {
		intro: category.description[0],
		contact: stripBullet(category.description[contactIndex]),
		formatHeading: category.description[formatIndex],
		formatBullets: sliceBetween(category.description, formatIndex + 1, noteIndex),
		noteHeading: category.description[noteIndex] ?? 'Notes',
		noteBullets: sliceBetween(category.description, noteIndex + 1, chairsIndex),
		chairHeading: 'Demo Chairs',
		chairs: sliceBetween(category.description, chairsIndex + 1, contactIndex),
	};
};

const parseDeskRejectCard = (text: string): DeskRejectCard => {
	const cleaned = stripBullet(stripBullet(text));
	const match = cleaned.match(/^__([^_]+)__：(.+)$/);
	const heading = match ? match[1] : cleaned;
	const body = match ? match[2] : '';
	const headingMatch = heading.match(/^(.+?)（(.+?)）$/);

	return {
		title: headingMatch?.[1] ?? heading,
		subtitle: headingMatch?.[2] ? `(${headingMatch[2]})` : '',
		body,
	};
};

const parseChair = (chair: string) => {
	const parts = chair.split(' / ').map((part) => part.trim());
	if (parts.length < 2) {
		return { name: chair, organization: '' };
	}

	return {
		name: parts.slice(0, -1).join(' / '),
		organization: parts[parts.length - 1],
	};
};

const parseSubmissionDate = (date: string) => {
	const match = date.match(/^([^(]+?)(\(.+\))$/);

	if (!match) {
		return {
			primary: date,
			secondary: '',
		};
	}

	return {
		primary: match[1].trim(),
		secondary: match[2].trim(),
	};
};
const SectionHeader = ({
	title,
	className = '',
}: {
	title: string;
	className?: string;
}) => (
	<div className={`${panelFrame.sectionDivider} ${className}`}>
		<h3 className='font-roboto text-[24px] font-bold leading-8 text-white'>{title}</h3>
	</div>
);

const DotHeader = ({ title }: { title: string }) => (
	<div className='flex items-center gap-3'>
		<div className='size-2 rounded-full bg-[#A8F020]' />
		<h3 className='font-roboto text-[20px] font-bold leading-7 text-[#A8F020]'>{title}</h3>
	</div>
);

const SubmissionButton = () => {
	const content = useContent();

	return (
		<a
			href={content.cfpSection.submissionLink}
			target='_blank'
			rel='noopener noreferrer'
			className={`ds-button-submit w-full px-5 py-4 ${typography.scale.buttonLabel} sm:px-6`}
		>
			<span>{content.submissionDeadline.buttonText}</span>
			<span className='text-[24px] leading-none'>→</span>
		</a>
	);
};

const CategoryHero = ({
	id,
	theme,
	date,
	intro,
	extraIntro,
}: {
	id: string;
	theme: SectionTheme;
	date: string;
	intro: string;
	extraIntro?: string;
}) => {
	const submissionDate = parseSubmissionDate(date);

	return (
		<section id={id} className='relative overflow-hidden'>
			<div
				className='absolute inset-0 bg-cover bg-center'
				style={{ backgroundImage: `url(${theme.backgroundImage})`, backgroundPosition: theme.backgroundPosition ?? 'center' }}
			/>
			<div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/45' />
			<div className='absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black' />

			<div className='relative mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-14'>
				<div className='max-w-[592px]'>
					<h2 className='font-dela text-[36px] leading-tight text-[#A8F020] md:text-[36px] xl:text-[48px]'>{theme.mainTitle}</h2>
					<p className='mt-3 font-roboto text-[20px] font-bold leading-7 text-[#A8F020] sm:text-[22px] md:text-[24px] xl:text-[30px]'>{theme.accentTitle}</p>

					<ScrollReveal delay={40}>
						<FramePanel
							className='mt-8 border-transparent bg-transparent md:border-[#A8F020]/40 md:bg-black/60'
							contentClassName='px-0 py-0 md:px-8 md:py-8'
							cornerSize={12}
							cornerClassName='hidden md:block'
						>
							<p className='font-mono text-[14px] font-bold tracking-[0.05em] text-[#A8F020]'>{theme.submissionLabel}</p>
							<p className='mt-3 font-mono text-[26px] font-bold leading-tight text-white sm:text-[30px] md:text-[36px]'>{submissionDate.primary}</p>
							{submissionDate.secondary ? (
								<p className='mt-2 font-medium text-[15px] leading-6 text-white/60 md:text-[16px]'>{submissionDate.secondary}</p>
							) : null}
						</FramePanel>
					</ScrollReveal>

					<div className={`mt-8 space-y-4 ${typography.scale.body} text-white/90`}>
						<p>{parseText(intro)}</p>
						{extraIntro ? <p>{parseText(extraIntro)}</p> : null}
					</div>

					<div className='mt-10 max-w-[592px]'>
						<SubmissionButton />
					</div>
				</div>
			</div>
		</section>
	);
};

const BulletList = ({
	items,
	className = '',
	itemClassName = '',
	bulletClassName = 'text-[#A8F020]',
}: {
	items: string[];
	className?: string;
	itemClassName?: string;
	bulletClassName?: string;
}) => (
	<ul className={`space-y-3 ${typography.scale.body} ${className}`}>
		{items.map((item) => (
			<li key={item} className={`flex items-start gap-3 text-white/80 ${itemClassName}`}>
				<span className={`mt-[2px] font-bold ${bulletClassName}`}>•</span>
				<span>{parseText(stripBullet(item))}</span>
			</li>
		))}
	</ul>
);

const SummaryBlock = ({ text }: { text: string }) => (
	<div className='mt-6 rounded-[10px] bg-black/40 p-4'>
		<p className={`${typography.scale.body} text-white/80`}>{parseText(text)}</p>
	</div>
);

const ChairsPanel = ({ title, chairs }: { title: string; chairs: string[] }) => (
	<FramePanel className='h-full' contentClassName='p-8'>
		<DotHeader title={title} />
		<div className='mt-8 space-y-3'>
			{chairs.map((chair, index) => {
				const parsed = parseChair(chair);
				const isLast = index === chairs.length - 1;
				return (
					<div key={chair} className={isLast ? 'pb-0' : 'border-b border-white/10 pb-3'}>
						<p className={`${typography.scale.body} text-white/90`}>{parsed.name}</p>
						{parsed.organization ? (
							<p className={`mt-1 ${typography.scale.body} text-white/60`}>{parsed.organization}</p>
						) : null}
					</div>
				);
			})}
		</div>
	</FramePanel>
);

const ContactStrip = ({ text }: { text: string }) => (
	<div className='mt-8 px-6 py-5 text-center md:px-10'>
		<div className={`${typography.scale.label} text-white/80`}>{parseText(text)}</div>
	</div>
);







const PaperSection = ({
	category,
	content,
	theme,
}: {
	category: Category;
	content: PaperSectionContent;
	theme: SectionTheme;
}) => (
	<div className='bg-black pb-24'>
		<CategoryHero id='papers' theme={theme} date={category.date} intro={content.intro} />

		<div className='mx-auto -mt-10 max-w-[1280px] px-4 md:px-8'>
			<div className='bg-black/90 px-0 pt-12'>
				<div className='grid items-stretch gap-6 xl:grid-cols-2 xl:gap-8'>
					<ScrollReveal delay={0} className='h-full'>
						<FramePanel className='h-full min-h-[420px] xl:min-h-[460px]' contentClassName='flex h-full flex-col p-6 md:p-8 xl:p-10'>
							<SectionHeader title={content.fullPaperHeading} />
							<p className={`mt-6 ${typography.scale.body} text-white/80`}>{parseText(content.fullPaperIntro)}</p>
							<BulletList items={content.fullPaperBullets} className='mt-6' />
							<SummaryBlock text={content.fullPaperSummary} />
						</FramePanel>
					</ScrollReveal>

					<ScrollReveal delay={90} className='h-full'>
						<FramePanel className='h-full min-h-[420px] xl:min-h-[460px]' contentClassName='flex h-full flex-col p-6 md:p-8 xl:p-10'>
							<SectionHeader title={content.pictorialHeading} />
							<p className={`mt-6 ${typography.scale.body} text-white/80`}>{parseText(content.pictorialIntro)}</p>
							<BulletList items={content.pictorialBullets} className='mt-6' />
							<SummaryBlock text={content.pictorialSummary} />
						</FramePanel>
					</ScrollReveal>
				</div>

				<div className='mt-10 grid gap-4 xl:mt-12 xl:grid-cols-2 xl:gap-8'>
					<ScrollReveal delay={0} className='order-1 xl:col-span-2'>
						<FramePanel contentClassName='p-6 md:p-8 xl:p-10'>
							<DotHeader title={content.deskRejectHeading} />
							<p className={`mt-5 ${typography.scale.body} text-white/80 xl:mt-6`}>
								{parseText(stripBullet(content.deskRejectIntro))}
							</p>
							<div className='mt-8 grid gap-6 xl:grid-cols-3'>
								{content.deskRejectBullets.map((item, index) => {
									const card = parseDeskRejectCard(item);
									return (
										<ScrollReveal key={item} delay={index * 80}>
											<div className='rounded-[10px] border border-white/10 bg-black/30 p-6'>
												<p className='font-roboto text-[16px] font-bold leading-6 text-white'>{card.title}</p>
												{card.subtitle ? (
													<p className='mt-1 font-roboto text-[12px] font-bold leading-4 text-white/50'>{card.subtitle}</p>
												) : null}
												<p className={`mt-4 ${typography.scale.body} text-white/70`}>{parseText(card.body)}</p>
											</div>
										</ScrollReveal>
									);
								})}
							</div>
						</FramePanel>
					</ScrollReveal>

					<ScrollReveal delay={40} className='order-2'>
						<FramePanel className='h-full min-h-[320px]' contentClassName='px-8 pb-8 pt-5 xl:p-8'>
							<DotHeader title={content.noteHeading} />
							<BulletList items={content.noteBullets} className='mt-5 xl:mt-8' bulletClassName='text-white/70' itemClassName='text-white/90' />
						</FramePanel>
					</ScrollReveal>

					<ScrollReveal delay={90} className='order-3'>
						<ChairsPanel title={content.chairHeading} chairs={content.chairs} />
					</ScrollReveal>
				</div>

				<ContactStrip text={content.contact} />
			</div>
		</div>
	</div>
);

const PosterDemoSection = ({
	id,
	theme,
	category,
	content,
}: {
	id: string;
	theme: SectionTheme;
	category: Category;
	content: PosterDemoSectionContent;
}) => (
	<div className='bg-black pb-24'>
		<CategoryHero id={id} theme={theme} date={category.date} intro={content.intro} extraIntro={content.extraIntro} />

		<div className='mx-auto -mt-10 max-w-[1280px] px-4 md:px-8'>
			<div className='bg-black/90 px-0 pt-12'>
				<ScrollReveal delay={0}>
					<FramePanel contentClassName='p-6 md:p-8 xl:p-10'>
						<SectionHeader title={content.formatHeading} />
						<BulletList items={content.formatBullets} className='mt-8' />
					</FramePanel>
				</ScrollReveal>

				<div className='mt-12 grid gap-6 xl:grid-cols-2 xl:gap-8'>
					<ScrollReveal delay={0}>
						<FramePanel className='h-full' contentClassName='p-8'>
							<DotHeader title={content.noteHeading} />
							<BulletList items={content.noteBullets} className='mt-8' bulletClassName='text-white/70' itemClassName='text-white/90' />
						</FramePanel>
					</ScrollReveal>

					<ScrollReveal delay={90}>
						<ChairsPanel title={content.chairHeading} chairs={content.chairs} />
					</ScrollReveal>
				</div>

				<ContactStrip text={content.contact} />
			</div>
		</div>
	</div>
);

const CFPPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	useSEO(
		language === 'zh' ? '徵稿資訊' : 'Call for Papers',
		language === 'zh'
			? 'TAICHI 2026 論文徵稿資訊：長篇論文、圖像式論文、海報、互動展示等投稿規定與重要時程。'
			: 'TAICHI 2026 call for papers, poster, and demo submission guidelines and deadlines.',
	);
	const [showBackToTop, setShowBackToTop] = useState(false);
	const categoryThemes = getCategoryThemes(language);

	const paperCategory = content.cfpSection.categories.find((category) => category.id === 'papers');
	const posterCategory = content.cfpSection.categories.find((category) => category.id === 'posters');
	const demoCategory = content.cfpSection.categories.find((category) => category.id === 'demos');

	const paperContent = paperCategory ? getPaperSectionContent(paperCategory) : null;
	const posterContent = posterCategory ? getPosterSectionContent(posterCategory, language) : null;
	const demoContent = demoCategory ? getDemoSectionContent(demoCategory) : null;

	useEffect(() => {
		const handleScroll = () => {
			setShowBackToTop(window.scrollY > 160 || ['#papers', '#posters', '#demos'].includes(window.location.hash));
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('hashchange', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('hashchange', handleScroll);
		};
	}, []);

	const scrollToSection = (hash: string) => {
		const id = hash.replace('#', '');
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		window.history.replaceState(null, '', hash);
	};

	const scrollToTop = () => {
		window.history.replaceState(null, '', window.location.pathname);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<section className='relative w-full bg-black text-white'>
			<div className='relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-black px-6 pb-20 pt-32 md:px-20 md:pb-24 md:pt-48'>
				<WarpBackground />

				<div className='relative z-10 mt-4 flex w-full max-w-[1454px] flex-col items-center md:mt-0'>
					<ScrollReveal>
						<h1 className={`mb-10 text-center ${typography.scale.pageTitle} text-[#A8F020] drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] md:mb-12`}>
							{content.cfpSection.title}
						</h1>
					</ScrollReveal>

					<div className='mt-16 flex w-full max-w-[1453px] flex-col items-center md:mt-20' id='important-dates'>
						<h3 className='mb-10 text-center font-dela text-[28px] tracking-[0.12em] text-[#A8F020] md:mb-12 md:text-[40px]'>
							{content.cfpSection.importantDatesTitle}
						</h3>
						<ScrollReveal className='w-full' delay={80}>
							<div className='mx-auto grid w-full auto-rows-fr grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-stretch xl:max-w-[1220px] xl:gap-0'>
								{content.cfpSection.heroTimelineItems.map((item, index) => (
									<div
										key={item.title}
										className={`flex h-full min-h-[112px] w-full max-w-[28rem] flex-col items-center justify-start rounded-none bg-white/5 px-3 py-4 text-center sm:max-w-none xl:bg-transparent xl:px-6 xl:py-0 ${index < content.cfpSection.heroTimelineItems.length - 1 ? 'xl:border-r xl:border-white/10' : ''}`}
									>
										<p className={`${typography.scale.sectionEyebrow} text-[#A8F020]`}>{item.title}</p>
										<p className={`mt-[14px] ${typography.scale.deadlineValue} text-white`}>{item.date}</p>
										<p className={`mt-2 ${typography.scale.deadlineMeta} text-white/50`}>{item.subtitle}</p>
									</div>
								))}
							</div>
						</ScrollReveal>

						<button
							onClick={() => scrollToSection('#papers')}
							className='group mt-16 flex cursor-pointer flex-col items-center gap-2 transition-all hover:scale-105'
							aria-label='Scroll to Paper Section'
							type='button'
						>
							<div className='flex flex-col items-center animate-bounce'>
								<span className='mb-1 font-pixel text-sm uppercase tracking-[0.3em] text-[#a8f020] drop-shadow-[0_0_15px_rgba(168,240,32,0.8)] transition-colors group-hover:text-white md:mb-2 md:text-xl'>
									{content.cfpSection.exploreMore}
								</span>
								<ChevronsDown
									className='h-12 w-12 text-[#a8f020] drop-shadow-[0_0_20px_rgba(168,240,32,0.8)] transition-colors group-hover:text-white md:h-16 md:w-16'
									strokeWidth={1.5}
								/>
							</div>
						</button>
					</div>
				</div>
			</div>

			<ConstellationMapSection language={language} />

			{paperCategory && paperContent ? <PaperSection category={paperCategory} content={paperContent} theme={categoryThemes.papers} /> : null}
			{posterCategory && posterContent ? (
				<PosterDemoSection id='posters' theme={categoryThemes.posters} category={posterCategory} content={posterContent} />
			) : null}
			{demoCategory && demoContent ? (
				<PosterDemoSection id='demos' theme={categoryThemes.demos} category={demoCategory} content={demoContent} />
			) : null}


			{showBackToTop ? (
				<button
					type='button'
					onClick={scrollToTop}
					className='fixed bottom-8 right-6 z-50 inline-flex items-center gap-2 border border-[#A8F020] bg-black/85 px-4 py-3 font-pixel text-[20px] tracking-[0.08em] text-[#A8F020] transition-colors hover:bg-[rgba(168,240,32,0.16)] hover:text-white'
					aria-label='Back to top'
				>
					<ChevronUp className='size-4' strokeWidth={2.5} />
					TOP
				</button>
			) : null}
		</section>
	);
};

export default CFPPage;
