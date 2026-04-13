import React from 'react';
import NewsSection from '../components/NewsSection';
import ScrollReveal from '../components/ScrollReveal';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';

const NewsPage: React.FC = () => {
	const content = useContent();

	return (
		<section className='relative w-full bg-black text-white min-h-screen'>
			<div className='relative flex w-full flex-col items-center overflow-hidden bg-black px-6 pt-48 pb-24 md:px-20'>
				<ScrollReveal className='relative z-10 flex w-full max-w-7xl flex-col items-center'>
					<h1 className={`mb-4 text-center ${typography.scale.pageTitle} text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] md:mb-6`}>
						{content.newsSection.title}
					</h1>
				</ScrollReveal>
			</div>
			<div className='mx-auto max-w-7xl px-6 pb-24 md:px-20'>
				<ScrollReveal delay={80}>
					<NewsSection hideHeader unwrap />
				</ScrollReveal>
			</div>
		</section>
	);
};

export default NewsPage;
