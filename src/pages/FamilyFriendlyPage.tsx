import React from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const FamilyFriendlyPage: React.FC = () => {
	const content = useContent();
	const section = content.familyFriendlySection;

	useSEO(section.seoTitle, section.seoDescription);

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			<div className='relative overflow-x-clip border-b border-white/10 px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.16),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(243,99,88,0.12),transparent_28%)]' />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<div className='family-orbit-hero'>
						<h1 className={`text-center ${typography.scale.pageTitle} ds-page-title relative z-10`}>
							Family-<br />Friendly
						</h1>
					</div>
				</ScrollReveal>
			</div>

			<section className='px-4 pb-20 pt-20 md:px-8 md:pb-28 md:pt-24'>
				<div className='mx-auto max-w-3xl'>
					<ScrollReveal delay={60}>
						<h2 className={`mb-10 ${typography.scale.sectionTitle} text-[#CCFF00]`}>
							{section.headline}
						</h2>
					</ScrollReveal>

					<ScrollReveal delay={120}>
						<article className='space-y-6'>
							{section.paragraphs.map((p, i) => (
								<p key={i} className={`${typography.scale.bodyLg} text-white/90`}>
									{p}
								</p>
							))}
						</article>
					</ScrollReveal>

					<ScrollReveal delay={180}>
						<div className='ds-surface-panel mt-16 px-6 py-10 md:px-12 md:py-12'>
							<h3 className={`mb-3 ${typography.scale.cardTitle} text-white`}>
								{section.surveyHeading}
							</h3>
							<p className={`mb-8 ${typography.scale.body} text-white/75`}>
								{section.surveyDescription}
							</p>
							<a
								href={section.surveyUrl}
								target='_blank'
								rel='noreferrer'
								className='ds-button-secondary min-h-[46px] px-8 text-[18px] leading-[28px]'
							>
								{section.surveyButtonText} →
							</a>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={240}>
						<p className='mt-12 text-center font-pixel text-[15px] uppercase tracking-[0.14em] text-primary'>
							{section.outroLine}
						</p>
					</ScrollReveal>
				</div>
			</section>
		</div>
	);
};

export default FamilyFriendlyPage;
