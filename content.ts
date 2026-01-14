// Types are now globally declared in types.d.ts

// ==========================================
// CONFIGURATION (Notion IDs & Global Settings)
// ==========================================

export const CONFIG = {
	notion: {
		// 1. News & Important Dates DB
		newsDatabaseId: '2e8ceff5447080c7914bfdbcb9758808',

		// 2. Organization & Keynotes DB (Formerly Members)
		// Use 'Role' column to distinguish: "Keynote", "General Chair", "Program Chair", etc.
		peopleDatabaseId: '2e7ceff5447080aebbbbf20d0ee07a0b',

		// 3. Program / Sessions DB
		// Use 'Start Time', 'End Time', 'Day', 'Title' columns
		sessionsDatabaseId: 'af10738ec6964a58ba15b4f10219ad99',

		// 4. Session Topics DB
		topicsDatabaseId: '2e7ceff544708077a369df3f0643c99e',

		// Chair Type Display Order
		chairTypeOrder: [
			'General Chairs',
			'Paper Chairs',
			'Poster Chairs',
			'Demo Chairs',
			'Publication Chairs',
			'Sponsor Chairs',
			'Publicity Chairs',
			'Panel Chairs',
			'Design Competition Chair',
			'Best Paper Award Committee',
			'Web Chairs',
			'Student Volunteer Chairs',
		],
	},
	contact: {
		email: 'taichi2026@taiwanchi.org',
		address: '',
	},
};

// Re-export for compatibility with services
export const NEWS_NOTION_PAGE_ID = CONFIG.notion.newsDatabaseId;
export const MEMBERS_NOTION_PAGE_ID = CONFIG.notion.peopleDatabaseId;
export const SESSIONS_NOTION_PAGE_ID = CONFIG.notion.sessionsDatabaseId;
export const TOPICS_NOTION_PAGE_ID = CONFIG.notion.topicsDatabaseId;

// ==========================================
// STATIC CONTENT
// ==========================================

export const CONTENT = {
	meta: {
		title: 'TAICHI 2026 | 霹靂未來 Pili Future',
		description: 'The 12th Annual Conference of TAICHI. Theme: Pili Future (霹靂未來).',
		url: 'https://taichi2026.taiwanchi.org',
	},
	nav: {
		logo: 'TAICHI 2026',
		home: 'HOME',
		news: 'NEWS',
		theme: 'THEME',
		program: 'AGENDA',
		keynotes: 'KEYNOTES',
		organization: 'ORGANIZATION',
		cfp: 'CALL FOR PAPERS',
		venue: 'VENUE',
		registration: 'REGISTRATION',
		notion: 'DB ADMIN',
		notionUrl: 'https://www.notion.so/',
	},
	hero: {
		titleLine1: 'TAICHI 2026',
		titleLine2: '霹靂未來',
		titleLine3: 'PILI FUTURE',
		subtitle: 'The 12th Annual Conference of TAICHI',
		date: 'Date: 2026 / 10 / XX (TBD)',
		location: 'Location: Taipei, Taiwan (TBD)',
		coordinates: 'TAICHI 2026 \n PILI FUTURE',
		segment: 'HCI\nTAIWAN',
	},
	theme: {
		title: 'THEME: PILI FUTURE \n 霹靂未來',
		p1: "TAICHI 2026's theme 'Pili Future' (霹靂未來) fuses the vibrant energy of traditional Taiwanese puppetry (Pili) with the cutting-edge advancements of Human-Computer Interaction.",
		p2: 'We invite researchers, designers, and artists to explore how future technologies can perform, interact, and tell stories in ways that resonate with local culture while pushing global boundaries.',
	},
	cfpSection: {
		title: 'CALL_FOR_PAPERS',
		subtitle: 'SUBMISSION TRACKS',
		tracks: [
			{
				id: 'full-papers',
				title: 'Full Papers',
				description: 'Original research contributions to HCI. (Format: ACM)',
				iconKey: 'file-text',
			},
			{
				id: 'posters',
				title: 'Posters & Demos',
				description: 'Work-in-progress and interactive demonstrations.',
				iconKey: 'image',
			},
			{
				id: 'workshops',
				title: 'Workshops',
				description: 'Community-building and emerging topics.',
				iconKey: 'users',
			},
		] as TrackItem[],
	},
	newsSection: {
		title: 'NEWS_&_DATES',
		subtitle: 'LATEST ANNOUNCEMENTS',
		loadMore: 'LOAD_MORE',
		showLess: 'SHOW_LESS',
		readMore: 'READ_MORE',
	},
	committeeSection: {
		title: 'ORGANIZATION',
		subtitle: 'COMMITTEE MEMBERS',
	},
	keynoteSection: {
		title: 'KEYNOTE_SPEAKERS',
		subtitle: 'INVITED TALKS',
	},
	programSection: {
		title: 'AGENDA',
		subtitle: 'CONFERENCE SCHEDULE',
		viewDetail: 'SESSION // ',
		backToIndex: 'BACK TO AGENDA', // Needed for ProjectDetail fallback
		viewProject: 'SESSION // ', // Needed for ProjectDetail fallback
	},
	venueSection: {
		title: 'VENUE_&_TRAVEL',
		address: 'xxx',
		transport: 'MRT: Gongguan Station (Exit 2) \n Bus: xxx Stop',
		mapLink: 'https://www.google.com/maps',
	},
	registrationSection: {
		title: 'REGISTRATION',
		info: 'Registration will open in mid-2026.',
		button: 'REGISTER_NOW (Coming Soon)',
	},
	sponsorsSection: {
		organizerTitle: 'ORGANIZERS',
		sponsorTitle: 'SPONSORS',
		organizers: [
			{ name: 'TAICHI', logo: '/logos/taichi.webp', size: 'large' }, // Main Organizer
		],
		coOrganizers: [
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
		],
		sponsors: [
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
			{ name: 'xxx', logo: '/logos/xxx.png', size: 'medium' },
		],
	},
	footer: {
		title: 'TAICHI 2026 \n 霹靂未來',
		socialsTitle: 'FOLLOW US',
		facebook: 'https://www.facebook.com/taiwanchi',
		locationsTitle: 'CONTACT',
		locationsList: ['taichi2026@taiwanchi.org', 'Taipei, Taiwan'],
		copyright: 'COPYRIGHT © 2026 TAICHI',
		credits: '',
	},
	// Legacy sections for compatibility
	projectsSection: {
		title: 'PROGRAM',
		viewProject: 'VIEW',
		backToIndex: 'BACK',
	},
	// Added back contact for compatibility with App.tsx
	contact: CONFIG.contact,
};

// Export empty arrays for initial state
export const SESSIONS: SessionItem[] = [];
export const PEOPLE: PersonItem[] = []; // Covers both Committee and Keynotes
export const PUBLICATIONS: PublicationItem[] = [];
export const NEWS: NewsItem[] = [];
