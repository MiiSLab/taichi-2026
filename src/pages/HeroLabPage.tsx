import React from 'react';
import ArcadeHeroScroll from '../components/home/ArcadeHeroScroll';
import NewArcadeHero from '../components/home/newhero/NewArcadeHero';
import HomeSections from '../components/home/HomeSections';
import { useSEO } from '../hooks/useSEO';

/**
 * Experiment page for the arcade hero's scroll-snap transition (auto-snap on
 * a scroll nudge + BOOM circle-collapse), kept off the live homepage so it
 * can be tuned without risking normal scrolling. See HomePage.tsx and
 * ArcadeHeroScroll.tsx for why.
 */
const HeroLabPage: React.FC = () => {
	useSEO('Hero Lab', 'Experiment page for the arcade hero scroll transition.');

	return <ArcadeHeroScroll variant='boom' hero={<NewArcadeHero />} content={<HomeSections />} />;
};

export default HeroLabPage;
