// Types are now globally declared in types.d.ts

import { link } from 'fs';

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
			'Visual Chairs',
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
		title: 'TAICHI 2026 | Big Bang Future',
		description: 'The 12th Annual Conference of TAICHI. Theme: Big Bang Future.',
		url: 'https://taichi2026.taiwanchi.org',
	},
	nav: {
		logo: 'TAICHI 2026',
		home: 'HOME',
		// news: 'NEWS',
		theme: 'THEME',
		program: 'AGENDA',
		keynotes: 'KEYNOTES',
		organization: 'ORGANIZATION',
		cfp: 'CALL FOR PAPERS',
		venue: 'VENUE',
		registration: 'REGISTRATION',
		notion: 'DB ADMIN',
		notionUrl: 'https://www.notion.so/',
		cfpSubmenu: [
			{ label: 'Important Dates', hash: '#important-dates' },
			{ label: 'Full Paper & Pictorial ', hash: '#papers' },
			{ label: 'Poster', hash: '#posters' },
			{ label: 'Interactivity and Demo', hash: '#demos' },
		],
	},
	hero: {
		titleLine1: 'TAICHI 2026',
		titleLine2: 'BIG BANG! FUTURES!',
		titleLine3: 'BIG BANG! FUTURES!',
		subtitle: 'The 12th Annual Conference of TAICHI',
		date: 'Date: 2026 / 08 / 04 - 06',
		location: 'Location: Taipei, Taiwan',
		coordinates: 'TAICHI 2026 \n BIG BANG FUTURES',
		segment: 'HCI\nTAIWAN',
	},
	theme: {
		title: 'TAICHI’26’s Main Theme -- Big Bang! Futures！',
		p1: '未來將不再以低語傳遞，而是以爆炸式發生。本次大會主題 Big Bang! Futures，源自宇宙霹靂般的起始瞬間——爆炸、火花與生命的誕生，也象徵想法快速擴散、改變世界的一刻',
		p2: '我們將這個瞬間帶進城市，化為一個可以逛、可以玩、可以一起參與的未來現場，透過互動裝置、實驗作品與夜市般的體驗空間，邀請民眾親身感受並討論科技如何影響未來生活與彼此之間的關係，讓多重未來在連鎖爆發中持續 Big Bang!',
	},
	cfpSection: {
		title: 'CALL FOR PAPERS',
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
				title: '論文與圖像式論文（Full Paper & Pictorial)',
				date: '2026/6/18(四) 23:59 (GMT+8)',
				notification: '2026/7/21(二) 23:59 (GMT+8)',
				cameraReady: '2026/7/27(一) 23:59 (GMT+8)',
				extendedDate: '',
				format: 'ACM SIGCHI Two-Column / DIS Pictorial',
				links: [
					{ label: 'Latex Template', url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip' },
					{
						label: 'Overleaf Template',
						url: 'https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc',
					},
					{
						label: 'Microsoft Word for Windows',
						url: 'https://www.acm.org/binaries/content/assets/publications/word_style/interim-template-style/interim-layout.docx',
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
					'論文為呈現完整且尚未公開發表之新研究成果的主要媒介；通過審查的論文將被排入研討會發表議程。中英文論文投稿均可，所有投稿需依循 ACM SIGCHI 之雙欄撰寫 paper 格式或採用 DIS 的 pictorial 格式。',
					'論文（Full Paper）',
					'Full Paper 論文投稿格式範本請至 ACM CHI/UIST/DIS 官方網站下載 Sumbission Formats (paper格式)，請作者依照個人偏好的編輯軟體，從下列的連結下載對應的範本檔案：',
					'● [Latex Template](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip)',
					'● [Overleaf Template(\\documentclass[sigconf,anonymous]{acmart})](https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc)',
					'● [Microsoft Word for Windows](https://www.acm.org/binaries/content/assets/publications/word_style/interim-template-style/interim-layout.docx), [Macintosh Office 2011](https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2011/mac_2011.zip), and [Macintosh Office 2016](https://portalparts.acm.org/hippo/enhanced_word_templates/MAC_2016/mac_2016.zip)',
					'其他資訊請參考 [ACM Template](https://www.acm.org/publications/proceedings-template) 的網頁說明。TAICHI論文頁數**以8~12頁為原則但不超過12頁**（不含參考文獻），中文版本字體請使用標楷體，字級則與英文論文相同，均須依循ACM SIGCHI格式規範，請參考範本文件中的內容說明。',
					'圖像式論文（Pictorial）',
					'Pictorial 設計論文的格式，請作者參考 [ACM DIS2025](https://dis.acm.org/2025/call-for-pictorials/) 的說明來進行準備 。以下提供範本檔案的連結，請作者依照個人偏好的軟體，下載相對應的檔案來編輯投稿文件：',
					'● [Pictorials InDesign Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-InDesign-template_Folder.zip)',
					'● [Pictorials Word Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-Word-template-Folder.zip)',
					'● [Pictorials Powerpoint Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-PowerPoint-template-Folder.zip)',
					'TAICHI Pictorial 論文頁數**以8~12頁為原則但不超過12頁**（不含參考文獻），中文版本字體請使用標楷體，字級則與英文論文相同，均須依循ACM SIGCHI格式規範，請參考範本文件中的內容說明。',
					'備註',
					'● 所有投稿論文皆採**雙向匿名 (Double-blind)** 審查，請上傳匿名的 PDF 檔案，如果作者沒有匿名，將直接退稿。論文 PDF 檔案含附件須**小於 20MB**，請作者用 Acrobat 的最佳化功能，縮減檔案的大小同時確保內容可以清楚地呈現在螢幕上。',
					'● 被錄取論文將收錄於非正式的TAICHI 2026 線上論文集，放置雲端供大家下載閱讀；作者若有投稿疑慮，亦可選擇以摘要形式收錄於非正式的TAICHI 2026線上論文集。',
					'● 若投稿論文之主題與研討會徵稿範圍不符、研究貢獻不明確或未完整呈現，或未依規定格式撰寫，主辦單位有權於審查前進行初步篩選並直接退稿（desk reject）。以下為可能之情況說明：',
					'● ● __研究範疇（Scope）__：未能充分回顧相關文獻，或缺乏足夠脈絡以說明研究之新穎性與對設計研究或互動系統領域之貢獻。論文應適當建立於既有研究、設計實務或相關領域之基礎上，且其貢獻應與篇幅相符。',
					'● ● __方法論（Methodology）__：未提供足夠資訊以說明研究方法與過程，包含概念架構不清、論證不完整，或缺乏方法描述與研究透明度。',
					'● ● __資料（Data）__：缺乏足夠資料或證據支持分析與研究主張，致使研究結論難以驗證。',
					'Paper Chairs',
					'Yaliang Chuang / 莊雅量 / 國立清華大學藝術與設計系',
					'Shan Yuan Teng / 鄧善元 / 國立臺灣大學資訊工程學系',
					'Hsin-Ruey (Ray) Tsai / 蔡欣叡 / 國立政治大學資訊科學系',
					'Yu-Chun (Grace) Yen / 顏羽君 / 國立陽明交通大學資訊工程系',
					'論文投稿相關問題請洽 [taiwanchi26+paper@gmail.com](mailto:taiwanchi26+paper@gmail.com)',
				],
				specs: ['Notification 結果通知: 2026/7/21(二) 23:59 (GMT+8)', 'Camera-Ready Deadline 完稿日: 2026/7/27(一) 23:59 (GMT+8)'],
			},
			{
				id: 'posters',
				title: 'Poster 海報論文',
				date: '2026/6/18(四) 23:59 (GMT+8)',
				notificationDate: '2026/7/21(二) 23:59 (GMT+8)',
				cameraReadyDate: '2026/7/27(一) 23:59 (GMT+8)',
				extendedDate: '',
				format: 'ACM SIGCHI Two-Column',
				links: [
					{
						label: 'Latex',
						url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip',
					},
					{
						label: 'Overleaf',
						url: 'https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc',
					},
					{
						label: 'Word',
						url: 'https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx',
					},
				],
				description: [
					'海報提供作者與研討會參與者直接互動討論正在進行或已在其他研討會發表的研究。受錄取的海報可在研討會海報時段呈現。',
					'投稿格式',
					'● 投稿需依循 ACM SIGCHI Publication Format (雙欄) 之格式撰寫。檔案必須為 PDF 檔。標準格式請至 ACM SIGCHI 官方網站下載 [CHI Publication Formats](https://chi2022.acm.org/for-authors/presenting/papers/chi-publication-formats/)。',
					'● 投稿格式範本如下：[Latex](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip), [Overleaf](https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc), [Word](https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx)',
					'● TAICHI 海報論文頁數**以四頁為原則**（不含參考文獻）',
					'● 中文版本字體請使用標楷體，字級則與英文論文相同，均須依循 ACM SIGCHI 格式規範，請參考範本文件中的內容說明。',
					'● 論文內容必須包含摘要、研究動機、⽬的、⽅法、⽬前成果、以及未來研究規劃。',
					'● 論文標題需以「 Poster: 」為開頭。',
					'● 海報稿件只需上傳論文，海報檔案將於確定被接受後上傳。',
					'● 所有海報將列入海報論文獎審查，得獎者由會議參與者匿名投票選出。',
					'備註',
					'● 所有投稿論文皆採**雙向匿名 (Double-blind)** 審查，請上傳匿名的 PDF 檔案，如果作者沒有匿名，將直接退稿。論文 PDF 檔案含附件須**小於 20MB**，請作者用 Acrobat 的最佳化功能，縮減檔案的大小同時確保內容可以清楚地呈現在螢幕上。',
					'● 被錄取論文將收錄於非正式的TAICHI 2026 線上論文集，放置雲端供大家下載閱讀；作者若有投稿疑慮，亦可選擇以摘要形式收錄於非正式的TAICHI 2026線上論文集。',
					'● 若投稿論文之主題與研討會徵稿範圍不符、研究貢獻不明確或未完整呈現，或未依規定格式撰寫，主辦單位有權於審查前進行初步篩選並直接退稿（desk reject）。參照Full Paper 與 Pictorial論文規定。',
					'● TAICHI 2026 將會跟其他國際活動聯合舉辦，鼓勵大家海報用英文呈現。',
					'Poster Chairs',
					'Chiu-Hsuan Wang / 王秋玄 / 臺大資訊管理系博士後研究員',
					'Fu-Yin Cherng / 程芙茵 / 成大資訊工程系助理教授',
					'Wei-Ming Chung / 莊偉銘 / 銘傳大學商品設計系 講師',
					'● 海報論文投稿相關問題請洽 [taiwanchi26+poster@gmail.com](mailto:taiwanchi26+poster@gmail.com)',
				],
				specs: ['Notification 結果通知: 2026/7/21(二) 23:59 (GMT+8)', 'Camera-Ready Deadline 完稿日: 2026/7/27(一) 23:59 (GMT+8)'],
			},
			{
				id: 'demos',
				title: 'Interactivity and Demo 互動展示論文',
				date: '2026/6/18(四) 23:59 (GMT+8)',
				notificationDate: '2026/7/21(二) 23:59 (GMT+8)',
				cameraReadyDate: '2026/7/27(一) 23:59 (GMT+8)',
				extendedDate: '',
				format: 'ACM SIGCHI Extended Abstract',
				links: [
					{
						label: 'Latex',
						url: 'https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip',
					},
					{
						label: 'Overleaf',
						url: 'https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc',
					},
					{
						label: 'Word',
						url: 'https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx',
					},
					{
						label: '場地需求申請表',
						url: 'https://taichi2026.taiwanchi.org/static/TAICHI2026_Demo_Requirements.docx',
					},
				],
				description: [
					'展示直接於研討會上展現互動概念、手法、裝置或是系統的實作成果。受錄取的展示可在展示時段於研討會場中擺設攤位呈現。',
					'投稿格式',
					'● 投稿需依循 ACM SIGCHI Extended Abstract 之格式撰寫。檔案必須為 PDF 檔，不需匿名。標準格式請至 ACM SIGCHI 官方網站下載 [CHI Publication Formats](https://chi2022.acm.org/for-authors/presenting/papers/chi-publication-formats/)。',
					'● 投稿格式範本如下：[Latex](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip), [Overleaf](https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc), [Word](https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx)',
					'● 稿件總頁數**上限為三頁**（不含參考文獻），格式採**雙欄排版**。內容可使用中英文撰寫，中文部分請使用標楷體字型。',
					'● 內容必須包含摘要、研究動機、目的、方法、目前成果、以及未來研究規劃。',
					'● 論文標題需以「 Demo: 」為開頭。若該論文同時為 Poster，論文標題開頭請為: 「 Poster & Demo: 」。',
					'● 鼓勵上傳影片以便衡量系統的互動性以及完整程度。上傳影片前請先以 [HandBrake](https://handbrake.fr/) 進行壓縮，並輸出成 H.264 之.mp4 檔案。',
					'● 需繳交一份「[場地需求申請表](https://taichi2026.taiwanchi.org/static/TAICHI2026_Demo_Requirements.docx)」，展示主席將依此協助當天的布展安排。',
					'● 所有系統展示將列入系統展示論文獎審查，得獎者由會議參與者匿名投票選出。',
					'備註',
					'● 被錄取論文將收錄於非正式的TAICHI 2026 線上論文集，放置雲端供大家下載閱讀；作者若有投稿疑慮，亦可選擇以摘要形式收錄於非正式的TAICHI 2026線上論文集。',
					'● 屆時請於會議展示時段前完成攤位佈置。',
					'● TAICHI 2026 將會跟其他國際活動聯合舉辦，鼓勵大家海報用英文呈現。',
					'Demo Chairs',
					'Ching-Wen Hung / 洪靖雯 / 臺大資訊網路與多媒體研究所 博士候選人',
					'● 展示投稿相關問題請洽 [taiwanchi26+demo@gmail.com](mailto:taiwanchi26+demo@gmail.com)',
				],
				specs: ['Notification 結果通知: 2026/7/21(二) 23:59 (GMT+8)', 'Camera-Ready Deadline 完稿日: 2026/7/27(一) 23:59 (GMT+8)'],
			},
		],
	},
	newsSection: {
		title: 'NEWS',
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
			'visual chairs': { zh: '視覺主席', en: 'VISUAL CHAIRS' },
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
		title: 'VENUE',
		venues: [
			{
				day: 'Day 1',
				name: '三創生活園區',
				address: '100013臺北市中正區市民大道三段2號',
				details: 'TBD', // Reserved for later (floor, classroom, position)
				mapLink: 'https://maps.app.goo.gl/yYLTdcVH5rSMevEF8', // Placeholder
				embedSrc:
					'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.6633085538724!2d121.52874377537685!3d25.04549777780891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a97b582d5a73%3A0x9b1e56ab48807d62!2z5LiJ5Ym155Sf5rS75ZyS5Y2A!5e0!3m2!1szh-TW!2stw!4v1772020903779!5m2!1szh-TW!2stw',
			},
			{
				day: 'Day 2',
				name: '國立臺北科技大學',
				address: '10608臺北市大安區忠孝東路三段1號',
				details: 'TBD', // Reserved for later (floor, classroom, position)
				mapLink: 'https://maps.app.goo.gl/p97U3oZnXoUvrXmo7', // Placeholder
				embedSrc:
					'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d903.6783181717664!2d121.53284755506823!3d25.043802836933057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a97d255598df%3A0x47ea748e8f3f53aa!2z5ZyL56uL6Ie65YyX56eR5oqA5aSn5a24!5e0!3m2!1szh-TW!2stw!4v1772020528494!5m2!1szh-TW!2stw',
			},
		],
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
			{
				name: '台灣人機互動學會',
				logo: '/logos/taichi.webp',
				size: 'large',
				className: 'px-8 py-5 rounded-3xl shadow-2xl',
			}, // Main Organizer
			{
				name: '國科會晶創人文計畫',
				logo: '/logos/NSTC_.png',
				size: 'large',
				className: 'px-8 py-5 rounded-3xl shadow-2xl',
			},
		],
		coOrganizers: [
			{
				name: '國立臺灣科技大學',
				logo: '/logos/NTUST.png',
				size: 'small',
				className: 'px-6 py-4 rounded-2xl shadow-xl',
			},
			{
				name: '國立臺北科技大學',
				logo: '/logos/NTUT.png',
				size: 'S',
				className: 'px-6 py-4 rounded-2xl shadow-xl',
			},
		],
		sponsors: [
			{
				name: '美國在台協會',
				logo: '/logos/AIT.png',
				size: 'large',
				className: 'px-6 py-4 rounded-2xl shadow-xl',
			},
			{
				name: '美國創新中心',
				logo: '/logos/AIC.png',
				size: 'large',
				className: 'px-6 py-4 rounded-2xl shadow-xl',
			},
		],
	},
	footer: {
		title: 'TAICHI 2026 \n BIG BANG! FUTURE!',
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
