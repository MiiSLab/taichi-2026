import React from 'react';
import AnnouncementsSection from '../components/AnnouncementsSection';
import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /news — simple page-title hero (like /organization) over the same announcements
 * feed shown on the homepage (AnnouncementsSection, static NEWS).
 */
const NewsPage: React.FC = () => {
	const content = useContent();
	const { language } = useLanguage();
	useSEO(language === 'zh' ? '最新消息' : 'News', content.newsSection.subtitle);

	return (
		<div className='min-h-screen w-full bg-black text-white'>
			<div className='relative w-full overflow-hidden px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`ds-page-title mb-6 text-center ${typography.scale.pageTitle}`}>{content.newsSection.title}</h1>
				</ScrollReveal>
			</div>

			<AnnouncementsSection hideHeader limit={0} />
		</div>
	);
};

export default NewsPage;
