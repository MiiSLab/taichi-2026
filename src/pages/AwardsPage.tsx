import { FileText, Medal, Trophy, Vote, type LucideIcon } from 'lucide-react';
import React from 'react';
import FramePanel from '../components/FramePanel';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { cameraReadyUrl } from '../content.cameraReady';
import { useContent, useLanguage } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';

// 得獎名單資料形狀（資料在 content.zh.ts awardsPageSection；en 版共用作品/作者、只覆寫標籤）
type AwardWork = { id?: string; venueKey?: string; title: string; authors: readonly { name: string; affiliation: string }[] };
type AwardGroup = { name: string; tier: 'best' | 'mention' | 'choice'; works: readonly AwardWork[] };
type AwardCategory = { key: string; heading: string; awards: readonly AwardGroup[] };
type AwardsSection = { title: string; intro: string; venueLabels: Record<string, string>; categories: readonly AwardCategory[] };

// 類別色沿用 ProgramPage 的 KIND_TONE（Paper 主色、Poster 副色、Demo 白），跨頁掃讀一致
const CATEGORY_TONE: Record<string, string> = { paper: 'text-primary', poster: 'text-secondary', demo: 'text-white' };

// 獎項不分層級突顯（大家都很厲害）：每張卡都是全寬金框；層級只靠 icon 區分（Trophy / Medal / Vote）
const TIER_ICON: Record<AwardGroup['tier'], LucideIcon> = { best: Trophy, mention: Medal, choice: Vote };

const AwardCard = ({ group, work, venueLabel, delay }: { group: AwardGroup; work: AwardWork; venueLabel?: string; delay: number }) => {
	const Icon = TIER_ICON[group.tier];
	// camera-ready PDF：同 ProgramPage 名單列，對得上編號才出 icon（未繳或已撤下者查表落空）
	const pdf = cameraReadyUrl(work.id);
	return (
		<ScrollReveal delay={delay} className='h-full'>
			<FramePanel
				className='h-full border border-amber-300/35 transition-colors hover:border-amber-300/60'
				contentClassName='flex h-full flex-col bg-gradient-to-b from-zinc-900/70 to-zinc-950/40 p-6 md:p-8'
			>
				<div className='flex flex-wrap items-center gap-x-2.5 gap-y-1'>
					<Icon size={18} className='text-amber-300' aria-hidden />
					<span className='font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-amber-300'>{group.name}</span>
					{venueLabel && <span className='font-mono text-[12px] text-white/45'>· {venueLabel}</span>}
				</div>
				<h3 className='mt-3 font-sans text-[18px] font-semibold leading-relaxed text-white md:text-[21px]'>
					{work.title}
					{pdf && (
						<a
							href={pdf}
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Camera-ready PDF'
							title='Camera-ready PDF'
							className='ms-2 inline-flex translate-y-0.5 text-white/40 transition-colors hover:text-primary'
						>
							<FileText size={15} />
						</a>
					)}
				</h3>
				<div className='mt-4 flex flex-wrap gap-x-6 gap-y-2.5'>
					{work.authors.map((author) => (
						<div key={author.name}>
							<p className='font-sans text-[14px] leading-5 text-white/85'>{author.name}</p>
							<p className='font-sans text-[12px] leading-4 text-white/45'>{author.affiliation}</p>
						</div>
					))}
				</div>
			</FramePanel>
		</ScrollReveal>
	);
};

/**
 * /awards — 得獎名單公告頁。Hero 同 /news；正文依 Paper / Poster / Demo 分節，
 * 每個獎項一張全寬金框卡，卡上直接列作者與所屬單位。
 */
const AwardsPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	const section = content.awardsPageSection as unknown as AwardsSection;
	useSEO(language === 'zh' ? '得獎名單' : 'Awards', section.intro);

	return (
		<div className='min-h-screen w-full bg-black text-white'>
			<div className='relative w-full overflow-hidden px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					{/* hero 與 /news、/organization 同款：只放大標，說明文字移到內文區 */}
					<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>{section.title}</h1>
				</ScrollReveal>
			</div>

			<div className='mx-auto flex w-full max-w-5xl flex-col gap-16 px-5 pb-24 sm:px-6 md:gap-20 md:pb-32'>
				<ScrollReveal className='-mb-6 md:-mb-8'>
					<p className={`${typography.scale.body} text-white/70`}>{section.intro}</p>
				</ScrollReveal>
				{section.categories.map((category) => (
					<section key={category.key} aria-label={category.heading}>
						<ScrollReveal>
							<div className='border-b-2 border-white/20 pb-3'>
								<h2 className={`font-mono text-[24px] font-bold leading-8 ${CATEGORY_TONE[category.key] ?? 'text-white'}`}>{category.heading}</h2>
							</div>
						</ScrollReveal>
						<div className='mt-6 flex flex-col gap-4'>
							{category.awards.flatMap((group) =>
								group.works.map((work, index) => (
									<AwardCard
										key={`${group.name}-${work.title}`}
										group={group}
										work={work}
										venueLabel={work.venueKey ? section.venueLabels[work.venueKey] : undefined}
										delay={index * 60}
									/>
								)),
							)}
						</div>
					</section>
				))}
			</div>
		</div>
	);
};

export default AwardsPage;
