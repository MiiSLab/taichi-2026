import React from 'react';
import ArcadeHeroScroll from '../components/home/ArcadeHeroScroll';
import HomeSections from '../components/home/HomeSections';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * /newhome — hidden test route for the new "arcade terminal" main visual.
 * The interactive arcade hero (BIG BANG! FUTURES!) auto-snaps and collapses
 * (BOOM circle transition) into the shared content sections on scroll.
 * Not linked in the navbar; the real homepage ('/') is unaffected.
 */
const NewHomePage: React.FC = () => {
	const { language } = useLanguage();
	useSEO(
		language === 'zh' ? '首頁（街機版預覽）' : 'Home (arcade preview)',
		language === 'zh' ? 'TAICHI 2026 新首頁街機主視覺預覽' : 'TAICHI 2026 new arcade main-visual preview',
	);

	return (
		<>
			<ArcadeHeroScroll variant='boom' />
			<div className='w-full' style={{ marginTop: '-100vh' }}>
				<HomeSections />
			</div>
		</>
	);
};

export default NewHomePage;
