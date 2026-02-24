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
		email: 'taiwanchi26@gmail.com',
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
		titleLine2: 'Big Bang! Futures!',
		titleLine3: 'Big Bang! Futures!',
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
		topicsTitle: 'Conference Topics / 研討會主題',
		submissionLink: 'https://easychair.org/conferences/?conf=taichi2026',
		topics: [
			{
				en: 'Usability and User Experience',
				ch: '可用性與使用者體驗',
				details: [
					'Design and evaluation of user-friendly interfaces / 使用者友好介面的設計與評估',
					'User experience (UX) research and methodologies / 使用者體驗（UX）研究與方法',
					'Usability testing and assessment / 可用性測試與評估',
				],
			},
			{
				en: 'Interaction Techniques and Devices',
				ch: '互動技術與裝置',
				details: [
					'Development of innovative interaction techniques / 創新互動技術',
					'Design and evaluation of new input/output devices / 新型輸入/輸出裝置的設計與評估',
					'Haptic and multimodal interaction / 觸覺與多模態互動',
				],
			},
			{
				en: 'Understanding Users and Human Behavior',
				ch: '理解使用者與人類行為',
				details: [
					'Theoretical models of human behavior / 人類行為的理論模型',
					'User research methods / 使用者研究方法',
					'Cultural and social factors in HCI / 文化與社會因素在HCI中的影響',
				],
			},
			{
				en: 'Design Methods and Processes',
				ch: '設計方法與流程',
				details: [
					'Innovative design methodologies / 創新設計方法論',
					'Scalable and inclusive design practices / 可擴展且包容性的設計實踐',
					'Evolving design processes in industry and academia / 產業與學術界設計流程的演進',
				],
			},
			{
				en: 'Mobile and Ubiquitous Computing',
				ch: '移動與普適計算',
				details: [
					'Mobile user interfaces and applications / 移動使用者介面與應用',
					'Context-aware computing / 情境感知計算',
					'Internet of Things (IoT) and pervasive computing / 物聯網（IoT）與普適計算',
				],
			},
			{
				en: 'Virtual, Augmented, Mixed, and Extended Reality (VR, AR, MR, XR)',
				ch: '虛擬、擴增、混合與擴展實境',
				details: [
					'Design, development, and application of immersive technologies in domains such as entertainment, education, and healthcare / 沉浸式技術在娛樂、教育和醫療等領域的設計、開發與應用',
					'Perception and cognition in immersive environments / 沉浸式環境中的感知與認知',
					'User interaction techniques for immersive systems / 沉浸式系統的使用者互動技術',
				],
			},
			{
				en: 'Human-AI Interaction',
				ch: '人工智慧與人類互動',
				details: [
					'Design of interactive AI agents and smart assistants / 互動式AI代理人與智能助手的設計',
					'Explainable AI and user trust / 可解釋的AI與使用者信任',
					'Ethical implications of AI in user interfaces / AI在使用者介面中的倫理影響',
				],
			},
			{
				en: 'Social Computing and Collaboration',
				ch: '社群運算與協作',
				details: [
					'Computer-Supported Cooperative Work (CSCW) / 電腦支援協同工作（CSCW）',
					'Social media analysis and design / 社交媒體分析與設計',
					'Online communities, digital democracy, and civic engagement / 線上社群、數位民主與公民參與',
				],
			},
			{
				en: 'Specific Application Areas',
				ch: '特定應用領域 (如學習、健康、家居、設計輔具等)',
				details: [
					'Physical/Mental Well-being / 身心健康：促進身心健康的技術、輔助技術、健康信息學與遠程醫療',
					'Education and Learning Technologies / 教育與學習技術：數位學習工具與平台、教育遊戲設計、技術增強的學習環境',
					'Creativity Support / 創意支持：增強創意流程的技術、電腦輔助設計',
				],
			},
			{
				en: 'Ethics, Accessibility, and Inclusive Design',
				ch: '倫理、無障礙與包容性設計',
				details: [
					'Designing for accessibility and diverse user groups / 為無障礙與多元使用者群體設計',
					'Ethical considerations in HCI / HCI中的倫理考量',
					'Inclusive digital experiences / 包容性的數位體驗',
				],
			},
			{
				en: 'More-than-Human Design',
				ch: '超越人本中心的設計',
				details: [
					'Speculative and critical design approaches / 推測性與批判性設計方法',
					'Thing-centered design / 以物件為中心的設計',
					'Sustainable and environmentally conscious design / 永續與環境友好的設計',
				],
			},
		],
		categories: [
			{
				id: 'papers',
				title: 'Full Paper 及 Pictorial 論文',
				date: '2026 / 6 / 18 (Thu)',
				extendedDate: '',
				format: 'ACM SIGCHI Two-Column / DIS Pictorial',
				links: [
					{ label: 'Latex Template', url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip' },
					{ label: 'Overleaf Template', url: 'https://www.overleaf.com/gallery/tagged/acm-official#.WOuOk2e1taQ' },
					{
						label: 'Microsoft Word for Windows',
						url: 'https://portalparts.acm.org/hippo/enhanced_word_templates/Windows/windows.zip',
					},
					{
						label: 'Macintosh Office 2011',
						url: 'https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2011/mac_2011.zip',
					},
					{
						label: 'Macintosh Office 2016',
						url: 'https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2016/mac_2016.zip',
					},
					{
						label: 'Pictorials InDesign Template',
						url: 'https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-InDesign-template_Folder.zip',
					},
					{
						label: 'Pictorials Word Template',
						url: 'https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-Word-template-Folder.zip',
					},
					{
						label: 'Pictorials Powerpoint Template',
						url: 'https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-PowerPoint-template-Folder.zip',
					},
				],
				description: [
					'論文為呈現完整且尚未公開發表之新研究成果的主要媒介；通過審查的論文將被排入研討會發表議程。中英文論文投稿均可，所有投稿需依循 ACM SIGCHI 之**雙欄撰寫** paper 格式或採用 DIS 的 pictorial 格式。',
					'Full Paper',
					'Full Paper 論文投稿格式範本請至 ACM CHI/UIST/DIS 官方網站下載 Sumbission Formats (paper格式)，請作者依照個人偏好的編輯軟體，從下列的連結下載對應的範本檔案：',
					'● [Latex Template](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip)',
					'● [Overleaf Template](https://www.overleaf.com/gallery/tagged/acm-official#.WOuOk2e1taQ)',
					'● [Microsoft Word for Windows](https://portalparts.acm.org/hippo/enhanced_word_templates/Windows/windows.zip), [Macintosh Office 2011](https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2011/mac_2011.zip), and [Macintosh Office 2016](https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2016/mac_2016.zip)',
					'其他資訊請參考 [ACM Template](https://www.acm.org/publications/proceedings-template) 的網頁說明。TAICHI論文頁數**以8~12頁為原則但不超過12頁**（不含參考文獻），中文版本字體請使用標楷體，字級則與英文論文相同，均須依循ACM SIGCHI格式規範，請參考範本文件中的內容說明。',
					'Pictorial',
					'Pictorial 設計論文的格式，請作者參考 [ACM DIS2025](https://dis.acm.org/2025/call-for-pictorials/) 的說明來進行準備 。以下提供範本檔案的連結，請作者依照個人偏好的軟體，下載相對應的檔案來編輯投稿文件：',
					'● [Pictorials InDesign Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-InDesign-template_Folder.zip)',
					'● [Pictorials Word Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-Word-template-Folder.zip)',
					'● [Pictorials Powerpoint Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-PowerPoint-template-Folder.zip)',
					'TAICHI Pictorial 論文頁數**以8~12頁為原則但不超過12頁**（不含參考文獻），中文版本字體請使用標楷體，字級則與英文論文相同，均須依循ACM SIGCHI格式規範，請參考範本文件中的內容說明。',
					'備註',
					'所有投稿論文皆採**雙向匿名 (Double-blind)** 審查，請上傳匿名的 PDF 檔案，如果作者沒有匿名，將直接退稿。論文 PDF 檔案含附件須**小於 20MB**，請作者用 Acrobat 的最佳化功能，縮減檔案的大小同時確保內容可以清楚地呈現在螢幕上。',
					'在稿件投稿時，作者可選擇是否願意將受錄取的論文收錄於正式出版 TAICHI 2026 Proceedings；作者亦可選擇將受錄取的論文摘要或全文收錄於非正式出版的 TAICHI 線上論文集。',
					'論文投稿相關問題請洽 paper2026@taiwanchi.org',
				],
				specs: ['Notification: 2026 / 7 / 21 (Tue)', 'Camera-ready: 2026 / 7 / 27 (Mon)'],
			},
			{
				id: 'posters',
				title: 'Poster 海報論文',
				date: '2026 / 6 / 18 (Thu)',
				extendedDate: '',
				format: 'ACM SIGCHI Two-Column',
				description: [
					'TAICHI 海報論文頁數**以四頁為原則**（不含參考文獻），中文版本字體請使用標楷體，字級則與英文論文相同，均須依循 ACM SIGCHI 格式規範，請參考範本文件中的內容說明。',
					'所有投稿論文皆採**雙向匿名 (Double-blind)** 審查，請上傳匿名的 PDF 檔案，如果作者沒有匿名，將直接退稿。論文 PDF 檔案含附件須**小於 20MB**，請作者用 Acrobat 的最佳化功能，縮減檔案的大小同時確保內容可以清楚地呈現在螢幕上。',
					'備註',
					'在稿件投稿時，作者可選擇是否願意將受錄取的論文收錄於正式出版 TAICHI 2026 Proceedings；作者亦可選擇將受錄取的論文摘要或全文收錄於非正式出版的 TAICHI 線上論文集。',
					'論文投稿相關問題請洽 paper2026@taiwanchi.org',
				],
				specs: ['Notification: 2026 / 7 / 21 (Tue)', 'Camera-ready: 2026 / 7 / 27 (Mon)'],
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
		locationsList: ['taiwanchi26@gmail.com', 'Taipei, Taiwan'],
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
