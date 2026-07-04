import React from 'react';
import ArcadeHeroScroll from '../components/home/ArcadeHeroScroll';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * Homepage — the visual-chair arcade hero (BIG BANG! FUTURES!) inside the BOOM
 * scroll shell: it auto-snaps on scroll and collapses (circle transition) into
 * the shared content sections, which are pulled up by margin-top: -100vh.
 */
const HomePage: React.FC = () => {
	const { language } = useLanguage();
	useSEO(
		language === 'zh' ? '首頁' : 'Home',
		language === 'zh'
			? 'TAICHI 2026 台灣人機互動研討會。主題：Big Bang! Futures!'
			: 'TAICHI 2026 conference website. Theme: Big Bang! Futures!',
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

export default HomePage;
