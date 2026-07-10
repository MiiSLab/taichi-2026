import React from 'react';
import ArcadeHeroScroll from '../components/home/ArcadeHeroScroll';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useSEO } from '../hooks/useSEO';

/**
 * Experiment page for tuning the arcade hero's scroll-driven transition
 * (auto-snap + BOOM circle-collapse) away from the live homepage, which now
 * uses a plain, non-scroll-hijacked layout instead. See HomePage.tsx for why.
 */
const HeroLabPage: React.FC = () => {
	useSEO('Hero Lab', 'Experiment page for the arcade hero scroll transition.');

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

export default HeroLabPage;
