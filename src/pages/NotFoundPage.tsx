import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { typography } from '../design-system/typography';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const COPY = {
	zh: {
		eyebrow: 'ERROR // 404',
		signal: 'SIGNAL LOST',
		title: '頁面消失在宇宙裡',
		description: '你嘗試造訪的頁面不存在，或是已經被移到別的星系。回到首頁繼續探索 Big Bang Future。',
		path: '無效路徑',
		homeAction: '返回首頁',
		backAction: '回上一頁',
	},
	en: {
		eyebrow: 'ERROR // 404',
		signal: 'SIGNAL LOST',
		title: 'This page drifted off into the void',
		description:
			'The page you tried to reach does not exist, or has been moved to another galaxy. Head back to the homepage and keep exploring Big Bang Future.',
		path: 'Invalid path',
		homeAction: 'Back to Home',
		backAction: 'Go Back',
	},
} as const;

const NotFoundPage: React.FC = () => {
	const { language } = useLanguage();
	const location = useLocation();
	const navigate = useNavigate();
	const copy = COPY[language];

	useSEO(language === 'zh' ? '找不到頁面' : 'Page Not Found', copy.description);

	return (
		<section className='not-found-page' aria-labelledby='not-found-heading'>
			<div className='not-found-page__scanlines' aria-hidden='true' />
			<div className='not-found-page__vignette' aria-hidden='true' />

			<div className='not-found-page__inner'>
				<p className={`${typography.scale.sectionEyebrow} not-found-page__eyebrow`}>{copy.eyebrow}</p>

				<h1 id='not-found-heading' className='not-found-page__code' aria-label='404'>
					<span className='not-found-page__digit not-found-page__digit--a' data-text='4'>4</span>
					<span className='not-found-page__digit not-found-page__digit--b' data-text='0'>0</span>
					<span className='not-found-page__digit not-found-page__digit--c' data-text='4'>4</span>
				</h1>

				<p className={`${typography.scale.sectionEyebrow} not-found-page__signal`}>{copy.signal}</p>

				<h2 className={`${typography.scale.sectionTitle} not-found-page__title`}>{copy.title}</h2>

				<p className={`${typography.scale.body} not-found-page__description`}>{copy.description}</p>

				<p className='not-found-page__path' aria-label={copy.path}>
					<span className='not-found-page__path-label'>{copy.path}:</span>
					<span className='not-found-page__path-value'>{location.pathname}</span>
				</p>

				<div className='not-found-page__actions'>
					<Link to='/' className={`ds-button-submit not-found-page__primary ${typography.scale.buttonLabel}`}>
						<span>{copy.homeAction}</span>
						<span aria-hidden='true' className='not-found-page__arrow'>→</span>
					</Link>
					<button
						type='button'
						onClick={() => navigate(-1)}
						className={`not-found-page__secondary ${typography.scale.sectionEyebrow}`}
					>
						← {copy.backAction}
					</button>
				</div>
			</div>
		</section>
	);
};

export default NotFoundPage;
