import React from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { useContent } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';

// Highlight ✓ (lime) and — (muted) wherever they appear, even alongside text
// such as "✓（30 sec）".
const highlightMarkers = (text: string) =>
	text.split(/(✓|—)/).map((token, i) => {
		if (token === '✓') return <span key={i} className='text-[#A8F020]'>✓</span>;
		if (token === '—') return <span key={i} className='text-white/25'>—</span>;
		return <React.Fragment key={i}>{token}</React.Fragment>;
	});

// Split "／"-separated values onto stacked lines, with markers highlighted.
const renderTierValue = (value: string) =>
	value.split('／').map((part, i) => (
		<React.Fragment key={i}>
			{i > 0 && <br />}
			{highlightMarkers(part)}
		</React.Fragment>
	));

const SponsorshipPage: React.FC = () => {
	const content = useContent();
	const section = content.sponsorshipSection;

	useSEO(section.seoTitle, section.seoDescription);

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			<div className='relative px-6 pt-48 pb-16 border-b overflow-x-clip border-white/10 md:px-20'>
				<WarpBackground />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.16),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(243,99,88,0.12),transparent_28%)]' />
				<ScrollReveal className='relative z-10 flex flex-col items-center w-full mx-auto max-w-7xl'>
					<h1 className={`text-center ${typography.scale.pageTitle} ds-page-title relative z-10`}>{section.pageTitle}</h1>
				</ScrollReveal>
			</div>

			<section className='px-4 pt-20 pb-20 md:px-8 md:pb-28 md:pt-24'>
				<div className='max-w-5xl mx-auto'>
					{/* Intro — kept at a comfortable reading width */}
					<div className='max-w-3xl mx-auto'>
						<ScrollReveal delay={60}>
							<h2 className={`mb-10 ${typography.scale.sectionTitle} text-[#CCFF00]`}>{section.headline}</h2>
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
					</div>

					{/* Sponsorship plans comparison table */}
					<ScrollReveal delay={220}>
						<div className='mt-12'>
							<h3 className={`mb-3 ${typography.scale.sectionTitle} text-[#A8F020]`}>{section.plansTitle}</h3>
							<p className={`mb-6 max-w-3xl ${typography.scale.body} text-white/75`}>{section.plansIntro}</p>
							<div className='overflow-x-auto ds-surface-panel'>
								<table className='w-full min-w-[680px] border-collapse text-left'>
									<thead>
										<tr className='border-b border-[#A8F020]/40'>
											<th className='p-4 ds-section-kicker' />
											{section.tierNames.map((tier) => (
												<th
													key={tier}
													className='p-4 text-center font-dela text-[18px] leading-tight text-[#A8F020]'
												>
													{tier}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{section.planRows.map((row) => (
											<tr key={row.label} className='align-top border-b border-white/10'>
												<th
													scope='row'
													className={`whitespace-nowrap p-4 ${typography.scale.label} font-bold text-white`}
												>
													{row.label}
												</th>
												{row.values.map((value, ci) => (
													<td key={ci} className='p-4 text-center text-[13px] leading-5 text-white/80'>
														{renderTierValue(value)}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</ScrollReveal>

					{/* Sponsorship process */}
					<ScrollReveal delay={340}>
						<div className='mt-12'>
							<h3 className={`mb-6 ${typography.scale.sectionTitle} text-[#A8F020]`}>{section.processTitle}</h3>
							<div className='space-y-4'>
								{section.processSteps.map((step, i) => (
									<div key={i} className='px-6 py-6 ds-surface-panel md:px-8'>
										<h4 className='mb-3 font-roboto text-[18px] font-bold text-[#A8F020]'>{step.title}</h4>
										<div className='space-y-1.5'>
											{step.body.map((line, li) => (
												<p key={li} className={`${typography.scale.body} text-white/80 [overflow-wrap:anywhere]`}>
													{line}
												</p>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</ScrollReveal>

					{/* Notes */}
					<ScrollReveal delay={260}>
						<div className='px-6 py-8 mt-10 ds-surface-panel md:px-12 md:py-10'>
							<h3 className='mb-4 ds-section-kicker'>{section.plansNoteTitle}</h3>
							<ul className='space-y-2.5'>
								{section.plansNotes.map((note, i) => (
									<li key={i} className={`flex items-start gap-3 ${typography.scale.body} text-white/80`}>
										<span className='mt-[2px] font-bold text-[#A8F020]'>•</span>
										<span>{note}</span>
									</li>
								))}
							</ul>
						</div>
					</ScrollReveal>

					{/* Download full prospectus */}
					<ScrollReveal delay={300}>
						<div className='px-6 py-10 mt-10 ds-surface-panel md:px-12 md:py-12'>
							<h3 className={`mb-3 ${typography.scale.cardTitle} text-white`}>{section.pdfHeading}</h3>
							<p className={`mb-8 ${typography.scale.body} text-white/75`}>{section.pdfDescription}</p>
							<a
								href={section.pdfUrl}
								target='_blank'
								rel='noreferrer'
								download
								className='ds-button-submit px-8 text-[18px] leading-[28px]'
							>
								<span>{section.pdfButtonText}</span>
								<span className='text-[24px] leading-none'>↓</span>
							</a>
						</div>
					</ScrollReveal>

					{/* General inquiry */}
					<ScrollReveal delay={380}>
						<div className='mt-12 text-center'>
							<h3 className='mb-2 ds-section-kicker'>{section.contactHeading}</h3>
							<p className={`${typography.scale.body} text-white/75`}>{section.contactText}</p>
							<a
								href={`mailto:${section.contactEmail}`}
								className='mt-2 inline-block font-mono text-[18px] font-bold text-[#A8F020] transition-colors hover:text-white hover:underline'
							>
								{section.contactEmail}
							</a>
						</div>
					</ScrollReveal>
				</div>
			</section>
		</div>
	);
};

export default SponsorshipPage;
