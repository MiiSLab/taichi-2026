import React from 'react';
import ArcadeHeroScroll from '../components/home/ArcadeHeroScroll';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /newhome-v2-boom — visual-chair's new arcade hero, variant B (BOOM transition).
 * The new hero is embedded in the existing ArcadeHeroScroll shell: it auto-snaps
 * on scroll and collapses (BOOM circle) into the shared content sections, which
 * are pulled up by margin-top: -100vh. Companion to /newhome-v2 (standalone).
 */
const NewHomeV2BoomPage: React.FC = () => {
	const { language } = useLanguage();
	useSEO(
		language === 'zh' ? '首頁（新街機版 · BOOM 轉場）' : 'Home (new arcade · BOOM)',
		language === 'zh' ? 'TAICHI 2026 新街機主視覺預覽（BOOM 轉場版）' : 'TAICHI 2026 new arcade main-visual preview (BOOM transition)',
	);

	return (
		<>
			<ArcadeHeroScroll variant='boom'>
				<NewArcadeHero />
			</ArcadeHeroScroll>
			<div className='w-full' style={{ marginTop: '-100vh' }}>
				<HomeSections />
			</div>
		</>
	);
};

export default NewHomeV2BoomPage;
