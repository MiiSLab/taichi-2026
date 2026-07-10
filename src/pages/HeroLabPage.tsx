import React from 'react';
import ArcadeHeroScroll from '../components/home/ArcadeHeroScroll';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useSEO } from '../hooks/useSEO';

/**
 * Mirrors HomePage.tsx exactly, on an unlinked route, as a safe place to test
 * future changes to the arcade hero transition without touching production.
 */
const HeroLabPage: React.FC = () => {
	useSEO('Hero Lab', 'Experiment page for the arcade hero scroll transition.');

	return (
		<>
			<ArcadeHeroScroll variant='boom'>
				<NewArcadeHero />
			</ArcadeHeroScroll>
			<div className='w-full lg:mt-[-100vh]'>
				<HomeSections />
			</div>
		</>
	);
};

export default HeroLabPage;
