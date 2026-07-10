import React from 'react';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * Homepage — the visual-chair arcade hero (BIG BANG! FUTURES!) rendered as a
 * normal, plainly-scrollable block above the shared content sections.
 *
 * This used to sit inside a scroll-hijacking shell (ArcadeHeroScroll) that
 * auto-snapped the page via window.scrollTo and blocked wheel/touch/key input
 * during the transition. That mechanism proved too fragile — it could end up
 * fighting the browser's native scroll and get stuck, blocking navigation
 * entirely. The scroll-driven version is preserved at /lab/arcade-hero-scroll
 * for further tuning; the live homepage stays on this plain, reliable layout.
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
			<NewArcadeHero />
			<HomeSections />
		</>
	);
};

export default HomePage;
