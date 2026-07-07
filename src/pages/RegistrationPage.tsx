import React from 'react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { useContent } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';
import { parseText } from '../utils/textFormatting';

const secondaryLinkClassName = (href: string) =>
	`${href.startsWith('mailto:') ? 'inline-block whitespace-nowrap break-normal' : 'min-w-0 break-words [overflow-wrap:anywhere]'} text-secondary transition-colors hover:text-primary hover:underline`;

type TicketTable = {
	title: string;
	tierNames: readonly string[];
	rows: readonly { label: string; values: readonly string[] }[];
};

const renderTierName = (tier: string) => {
	const [main, ...rest] = tier.split(' (');
	if (!rest.length) return tier;
	return (
		<>
			{main}
			<span className='mt-1 block text-xs font-normal normal-case tracking-normal text-white/60'>{`(${rest.join(' (')}`}</span>
		</>
	);
};

const PricingTable = ({ table }: { table: TicketTable }) => (
	<div className='ds-surface-panel overflow-x-auto'>
		<table className='w-full min-w-[420px] border-collapse text-left'>
			<thead>
				<tr className='border-b border-primary/40'>
					<th className='p-4 ds-section-kicker' />
					{table.tierNames.map((tier) => (
						<th key={tier} className='p-4 text-center font-dela text-[18px] leading-tight text-primary'>
							{renderTierName(tier)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{table.rows.map((row) => (
					<tr key={row.label} className='align-top border-b border-white/10'>
						<th scope='row' className={`whitespace-nowrap p-4 ${typography.scale.label} font-bold text-white`}>
							{row.label}
						</th>
						{row.values.map((value, ci) => (
							<td key={ci} className='p-4 text-center text-[13px] leading-5 text-white/80'>
								{value}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

const RegistrationPage: React.FC = () => {
	const content = useContent();
	const section = content.registrationSection;

	useSEO(section.seoTitle, section.seoDescription);

	return (
		<div className='min-h-screen w-full bg-[#0D0D11] text-white'>
			<div className='relative overflow-x-clip border-b border-white/10 px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.16),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(243,99,88,0.12),transparent_28%)]' />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`text-center ${typography.scale.pageTitle} ds-page-title relative z-10`}>{section.pageTitle}</h1>
				</ScrollReveal>
			</div>

			<section className='px-4 pb-20 pt-20 md:px-8 md:pb-28 md:pt-24'>
				<div className='mx-auto max-w-5xl'>
					<ScrollReveal delay={60}>
						<h2 className={`mb-8 ${typography.scale.sectionTitle} text-primary`}>{section.pricingHeading}</h2>
					</ScrollReveal>

					<ScrollReveal delay={100}>
						<div className='space-y-10'>
							<div>
								<h3 className={`mb-3 ${typography.scale.cardTitle} text-white`}>{section.apmarTicket.title}</h3>
								<PricingTable table={section.apmarTicket} />
							</div>
							<div>
								<h3 className={`mb-3 ${typography.scale.cardTitle} text-white`}>{section.taichiTicket.title}</h3>
								<PricingTable table={section.taichiTicket} />
							</div>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={150}>
						<div className='mx-auto mt-10 max-w-3xl space-y-4'>
							<p className={`${typography.scale.body} text-white/80`}>{section.paperRegistrationNote}</p>
							<p className={`${typography.scale.body} text-white/90`}>{parseText(section.membershipNote, secondaryLinkClassName)}</p>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={200}>
						<h2 className={`mb-8 mt-16 ${typography.scale.sectionTitle} text-primary`}>{section.methodsHeading}</h2>
					</ScrollReveal>

					<ScrollReveal delay={240}>
						<div className='ds-surface-panel px-6 py-8 md:px-10 md:py-10'>
							<h3 className={`mb-5 ${typography.scale.cardTitle} text-white`}>{section.kktixHeading}</h3>
							{section.kktixUrl === '#' ? (
								<span className='ds-button-submit pointer-events-none cursor-not-allowed px-8 text-[18px] leading-[28px] opacity-40 grayscale'>
									<span>{section.kktixComingSoonLabel}</span>
								</span>
							) : (
								<a href={section.kktixUrl} className='ds-button-submit px-8 text-[18px] leading-[28px]'>
									<span>{section.kktixButtonLabel}</span>
									<span className='text-[24px] leading-none'>→</span>
								</a>
							)}
						</div>
					</ScrollReveal>

					<ScrollReveal delay={280}>
						<div className='ds-surface-panel mt-6 px-6 py-8 md:px-10 md:py-10'>
							<h3 className={`mb-5 ${typography.scale.cardTitle} text-white`}>{section.manualHeading}</h3>

							<p className={`mb-5 ${typography.scale.body} text-white/80`}>{parseText(section.manualIntro, secondaryLinkClassName)}</p>

							<div className='space-y-6'>
								<div>
									<p className={`mb-3 ${typography.scale.body} font-bold text-white`}>{section.transferStepHeading}</p>
									<div className='space-y-1 rounded-[10px] border-l-4 border-primary bg-black/40 px-6 py-5'>
										{section.bankDetails.map((line) => (
											<p key={line} className={`${typography.scale.body} text-white/80`}>
												{line}
											</p>
										))}
									</div>
								</div>

								<div>
									<p className={`mb-3 ${typography.scale.body} font-bold text-white`}>{section.formStepHeading}</p>
									<a
										href={section.formUrl}
										target='_blank'
										rel='noreferrer'
										className='ds-button-secondary min-h-[46px] px-8 text-[16px]'
									>
										{section.formButtonLabel} →
									</a>
								</div>

								<p className={`${typography.scale.body} text-white/80`}>{parseText(section.emailStepText, secondaryLinkClassName)}</p>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>
		</div>
	);
};

export default RegistrationPage;
