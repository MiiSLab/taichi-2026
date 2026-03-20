import { Facebook } from 'lucide-react';
import React from 'react';
import { CONTENT } from '../../content';

const Footer: React.FC = () => {
	return (
		<footer className='bg-lab-lime text-lab-black py-12 px-12 border-t border-black'>
			<div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 font-mono text-xs'>
				<div>
					<div className='font-pixel text-2xl leading-tight mb-4 whitespace-pre-line text-left'>{CONTENT.footer.title}</div>
					<p className='text-black'>{CONTENT.footer.copyright}</p>
				</div>
				<div className='text-right'>
					<p className='text-black mb-2'>{CONTENT.footer.credits}</p>
					<p>{CONTENT.contact.email}</p>
					{CONTENT.footer.facebook && (
						<div className='flex items-center justify-end gap-3 mt-4'>
							<span className='text-black font-pixel uppercase tracking-wider'>{CONTENT.footer.socialsTitle}</span>
							<a
								href={CONTENT.footer.facebook}
								target='_blank'
								rel='noopener noreferrer'
								className='hover:text-lab-pink transition-colors'
							>
								<Facebook size={20} />
							</a>
						</div>
					)}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
