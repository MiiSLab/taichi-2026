import { Accessibility, Baby, Droplets, Milk, Toilet } from 'lucide-react';
import React from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const FACILITY_ICONS = {
	toilet: Toilet,
	baby: Baby,
	milk: Milk,
	accessibility: Accessibility,
	droplets: Droplets,
} as const;

const FamilyFriendlyPage: React.FC = () => {
	const content = useContent();
	const section = content.familyFriendlySection;

	useSEO(section.seoTitle, section.seoDescription);

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			<div className='relative w-full overflow-hidden px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>
						Family-<br />Friendly
					</h1>
				</ScrollReveal>
			</div>

			<section className='px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16'>
				<div className='mx-auto max-w-7xl'>
					<ScrollReveal delay={60}>
						<h2 className={`mb-10 ${typography.scale.sectionTitle} text-primary`}>
							{section.headline}
						</h2>
					</ScrollReveal>

					<ScrollReveal delay={120}>
						<article className='max-w-3xl space-y-6'>
							{section.paragraphs.map((p, i) => (
								<p key={i} className={`${typography.scale.bodyLg} text-white/90`}>
									{p}
								</p>
							))}
						</article>
					</ScrollReveal>

					<ScrollReveal delay={150}>
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

					<ScrollReveal delay={200}>
						<div className='mt-16'>
							<h3 className={`mb-6 ${typography.scale.cardTitle} text-white`}>{section.facilitiesHeading}</h3>
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
								className='mt-4 inline-block text-sm text-secondary transition-colors hover:text-primary hover:underline'
							>
								{section.facilitiesSourceLabel}
							</a>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={260}>
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
