import React from 'react';
import { Link } from 'react-router-dom';
import { typography } from '../design-system/typography';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * 活動結束後掛在 /q（通行證查詢）與 /vote（投票）兩個 route 的收站頁。
 * 原功能程式碼保留於 src/pages/QPage.tsx、src/pages/VotePage.tsx 供交接，
 * 重新啟用方式見 HANDOVER.md。舊的通行證 QR / email 連結（/q?t=...）會落在
 * 此頁，query 參數直接忽略。
 */

const COPY = {
	zh: {
		eyebrow: 'TAICHI 2026 // 08.05 - 08.06',
		signal: 'SEE YOU NEXT TIME',
		title: 'TAICHI 2026 已圓滿落幕',
		description:
			'感謝所有講者、作者、志工與參與者的熱情投入！數位通行證查詢與海報/展示投票功能已隨活動結束關閉。各獎項得主請見得獎名單頁面。',
		awardsAction: '查看得獎名單',
		homeAction: '返回首頁',
	},
	en: {
		eyebrow: 'TAICHI 2026 // 08.05 - 08.06',
		signal: 'SEE YOU NEXT TIME',
		title: 'TAICHI 2026 has come to a close',
		description:
			'Thank you to every speaker, author, volunteer, and attendee! The digital pass lookup and poster/demo voting closed when the conference ended. Check out the winners on the awards page.',
		awardsAction: 'Award Winners',
		homeAction: 'Back to Home',
	},
} as const;

const EventEndedPage: React.FC = () => {
	const { language } = useLanguage();
	const copy = COPY[language];

	useSEO(language === 'zh' ? '活動已結束' : 'Event Ended', copy.description);

	return (
		<section className='not-found-page' aria-labelledby='event-ended-heading'>
			<div className='not-found-page__scanlines' aria-hidden='true' />
			<div className='not-found-page__vignette' aria-hidden='true' />

			<div className='not-found-page__inner'>
				<p className={`${typography.scale.sectionEyebrow} not-found-page__eyebrow`}>{copy.eyebrow}</p>

				<h1 id='event-ended-heading' className='not-found-page__code' aria-label='END'>
					<span className='not-found-page__digit not-found-page__digit--a' data-text='E'>E</span>
					<span className='not-found-page__digit not-found-page__digit--b' data-text='N'>N</span>
					<span className='not-found-page__digit not-found-page__digit--c' data-text='D'>D</span>
				</h1>

				<p className={`${typography.scale.sectionEyebrow} not-found-page__signal`}>{copy.signal}</p>

				<h2 className={`${typography.scale.sectionTitle} not-found-page__title`}>{copy.title}</h2>

				<p className={`${typography.scale.body} not-found-page__description`}>{copy.description}</p>

				<div className='not-found-page__actions'>
					<Link to='/awards' className={`ds-button-submit not-found-page__primary ${typography.scale.buttonLabel}`}>
						<span>{copy.awardsAction}</span>
						<span aria-hidden='true' className='not-found-page__arrow'>→</span>
					</Link>
					<Link to='/' className={`not-found-page__secondary ${typography.scale.sectionEyebrow}`}>
						← {copy.homeAction}
					</Link>
				</div>
			</div>
		</section>
	);
};

export default EventEndedPage;
