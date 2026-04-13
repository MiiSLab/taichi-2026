import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import NewsDetail from './NewsDetail';
import Skeleton from './Skeleton';

interface NewsSectionProps {
	limit?: number;
	hideHeader?: boolean;
	unwrap?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({ limit, hideHeader, unwrap }) => {
	const { news, isSyncing } = useData();
	const content = useContent();
	const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

	const visibleNews = limit ? news.slice(0, limit) : news;

	const handleOpenNews = (item: NewsItem) => {
		setSelectedNews(item);
	};

	const innerContent = (
		<div className={unwrap ? '' : 'max-w-7xl mx-auto'}>
			{!hideHeader && (
				<div className='flex justify-between items-end mb-16'>
					<h2 className={`${typography.fontFamily.display} text-5xl text-lab-dark`}>{content.newsSection.title}</h2>
					{limit && news.length > limit && (
						<Link to='/news' className='text-lab-orange font-bold hover:underline'>
							{content.newsSection.viewAll}
						</Link>
					)}
				</div>
			)}

			{isSyncing && news.length === 0 ? (
				<Skeleton variant='news' count={limit || 3} />
			) : (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
					{visibleNews.map((item) => (
						<div
							key={item.id}
							className='group bg-white border border-gray-200 hover:border-lab-orange transition-all cursor-pointer hover:shadow-lg'
							onClick={() => handleOpenNews(item)}
						>
							<div className='relative aspect-[3/2] overflow-hidden bg-gray-100'>
								<img
									src={item.image}
									alt={item.title}
									className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
								/>
								{item.subtitle && (
									<span className='absolute bottom-0 left-0 bg-lab-dark/80 text-white font-mono text-xs px-2 py-1 w-full truncate'>
										{item.subtitle}
									</span>
								)}
							</div>
							<div className='p-6'>
								{(item.createdTime || item.date) && (
									<div className='font-mono text-xs text-gray-500 mb-2'>{item.createdTime || item.date}</div>
								)}
								<h3 className={`${typography.fontFamily.display} mb-4 text-2xl leading-none group-hover:text-lab-orange`}>{item.title}</h3>
								<p className='font-sans text-sm text-gray-600 line-clamp-2'>{item.content}</p>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedNews && <NewsDetail item={selectedNews} onClose={() => setSelectedNews(null)} />}
		</div>
	);

	if (unwrap) return innerContent;

	return <section className='py-24 px-6 md:px-20 bg-gray-50 border-t border-gray-200'>{innerContent}</section>;
};

export default NewsSection;
