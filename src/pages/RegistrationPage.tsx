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
	typeHeader: string;
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
	<div className='ds-surface-panel mx-auto max-w-md overflow-x-auto'>
		<table className='w-full border-collapse text-center'>
			<thead>
				<tr className='border-b border-primary/40'>
					<th className='px-6 py-5 text-center font-dela text-[20px] leading-tight text-primary'>{table.typeHeader}</th>
					{table.tierNames.map((tier) => (
						<th key={tier} className='px-6 py-5 text-center font-dela text-[20px] leading-tight text-primary'>
							{renderTierName(tier)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{table.rows.map((row) => (
					<tr key={row.label} className='border-b border-white/10 last:border-b-0'>
						<th scope='row' className='px-6 py-5 text-center align-middle text-[18px] font-bold text-white'>
							{row.label}
						</th>
						{row.values.map((value, ci) => (
							<td key={ci} className='px-6 py-5 text-center align-middle text-[22px] font-bold text-primary'>
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
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`text-center ${typography.scale.pageTitle} ds-page-title relative z-10`}>{section.pageTitle}</h1>
				</ScrollReveal>
			</div>

			<section className='px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16'>
				<div className='mx-auto max-w-7xl'>
					<ScrollReveal delay={60}>
						<h2 className={`mb-8 ${typography.scale.sectionTitle} text-primary`}>{section.pricingHeading}</h2>
					</ScrollReveal>

					<ScrollReveal delay={100}>
						<PricingTable table={section.pricingTable} />
						<p className='mt-3 text-center text-sm text-white/50'>{section.pricingDeadlineNote}</p>
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

					<ScrollReveal delay={60}>
						<h2 className={`mb-8 mt-24 ${typography.scale.sectionTitle} text-primary`}>{section.apmarPricingHeading}</h2>
					</ScrollReveal>

					<ScrollReveal delay={100}>
						<p className={`mx-auto mb-8 max-w-3xl ${typography.scale.body} text-white/80`}>{section.apmarIntro}</p>
						<PricingTable table={section.apmarPricingTable} />
						<p className='mt-3 text-center text-sm text-white/50'>{section.apmarPricingDeadlineNote}</p>
					</ScrollReveal>

					<ScrollReveal delay={200}>
						<h2 className={`mb-8 mt-16 ${typography.scale.sectionTitle} text-primary`}>{section.apmarMethodsHeading}</h2>
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
										href={section.apmarFormUrl}
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
