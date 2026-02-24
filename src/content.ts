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
			'Steering Committees',
			'Paper Chairs',
			'Poster Chairs',
			'Demo Chairs',
			'Panel Chairs',
			'Workshop Chairs',
			'Publicity Chairs',
			'Performance Chairs',
			'Beer Chairs',
			'Family Chairs',
			'Sponsor Chairs',
			'Web Chairs',
			'Registration Chairs',
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
		date: 'Date: 2026 / XX / XX (TBD)',
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
		subtitle: 'SUBMISSION INFO',
		topicsTitle: 'List of Topics / 研討會主題',
		submissionLink: 'https://easychair.org/conferences/?conf=taichi2026',
		topics: [
			{ en: 'Usability and User Experience', ch: '可用性與使用者體驗' },
			{ en: 'Interaction Techniques and Devices', ch: '互動技術與裝置' },
			{ en: 'Understanding Users and Human Behavior', ch: '理解用戶與人類行為' },
			{ en: 'Design Methods and Processes', ch: '設計方法與流程' },
			{ en: 'Mobile and Ubiquitous Computing', ch: '移動與普適計算' },
			{ en: 'Virtual, Augmented, Mixed, and Extended Reality (VR, AR, MR, XR)', ch: '虛擬、擴增、混合與擴展實境' },
			{ en: 'Human-AI Interaction', ch: '人工智慧與人類互動' },
			{ en: 'Social Computing and Collaboration', ch: '社群運算與協作' },
			{ en: 'Specific Application Areas', ch: '特定應用領域' },
			{ en: 'Ethics, Accessibility, and Inclusive Design', ch: '倫理、無障礙與包容性設計' },
			{ en: 'More-than-Human Design', ch: '超越人本中心的設計' },
		],
		categories: [
			{
				id: 'papers',
				title: 'Papers (論文)',
				date: '2026 / xx / xx (Sat)',
				extendedDate: '',
				format: 'ACM SIGCHI Two-Column / DIS Pictorial',
				links: [
					{ label: 'Latex', url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip' },
					{ label: 'Overleaf', url: 'https://www.overleaf.com/gallery/tagged/acm-official#.WOuOk2e1taQ' },
					{ label: 'Word (Win)', url: 'https://portalparts.acm.org/hippo/enhanced_word_templates/Windows/windows.zip' },
					{ label: 'Word (Mac)', url: 'https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2016/mac_2016.zip' },
					{
						label: 'Pictorial InDesign',
						url: 'https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-InDesign-template_Folder.zip',
					},
					{
						label: 'Pictorial Word',
						url: 'https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-Word-template-Folder.zip',
					},
				],
				description: [
					'論文為呈現完整且尚未公開發表之新研究成果的主要媒介。受錄取的論文將被排入研討會發表議程。',
					'Full Paper 論文格式：中英文論文投稿均可，所有投稿需依循 ACM SIGCHI 之雙欄寫 paper 格式或採用 DIS 的 pictorial 格式。',
					'論文頁數以四～八頁為原則（不含參考文獻）。',
					'中文版本字體請使用標楷體，字級則與英文論文相同。',
					'所有投稿論文皆採雙向匿名 (Double-blind) 審查，請上傳匿名的PDF檔案，如果作者沒有匿名，將直接退稿。',
					'論文PDF檔案含附件須小於20MB。',
				],
				specs: ['Notification: 2026 / XX / XX', 'Camera-ready: 2026 / XX / XX'],
			},
			{
				id: 'posters',
				title: 'Late-Breaking Work and Poster (海報論文)',
				date: '2026 / XX / XX (Tue)',
				extendedDate: '',
				format: 'ACM SIGCHI Two-Column',
				links: [
					{ label: 'Latex', url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip' },
					{
						label: 'Overleaf',
						url: 'https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc',
					},
					{ label: 'Word', url: 'https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx' },
				],
				description: [
					'海報提供作者與研討會參與者直接互動討論正在進行或已在其他研討會發表的研究。',
					'投稿需依循 ACM SIGCHI Publication Format (雙欄) 之格式撰寫。',
					'檔案必須為 PDF 檔，不需匿名。',
					'總頁數至多三頁（不含參考文獻）。內容中英文皆可，中文字體請使用標楷體。',
					'論文標題需以「 Poster: 」為開頭。',
				],
				specs: ['Notification: 2026 / XX / XX', 'Camera-ready: 2026 / XX / XX'],
			},
			{
				id: 'demos',
				title: 'Interactivity and Demo (互動展示論文)',
				date: '2026 / XX / XX (Tue)',
				extendedDate: '',
				format: 'ACM SIGCHI Extended Abstract',
				links: [
					{ label: 'Latex', url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip' },
					{
						label: 'Overleaf',
						url: 'https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc',
					},
					{ label: 'Word', url: 'https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx' },
					{
						label: 'Field Request Form',
						url: 'https://www.dropbox.com/s/4nwwza7sudz36jq/TAICHI2023%20%20Demo%20Requirements.docx?dl=0',
					},
				],
				description: [
					'展示直接於研討會上展現互動概念、手法、裝置或是系統的實作成果。',
					'投稿需依循 ACM SIGCHI Extended Abstract 之格式撰寫。',
					'檔案必須為 PDF 檔，不需匿名。稿件總頁數上限為三頁（不含參考文獻）。',
					'鼓勵上傳影片 (H.264 .mp4) 以便衡量系統的互動性以及完整程度。',
					'需繳交一份「場地需求申請表」。',
					'論文標題需以「 Demo: 」為開頭。',
				],
				specs: ['Notification: 2026 / XX / XX', 'Camera-ready: 2026 / XX / XX'],
			},
		],
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
		chairTitles: {
			'general chairs': { zh: '會議主席', en: 'GENERAL CHAIRS' },
			'steering committees': { zh: '指導委員', en: 'STEERING COMMITTEES' },
			'program chairs': { zh: '議程主席', en: 'PROGRAM CHAIRS' },
			'paper chairs': { zh: '論文主席', en: 'PAPER CHAIRS' },
			'poster chairs': { zh: '海報主席', en: 'POSTER CHAIRS' },
			'demo chairs': { zh: '展示主席', en: 'DEMO CHAIRS' },
			'panel chairs': { zh: '論壇主席', en: 'PANEL CHAIRS' },
			'workshop chairs': { zh: '工作坊主席', en: 'WORKSHOP CHAIRS' },
			'publicity chairs': { zh: '宣傳主席', en: 'PUBLICITY CHAIRS' },
			'performance chairs': { zh: '表演主席', en: 'PERFORMANCE CHAIRS' },
			'beer chairs': { zh: '啤酒主席', en: 'BEER CHAIRS' },
			'family chairs': { zh: '家庭主席', en: 'FAMILY CHAIRS' },
			'sponsor chairs': { zh: '贊助主席', en: 'SPONSOR CHAIRS' },
			'publication chairs': { zh: '出版主席', en: 'PUBLICATION CHAIRS' },
			'design competition chairs': { zh: '設計競賽主席', en: 'DESIGN COMPETITION CHAIR' },
			'best paper award committee': { zh: '最佳論文獎委員', en: 'BEST PAPER AWARD COMMITTEE' },
			'web chairs': { zh: '網路主席', en: 'WEB CHAIRS' },
			'registration chairs': { zh: '註冊主席', en: 'REGISTRATION CHAIRS' },
			'student volunteer chairs': { zh: '學生志願者主席', en: 'STUDENT VOLUNTEER CHAIRS' },
		},
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
		transport: 'MRT: xxx (Exit 2) \n Bus: xxx Stop',
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
