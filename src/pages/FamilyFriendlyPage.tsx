import { Accessibility, ArrowUp, Baby, Droplets, MapPin, Milk, Toilet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const FACILITY_ICONS = {
	toilet: Toilet,
	baby: Baby,
	milk: Milk,
	accessibility: Accessibility,
	droplets: Droplets,
} as const;

// 三段共用同一套外框：一致的水平內距 + 單欄 max-w-3xl，讓每段文字/卡片左右邊界完全對齊
const SECTION_CLASS = 'scroll-mt-28 px-6 py-16 md:py-20';
const CONTAINER_CLASS = 'mx-auto max-w-3xl';

// 段落標題：primary kicker eyebrow + primary 標題 + 收在欄內的底線（非全幅分隔線）
const SectionHeading: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => (
	<div className='mb-10 border-b border-white/15 pb-4'>
		<p className='ds-section-kicker mb-2'>{kicker}</p>
		<h2 className={`${typography.scale.sectionTitle} text-primary`}>{title}</h2>
	</div>
);

const FamilyFriendlyPage: React.FC = () => {
	const content = useContent();
	const section = content.familyFriendlySection;
	const { language } = useLanguage();
	const [showBackToTop, setShowBackToTop] = useState(false);

	useSEO(language === 'zh' ? '親子友善' : 'Family-Friendly', section.seoDescription);

	useEffect(() => {
		const handleScroll = () => setShowBackToTop(window.scrollY > 600);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.history.replaceState(null, '', window.location.pathname);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			<div className='relative w-full overflow-hidden px-6 pb-14 pt-48 md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>
						Family-<br />Friendly
					</h1>
				</ScrollReveal>
			</div>

			{/* Section 1 · 親子友善設計 */}
			<section id='family-design' className={SECTION_CLASS}>
				<div className={CONTAINER_CLASS}>
					<ScrollReveal>
						<SectionHeading kicker='Family-Friendly' title={section.headline} />
					</ScrollReveal>

					<ScrollReveal delay={80}>
						<div className='space-y-6'>
							{section.intro.map((paragraph, index) => (
								<p key={index} className={`${typography.scale.bodyLg} text-white/85`}>
									{paragraph}
								</p>
							))}
						</div>
					</ScrollReveal>

					{/* 親子友善 Demo：說明在上、兩張圖等高並排（貼紙 + 現場實景） */}
					<ScrollReveal delay={120}>
						<div className='mt-16'>
							<h3 className={`mb-4 ${typography.scale.cardTitle} text-primary`}>{section.demo.heading}</h3>
							<p className={`${typography.scale.body} text-white/80`}>{section.demo.description}</p>
							<div className='mt-8 flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-start'>
								<figure className='flex flex-col items-center'>
									<img src={section.demo.stickerSrc} alt={section.demo.stickerAlt} className='h-60 w-auto border border-white/10 sm:h-64' loading='lazy' />
									<figcaption className='mt-3 max-w-[16rem] text-center font-mono text-xs leading-5 text-white/50'>{section.demo.stickerAlt}</figcaption>
								</figure>
								<figure className='flex flex-col items-center'>
									<img src={section.demo.photoSrc} alt={section.demo.photoAlt} className='h-60 w-auto border border-white/10 sm:h-64' loading='lazy' />
									<figcaption className='mt-3 max-w-[16rem] text-center font-mono text-xs leading-5 text-white/50'>{section.demo.photoAlt}</figcaption>
								</figure>
							</div>
						</div>
					</ScrollReveal>

					{/* Future HCIer 小小勇者：文字 + 名牌圖 */}
					<ScrollReveal delay={140}>
						<div className='mt-16 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10'>
							<figure className='order-1 flex shrink-0 flex-col items-center sm:order-2'>
								<img src={section.hero.imageSrc} alt={section.hero.imageAlt} className='h-64 w-auto border border-white/10' loading='lazy' />
								<figcaption className='mt-3 text-center font-mono text-xs text-white/50'>{section.hero.caption}</figcaption>
							</figure>
							<div className='order-2 sm:order-1'>
								<h3 className={`mb-4 ${typography.scale.cardTitle} text-primary`}>{section.hero.heading}</h3>
								<p className={`${typography.scale.body} text-white/80`}>{section.hero.description}</p>
							</div>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={160}>
						<div className='mt-16 space-y-6'>
							{section.closing.map((paragraph, index) => (
								<p key={index} className={`${typography.scale.bodyLg} text-white/85`}>
									{paragraph}
								</p>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* Section 2 · 周邊地圖 */}
			<section id='nearby-map' className={SECTION_CLASS}>
				<div className={CONTAINER_CLASS}>
					<ScrollReveal>
						<SectionHeading kicker='Around the Venue' title={section.nearbyMap.heading} />
					</ScrollReveal>
					<ScrollReveal delay={80}>
						<p className={`${typography.scale.bodyLg} text-white/85`}>{section.nearbyMap.description}</p>
						<div className='mt-6 flex flex-wrap gap-2'>
							{section.nearbyMap.categories.map((category) => (
								<span
									key={category}
									className='border border-secondary/40 bg-secondary/10 px-3 py-1.5 font-mono text-sm font-medium text-secondary'
								>
									{category}
								</span>
							))}
						</div>
						<a
							href={section.nearbyMap.url}
							target='_blank'
							rel='noopener noreferrer'
							className='mt-8 inline-flex items-center gap-2 border border-primary bg-primary/10 px-5 py-3 font-mono text-base font-bold text-primary transition-colors hover:bg-primary/20'
						>
							<MapPin size={18} /> {section.nearbyMap.buttonText}
						</a>
					</ScrollReveal>
				</div>
			</section>

			{/* Section 3 · 三創親子友善設施 */}
			<section id='syntrend-facilities' className={SECTION_CLASS}>
				<div className={CONTAINER_CLASS}>
					<ScrollReveal>
						<SectionHeading kicker='Syntrend Facilities' title={section.facilitiesHeading} />
					</ScrollReveal>
					<ScrollReveal delay={80}>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							{section.facilities.map((facility) => {
								const Icon = FACILITY_ICONS[facility.icon as keyof typeof FACILITY_ICONS];
								return (
									<div key={facility.label} className='ds-surface-soft px-6 py-6'>
										<div className='mb-3 flex items-center gap-3'>
											<Icon size={22} className='text-primary' />
											<h4 className='font-mono text-lg font-bold text-white'>{facility.label}</h4>
										</div>
										<p className={`${typography.scale.body} text-white/80`}>{facility.floors}</p>
									</div>
								);
							})}
						</div>
						<a
							href={section.facilitiesSourceUrl}
							target='_blank'
							rel='noreferrer'
							className='mt-6 inline-block text-sm text-secondary transition-colors hover:text-primary hover:underline'
						>
							{section.facilitiesSourceLabel}
						</a>
					</ScrollReveal>
				</div>
			</section>

			{showBackToTop && (
				<button
					type='button'
					onClick={scrollToTop}
					aria-label={language === 'zh' ? '回到頂端' : 'Back to top'}
					className='fixed bottom-8 right-6 z-40 flex h-11 w-11 items-center justify-center border border-primary bg-black/70 text-primary backdrop-blur transition-colors hover:bg-primary/20'
				>
					<ArrowUp size={20} />
				</button>
			)}
		</div>
	);
};

export default FamilyFriendlyPage;
