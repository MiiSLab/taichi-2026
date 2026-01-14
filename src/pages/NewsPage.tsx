import React from 'react';
import NewsSection from '../components/NewsSection';
import { CONTENT } from '../content';

const NewsPage: React.FC = () => {
	return (
		<section className='pt-32 pb-24 px-6 md:px-20 bg-gray-50 min-h-screen'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex flex-col items-center justify-center mb-16'>
					<h2 className='text-5xl md:text-7xl font-pixel text-lab-dark mb-4 text-center'>{CONTENT.newsSection.title}</h2>
				</div>
				<NewsSection hideHeader unwrap />
			</div>
		</section>
	);
};

export default NewsPage;
