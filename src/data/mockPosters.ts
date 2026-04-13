export type MockPoster = {
	id: string;
	title: string;
	author: string;
	abstract: string;
	imageUrl: string;
	voteCount: number;
	theme: string;
};

const POSTER_IMAGE_URL = '/images/fake poster demo.jpg';

const posterThemes = [
	'Human-AI Interaction',
	'Design Futures',
	'XR Storytelling',
	'Health and Wellbeing',
	'Sustainable Interfaces',
] as const;

const posterTitles = [
	'Adaptive Ritual Interfaces',
	'Signal Gardens For Shared Spaces',
	'Embodied Archives Of Motion',
	'Collective Memory Instruments',
	'Neighbourhood Climate Dashboards',
	'Playable Learning Constellations',
	'Quiet Tech For Recovery',
	'Participatory City Sensors',
	'Responsive Materials For Care',
	'Future Ritual Cartographies',
] as const;

export const mockPosters: MockPoster[] = Array.from({ length: 50 }, (_, index) => {
	const titleSeed = posterTitles[index % posterTitles.length];
	const theme = posterThemes[index % posterThemes.length];
	const posterNumber = String(index + 1).padStart(2, '0');
	const cycle = Math.floor(index / posterTitles.length) + 1;

	return {
		id: `poster-${posterNumber}`,
		title: `${titleSeed} / Study ${cycle}`,
		author: `TAICHI Lab ${posterNumber}`,
		abstract: `Poster ${posterNumber} explores ${theme.toLowerCase()} through a speculative yet buildable interaction concept, framing how TAICHI 2026 participants might evaluate impact, accessibility, and emotional resonance inside future-facing poster sessions.`,
		imageUrl: POSTER_IMAGE_URL,
		voteCount: 12 + ((index * 7) % 31),
		theme,
	};
});

export const posterImageUrl = POSTER_IMAGE_URL;
