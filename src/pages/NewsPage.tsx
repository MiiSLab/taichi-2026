import React from 'react';
import AnnouncementsSection from '../components/AnnouncementsSection';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /news — standard page-title hero (like the other inner pages) over the same
 * announcements feed shown on the homepage (AnnouncementsSection, static NEWS).
 */
const NewsPage: React.FC = () => {
	const content = useContent();
	useSEO(content.newsSection.title, content.newsSection.subtitle);

	return (
		<div className='min-h-screen w-full bg-black text-white'>
			<div className='relative overflow-x-clip border-b border-white/10 px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,65,5,0.16),transparent_38%)]' />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`text-center ${typography.scale.pageTitle} ds-page-title relative z-10`}>{content.newsSection.title}</h1>
				</ScrollReveal>
			</div>

			<AnnouncementsSection hideHeader limit={0} />
		</div>
	);
};

export default NewsPage;
