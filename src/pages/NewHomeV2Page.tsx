import React from 'react';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /newhome-v2 — visual-chair's new arcade hero, variant A (standalone).
 * The new hero fills one screen; the shared content sections flow normally
 * below it (no BOOM transition). Companion to /newhome-v2-boom for the
 * visual chair to compare the two scroll treatments.
 */
const NewHomeV2Page: React.FC = () => {
	const { language } = useLanguage();
	useSEO(
		language === 'zh' ? '首頁（新街機版 · 單頁）' : 'Home (new arcade · standalone)',
		language === 'zh' ? 'TAICHI 2026 新街機主視覺預覽（單頁版）' : 'TAICHI 2026 new arcade main-visual preview (standalone)',
	);

	return (
		<>
			<NewArcadeHero />
			<HomeSections />
		</>
	);
};

export default NewHomeV2Page;
