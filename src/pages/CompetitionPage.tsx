import React from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const CompetitionPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();

	useSEO(
		language === 'zh' ? '競賽' : 'Competition',
		language === 'zh' ? 'TAICHI 2026 精彩競賽即將登場。' : 'TAICHI 2026 competition program is coming soon.',
	);

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			<div className='relative overflow-hidden border-b border-white/10 px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(118,215,255,0.14),transparent_26%)]' />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>
					<h1 className={`text-center ${typography.scale.pageTitle} text-primary drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]`}>
						{content.competitionSection.title}
					</h1>
					<div className='inline-flex items-center gap-3 border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary'>
						{content.competitionSection.badge}
					</div>
					<p className={`max-w-3xl text-center ${typography.scale.bodyLg} text-white/72`}>
						{content.competitionSection.description}
					</p>
				</ScrollReveal>
			</div>

			<section className='px-4 pb-8 pt-20 md:px-8 md:pb-12 md:pt-24'>
				<div className='mx-auto max-w-[1280px]'>
					<ScrollReveal delay={90}>
						<div className='ds-surface-panel px-6 py-12 text-center md:px-16 md:py-16'>
							<div className='mx-auto flex max-w-4xl flex-col items-center gap-8 md:gap-10'>
								<h2 className='ds-section-title text-[28px] leading-[1.35] md:text-[30px]'>
									{content.competitionSection.highlightTitle}
								</h2>
								<p className={`max-w-4xl ${typography.scale.body} text-white/85`}>
									{content.competitionSection.description}
								</p>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>

		</div>
	);
};

export default CompetitionPage;
