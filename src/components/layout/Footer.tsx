import { Facebook } from 'lucide-react';
import React from 'react';
import { CONTENT } from '../../content';

const Footer: React.FC = () => {
	return (
		<footer className='bg-lab-dark text-white py-12 px-6 border-t border-gray-800'>
			<div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 font-mono text-xs'>
				<div>
					<pre className='font-pixel text-2xl leading-none mb-4'>{CONTENT.footer.title}</pre>
					<p className='text-gray-500'>{CONTENT.footer.copyright}</p>
				</div>
				<div className='text-right'>
					<p className='text-gray-400 mb-2'>{CONTENT.footer.credits}</p>
					<p>{CONTENT.contact.email}</p>
					{CONTENT.footer.facebook && (
						<div className='flex items-center justify-end gap-3 mt-4'>
							<span className='text-gray-500 font-pixel text-[10px] uppercase tracking-wider'>
								{CONTENT.footer.socialsTitle}
							</span>
							<a
								href={CONTENT.footer.facebook}
								target='_blank'
								rel='noopener noreferrer'
								className='hover:text-lab-orange transition-colors'
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
