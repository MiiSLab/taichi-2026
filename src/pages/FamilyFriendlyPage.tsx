import React from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const orbitItems = [
	{ src: '/images/ball01.svg', className: 'family-orbit__planet--one', alt: 'Orbit ball one', style: { '--orbit-angle': '0deg' } as React.CSSProperties },
	{ src: '/images/ball02.svg', className: 'family-orbit__planet--two', alt: 'Orbit ball two', style: { '--orbit-angle': '72deg' } as React.CSSProperties },
	{ src: '/images/ball03.svg', className: 'family-orbit__planet--three', alt: 'Orbit ball three', style: { '--orbit-angle': '144deg' } as React.CSSProperties },
	{ src: '/images/ball04.svg', className: 'family-orbit__planet--four', alt: 'Orbit ball four', style: { '--orbit-angle': '216deg' } as React.CSSProperties },
	{ src: '/images/ball05.svg', className: 'family-orbit__planet--five', alt: 'Orbit ball five', style: { '--orbit-angle': '288deg' } as React.CSSProperties },
] as const;

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
						<div className='family-orbit' aria-hidden='true'>
							<div className='family-orbit__stage'>
								{orbitItems.map((item) => (
									<div key={item.className} className='family-orbit__planet-anchor' style={item.style}>
										<img src={item.src} alt={item.alt} className={`family-orbit__planet ${item.className}`} />
									</div>
								))}
							</div>
						</div>
					</div>
				</ScrollReveal>
			</div>

			<section className='px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-24'>
				<div className='mx-auto max-w-7xl'>
					<ScrollReveal delay={80}>
						<div className='space-y-4 text-center'>
							{section.introLines.map((line) => (
								<p key={line} className={`${typography.scale.bodyLg} text-white`}>
									{line}
								</p>
							))}
						</div>
						<p className='mt-8 text-center font-pixel text-[15px] uppercase tracking-[0.14em] text-[#A8F020]'>
							{section.outroLine}
						</p>
					</ScrollReveal>
				</div>
			</section>
		</div>
	);
};

export default FamilyFriendlyPage;
