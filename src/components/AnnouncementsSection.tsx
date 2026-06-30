import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { NEWS as STATIC_NEWS } from '../content';
import { useContent } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import FramePanel from './FramePanel';
import ScrollReveal from './ScrollReveal';

interface AnnouncementsSectionProps {
	limit?: number;
}

/**
 * Homepage announcements feed, styled to match the current neon-on-black design
 * (FramePanel + dela/pixel fonts + lime accent).
 *
 * NOTE: this is intentionally backed by the static NEWS list (offlineFallbackData),
 * NOT the Notion-synced useData().news — announcements are few and edited in code
 * for now. Revisit Notion wiring if the volume grows. See scripts/upload-news-to-notion.mjs.
 */
const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ limit = 3 }) => {
	const content = useContent();
	const items = limit ? STATIC_NEWS.slice(0, limit) : STATIC_NEWS;

	if (items.length === 0) return null;

	return (
		<section className='relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-black px-5 pb-20 pt-28 sm:px-6 md:px-20 md:pb-24 md:pt-32'>
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.10),transparent_42%)]' />

			<div className='relative z-10 mx-auto w-full max-w-[1280px]'>
				<ScrollReveal>
					<p className='text-center ds-section-kicker'>{content.newsSection.subtitle}</p>
					<h2 className={`mt-3 text-center ${typography.scale.sectionTitle} text-primary`}>{content.newsSection.title}</h2>
				</ScrollReveal>

				<div className={`mt-12 grid grid-cols-1 gap-6 md:mt-16 xl:gap-8 ${items.length > 1 ? 'md:grid-cols-2' : 'md:max-w-2xl md:mx-auto'}`}>
					{items.map((item, index) => (
						<ScrollReveal key={item.id} delay={index * 80} className='h-full'>
							<FramePanel className='h-full' contentClassName='flex h-full flex-col p-6 md:p-8'>
								<div className='flex items-start justify-between gap-4'>
									{item.subtitle ? (
										<span className={`${typography.scale.sectionEyebrow} text-primary`}>{item.subtitle}</span>
									) : (
										<span />
									)}
									{item.createdTime || item.date ? (
										<span className='whitespace-nowrap font-mono text-[12px] leading-5 text-white/40'>{item.createdTime || item.date}</span>
									) : null}
								</div>

								<h3 className='mt-4 font-dela text-[22px] leading-snug text-white md:text-[26px]'>{item.title}</h3>

								<div className={`mt-4 mb-2 space-y-3 ${typography.scale.body} text-white/75`}>
									{item.content
										.split('\n')
										.map((para) => para.trim())
										.filter(Boolean)
										.map((para, i) => (
											<p key={i}>{para}</p>
										))}
								</div>

								{item.link ? (
									<a
										href={item.link}
										target='_blank'
										rel='noreferrer'
										className='group/btn mt-auto inline-flex w-fit items-center gap-2 rounded border border-primary/60 bg-primary/10 px-5 py-2.5 font-pixel text-[14px] tracking-[0.08em] text-primary transition-colors hover:bg-primary hover:text-black'
									>
										{item.linkLabel || content.newsSection.readMore}
										<ArrowUpRight className='size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5' strokeWidth={2.5} />
									</a>
								) : null}
							</FramePanel>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
};

export default AnnouncementsSection;
