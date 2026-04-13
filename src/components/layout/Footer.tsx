import { Facebook } from 'lucide-react';
import React from 'react';
import { useContent } from '../../context/LanguageContext';

const Footer: React.FC = () => {
	const content = useContent();

	return (
		<footer className='ds-footer-shell px-6 py-8 sm:px-8 sm:py-10 md:px-[140px] md:py-[56px]'>
			<div className='mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-end md:gap-12'>
				<div className='flex flex-col items-start gap-3 md:min-h-[92px] md:justify-between'>
					<div className='ds-divider-brand mb-4 border-b pb-4'>
						<p className='ds-section-kicker'>TAICHI 2026</p>
					</div>
					<div className='ds-footer-brand text-left'>
						<p>BIG BANG! FUTURES!</p>
					</div>
					<p className='ds-footer-meta'>COPYRIGHT © 2026 TAICHI</p>
				</div>

				<div className='flex flex-col items-end gap-3 text-right md:min-h-[92px] md:justify-end'>
					<a
						href={`mailto:${content.contact.email}`}
						className='ds-footer-link'
					>
						{content.contact.email}
					</a>
					{content.footer.facebook && (
						<div className='flex items-center justify-end gap-[10px]'>
							<span className='ds-footer-social-label'>FOLLOW US</span>
							<a
								href={content.footer.facebook}
								target='_blank'
								rel='noopener noreferrer'
								aria-label='Facebook'
								className='ds-footer-link inline-flex items-center transition-transform hover:-translate-y-0.5'
							>
								<Facebook size={18} strokeWidth={2.2} />
							</a>
						</div>
					)}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
