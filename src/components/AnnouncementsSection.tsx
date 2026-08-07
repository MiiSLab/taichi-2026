import { ArrowUpRight, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NEWS as STATIC_NEWS } from '../content';
import { useContent } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import FramePanel from './FramePanel';
import ScrollReveal from './ScrollReveal';

// 公告卡 CTA 共用樣式（modal 按鈕 / 站內連結 / 外部連結三者同款）
const CTA_CLASS =
	'group/btn mt-auto inline-flex w-fit items-center gap-2 rounded border border-primary/60 bg-primary/10 px-5 py-2.5 font-pixel text-[14px] tracking-[0.08em] text-primary transition-colors hover:bg-primary hover:text-black';

const CTA_ARROW = (
	<ArrowUpRight className='size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5' strokeWidth={2.5} />
);

interface AnnouncementsSectionProps {
	limit?: number;
	/** Hide the built-in section heading (used on /news, which has its own page title). */
	hideHeader?: boolean;
}

/**
 * Homepage announcements feed, styled to match the current neon-on-black design
 * (FramePanel + dela/pixel fonts + lime accent).
 *
 * NOTE: this is intentionally backed by the static NEWS list (offlineFallbackData),
 * NOT the Notion-synced useData().news — announcements are few and edited in code
 * for now. Revisit Notion wiring if the volume grows. See scripts/upload-news-to-notion.mjs.
 */
const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ limit = 3, hideHeader = false }) => {
	const content = useContent();
	const items = limit ? STATIC_NEWS.slice(0, limit) : STATIC_NEWS;
	// 站內名單視窗（modal 欄位的公告，如錄取名單）
	const [modalItem, setModalItem] = useState<NewsItem | null>(null);

	useEffect(() => {
		document.body.style.overflow = modalItem ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [modalItem]);

	if (items.length === 0) return null;

	const sectionClass = hideHeader
		? 'relative flex w-full flex-col overflow-hidden bg-black px-5 pb-20 pt-12 sm:px-6 md:px-20 md:pb-24 md:pt-16'
		: 'relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-black px-5 pb-20 pt-28 sm:px-6 md:px-20 md:pb-24 md:pt-32';

	return (
		<section className={sectionClass}>
			<div className='relative z-10 w-full mx-auto max-w-7xl'>
				{!hideHeader && (
					<ScrollReveal>
						<p className='text-center ds-section-kicker'>{content.newsSection.subtitle}</p>
						<h2 className={`mt-3 text-center ${typography.scale.sectionTitle} text-primary`}>{content.newsSection.title}</h2>
					</ScrollReveal>
				)}

				<div className={`grid grid-cols-1 gap-6 xl:gap-8 ${hideHeader ? '' : 'mt-12 md:mt-16'} ${items.length > 1 ? 'md:grid-cols-2' : 'md:max-w-2xl md:mx-auto'}`}>
					{items.map((item, index) => (
						<ScrollReveal key={item.id} delay={index * 80} className='h-full'>
							{/* 黑底放 60% 黑的 FramePanel 幾乎沒區隔——區隔主要靠內層淡色漸層面，
							邊框壓到極淡（純白太搶），hover 才轉主色 */}
							<FramePanel
								className='h-full transition-colors border border-white/10 hover:border-primary/45'
								contentClassName='flex h-full flex-col bg-gradient-to-b from-zinc-900/70 to-zinc-950/40 p-6 md:p-8'
							>
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

								{item.closedLabel ? (
									<button
										type='button'
										disabled
										className='mt-auto inline-flex w-fit cursor-not-allowed items-center gap-2 rounded border border-white/15 bg-white/5 px-5 py-2.5 font-pixel text-[14px] tracking-[0.08em] text-white/40'
									>
										{item.closedLabel}
									</button>
								) : item.modal ? (
									<button type='button' onClick={() => setModalItem(item)} className={CTA_CLASS}>
										{item.linkLabel || content.newsSection.readMore}
										{CTA_ARROW}
									</button>
								) : item.link ? (
									// '/' 開頭為站內頁（如 /awards）：走 react-router 導頁、不開新分頁；外部連結維持新分頁
									item.link.startsWith('/') ? (
										<Link to={item.link} className={CTA_CLASS}>
											{item.linkLabel || content.newsSection.readMore}
											{CTA_ARROW}
										</Link>
									) : (
										<a href={item.link} target='_blank' rel='noreferrer' className={CTA_CLASS}>
											{item.linkLabel || content.newsSection.readMore}
											{CTA_ARROW}
										</a>
									)
								) : null}
							</FramePanel>
						</ScrollReveal>
					))}
				</div>
			</div>

			{/* 名單視窗：半匿名名單以格狀呈現，點背景或 X 關閉 */}
			{modalItem?.modal ? (
				<div
					className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md'
					onClick={() => setModalItem(null)}
				>
					<div
						className='relative max-h-[85vh] w-full max-w-lg overflow-y-auto border border-primary/40 bg-[rgba(9,9,11,0.97)] p-6 md:p-8'
						onClick={(event) => event.stopPropagation()}
					>
						<button
							type='button'
							onClick={() => setModalItem(null)}
							aria-label='Close'
							className='absolute p-2 transition-colors border rounded-full right-4 top-4 border-white/12 bg-black/45 text-white/70 hover:border-primary/40 hover:text-white'
						>
							<X size={18} />
						</button>
						{modalItem.subtitle ? <p className='ds-section-kicker'>{modalItem.subtitle}</p> : null}
						<h3 className='mt-2 font-dela text-[22px] leading-snug text-primary md:text-[24px]'>{modalItem.modal.title}</h3>
						<div className='mt-6 grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-3'>
							{modalItem.modal.names.map((name, index) => (
								<p
									key={`${name}-${index}`}
									className='border border-white/10 bg-white/[0.04] px-3 py-2 text-center font-mono text-[15px] tracking-[0.08em] text-white/90'
								>
									{name}
								</p>
							))}
						</div>
						{modalItem.modal.note ? <p className={`mt-6 ${typography.scale.micro} text-white/50`}>{modalItem.modal.note}</p> : null}
					</div>
				</div>
			) : null}
		</section>
	);
};

export default AnnouncementsSection;
