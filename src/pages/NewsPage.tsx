import React from 'react';
import AnnouncementsSection from '../components/AnnouncementsSection';
import { useContent } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /news — the same announcements feed shown on the homepage
 * (AnnouncementsSection, static NEWS), but without the 3-item cap.
 */
const NewsPage: React.FC = () => {
	const content = useContent();
	useSEO(content.newsSection.title, content.newsSection.subtitle);

	return (
		<div className='min-h-screen w-full bg-black text-white'>
			<AnnouncementsSection limit={0} />
		</div>
	);
};

export default NewsPage;
