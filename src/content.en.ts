import { CONTENT_ZH } from './content.zh';

export const CONTENT_EN = {
	...CONTENT_ZH,
	meta: {
		title: 'TAICHI 2026 | Big Bang Future',
		description: 'The 12th Annual Conference of TAICHI. Theme: Big Bang! Futures!',
		url: 'https://taichi2026.taiwanchi.org',
	},
	nav: {
		...CONTENT_ZH.nav,
		home: 'HOME',
		news: 'NEWS',
		theme: 'THEME',
		program: 'PROGRAM',
		keynotes: 'KEYNOTES',
		registration: 'REGISTRATION',
		notion: 'DB ADMIN',
		familyFriendlySubmenu: [
			{ label: 'Design', hash: '#family-design' },
			{ label: 'Nearby Map', hash: '#nearby-map' },
			{ label: 'Facilities', hash: '#syntrend-facilities' },
		],
	},
	heroBanner: {
		topText: 'The 12th Annual Conference of TAICHI',
		bottomText: '2026/8/5 - 8/6 TAIPEI, TAIWAN',
	},
	submissionDeadline: {
		title: 'SUBMISSION DEADLINE',
		date: '2026/6/23 Tue. 23:59 (GMT+8)',
		buttonText: 'SUBMIT NOW',
	},
	theme: {
		title: 'TAICHI2026 Theme: Big Bang! Futures!',
		slogan: "The future doesn't whisper; it bangs!",
		description:
			'Big Bang! Futures is inspired by the universe’s first spark, when explosion, energy, and life began. We bring that moment into the city as a future the public can walk through, play with, and experience together. Through interactive works, experimental pieces, and a night-market atmosphere, visitors are invited to explore how technology shapes future ways of living, gathering, and relating.',
	},
	cfpSection: {
		...CONTENT_ZH.cfpSection,
		subtitle: 'SUBMISSION INFO',
		topicsTitle: 'Conference Topics',
		importantDatesTitle: 'Important Date',
		heroDeadlineNote: 'Submission deadline: 2026/06/23 23:59 (GMT+8)',
		heroTimelineItems: [
			{ title: 'DEADLINE', date: '06.23', oldDate: '06.18', subtitle: 'Submission deadline' },
			{ title: 'NOTIFICATION', date: '07.21', oldDate: '', subtitle: 'Review results announced' },
			{ title: 'CAMERA-READY DEADLINE', date: '07.27', oldDate: '', subtitle: 'Final camera-ready due' },
			{ title: 'CONFERENCE', date: '08.05-06', oldDate: '', subtitle: 'Conference dates' },
		],
		categories: [
			{
				...CONTENT_ZH.cfpSection.categories[0],
				title: 'Full Paper & Pictorial',
				description: [
					'Papers are the primary venue for presenting complete and unpublished new research contributions. Accepted submissions will be scheduled in the conference program. Papers may be submitted in either Chinese or English, and all submissions should follow the ACM SIGCHI two-column paper format or the DIS pictorial format.',
					'Full Paper',
					'Please download the Full Paper submission templates from the official ACM CHI/UIST/DIS websites. Authors should choose the template that matches their preferred authoring tool from the links below:',
					'● [Latex Template](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip)',
					'● [Overleaf Template](https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc)',
					'● [Microsoft Word for Windows](https://www.acm.org/binaries/content/assets/publications/word_style/interim-template-style/interim-layout.docx)',
					'For additional details, please refer to the [ACM Template](https://www.acm.org/publications/proceedings-template) guide. TAICHI Full Papers should normally be **8 to 12 pages and no more than 12 pages** excluding references. For Chinese submissions, please use DFKai-SB and keep the same font size settings as the English paper format, following the ACM SIGCHI formatting guidelines.',
					'Pictorial',
					'For pictorial submissions, please prepare the manuscript according to the [ACM DIS2025](https://dis.acm.org/2025/call-for-pictorials/) guidelines. The template links below are provided for different editing tools:',
					'● [Pictorials InDesign Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-InDesign-template_Folder.zip)',
					'● [Pictorials Word Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-Word-template-Folder.zip)',
					'● [Pictorials Powerpoint Template](https://dis.acm.org/2025/wp-content/uploads/2024/11/DIS2021-Pictorials-PowerPoint-template-Folder.zip)',
					'TAICHI pictorials should normally be **8 to 12 pages and no more than 12 pages** excluding references. Please use the standard first-page layout. For Chinese submissions, use DFKai-SB and keep the same font size settings as the English paper format. All other pages may use a freer layout while still following ACM SIGCHI requirements.',
					'Notes',
					'● All submissions use **double-blind review**. Please upload an anonymized PDF file; non-anonymized submissions will be desk rejected. The PDF including attachments must be **under 20MB**. Please optimize the file in Acrobat while keeping the content clearly legible on screen.',
					'● Accepted papers will be included in the informal TAICHI 2026 online proceedings for download. Authors who prefer not to include the full paper may instead choose to have an abstract version included in the informal proceedings.',
					'● Whether a submitted paper may be converted to a poster after review will depend on the overall submission volume; authors are encouraged to submit in the format best suited to their work.',
					'Desk Reject Policy',
					'● If a submission is out of scope, has unclear or incomplete contributions, or does not follow the required format, the organizers reserve the right to conduct an initial screening and directly reject the paper before review (desk reject). Possible cases include:',
					'● ● __Scope__：The submission does not sufficiently review relevant literature or provide enough context to explain its novelty and contribution to design research or interactive systems. The paper should be grounded in prior research, design practice, or relevant domains, and its contribution should be commensurate with its length.',
					'● ● __Methodology__：The submission does not provide enough information about its methods and process, such as an unclear conceptual framework, incomplete argumentation, or insufficient methodological description and research transparency.',
					'● ● __Data__：The submission lacks sufficient data or evidence to support its analysis and claims, making its conclusions difficult to verify.',
					'Paper Chairs',
					'Yaliang Chuang / 莊雅量 / Department of Arts and Design, National Tsing Hua University',
					'Shan Yuan Teng / 鄧善元 / Department of Computer Science and Information Engineering, National Taiwan University',
					'Hsin-Ruey (Ray) Tsai / 蔡欣叡 / Department of Computer Science, National Chengchi University',
					'Yu-Chun (Grace) Yen / 顏羽君 / Department of Computer Science, National Yang Ming Chiao Tung University',
					'For paper submissions, please contact [taiwanchi26+paper@gmail.com](mailto:taiwanchi26+paper@gmail.com)',
				],
			},
			{
				...CONTENT_ZH.cfpSection.categories[1],
				title: 'Poster',
				description: [
					'Posters provide an opportunity for authors and conference participants to directly discuss work in progress or research that has already been presented at other venues. Accepted posters will be presented during the conference poster session, and at least one author must attend the conference and stand by the poster during the assigned session.',
					'Submission Format',
					'● Submissions should follow the ACM SIGCHI Publication Format (two-column) and must be submitted as a PDF.',
					'● Templates: [Latex](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip), [Overleaf](https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc), [Word](https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx)',
					'● TAICHI poster papers should normally be **4 pages** excluding references.',
					'● The paper should include an abstract, motivation, objective, method, current results, and a future research plan.',
					'● Only the paper needs to be uploaded at submission time. The poster file will be requested after acceptance.',
					'● All accepted posters will be considered for the Poster Paper Award, selected by anonymous voting from conference participants.',
					'Notes',
					'● Poster submissions use **non-anonymous review**. Please include all required author information in the paper. Please upload a non-anonymized PDF file; submissions without author information will be desk rejected.',
					'● The PDF including attachments must be under 20MB. Please optimize the file in Acrobat while keeping the content clearly legible on screen.',
					'● Accepted poster papers will be included in the informal TAICHI 2026 online proceedings for download. Authors who have concerns about full-paper inclusion may choose to have an abstract version included instead.',
					'● If the topic is outside the conference scope, the contribution is unclear or incomplete, or the paper does not follow the required format, the organizers reserve the right to desk reject the submission before review. Please refer to the Full Paper and Pictorial criteria.',
					'● TAICHI 2026 will be co-located with international events, and posters in English are strongly encouraged.',
					'Poster Chairs',
					'Chiu-Hsuan Wang / 王秋玄 / Postdoctoral Researcher, Department of Information Management, National Taiwan University',
					'Fu-Yin Cherng / 程芙茵 / Assistant Professor, Department of Computer Science and Information Engineering, National Cheng Kung University',
					'Wei-Ming Chung / 莊偉銘 / Lecturer, Department of Product Design, Ming Chuan University',
					'● For poster submissions, please contact [taiwanchi26+poster@gmail.com](mailto:taiwanchi26+poster@gmail.com)',
				],
			},
			{
				...CONTENT_ZH.cfpSection.categories[2],
				title: 'Interactivity and Demo',
				description: [
					'Demo submissions present implemented interactive concepts, techniques, devices, or systems directly at the conference. Accepted demos may be exhibited in booth format during the demo session.',
					'Submission Format',
					'● Submissions should follow the ACM SIGCHI Extended Abstract format and must be submitted as a PDF. Anonymization is not required. Please download the standard format from the ACM SIGCHI official CHI Publication Formats website.',
					'● Templates: [Latex](https://portalparts.acm.org/hippo/latex_templates/acmart-primary.zip), [Overleaf](https://www.overleaf.com/latex/templates/acm-conference-proceedings-primary-article-template/wbvnghjbzwpc), [Word](https://uist.acm.org/2023/assets/files/word-two-column-submission-sample.docx)',
					'● The submission is limited to **3 pages maximum** excluding references, using a **two-column layout**. Submissions may be written in Chinese or English. For Chinese text, please use DFKai-SB.',
					'● The paper should include an abstract, motivation, objective, method, current results, and a future research plan.',
					'● The title should begin with “Demo:”. If it is also a poster, use “Poster & Demo:”.',
					'● Authors are encouraged to upload a video so the interaction quality and system completeness can be better evaluated. Please compress the video with HandBrake and export it as an H.264 `.mp4` file before upload.',
					'● A completed “[Venue Requirement Form](https://docs.google.com/document/d/1uMsKeIa64dYQAFFQLggcIR7leRA1TC7Jc2RsYja3YTY)” must also be submitted. The demo chairs will use it to coordinate booth setup arrangements for the event day.',
					'● All accepted demos will be considered for the Demo Paper Award, selected by anonymous voting from conference participants.',
					'Notes',
					'● Accepted demos will be included in the informal TAICHI 2026 online proceedings for download. Authors who have concerns about full-paper inclusion may choose to have an abstract version included instead.',
					'● Please complete booth setup before the demo session begins on site.',
					'● TAICHI 2026 will be co-located with other international events, and presenting demo-related posters in English is encouraged.',
					'Demo Chairs',
					'Ching-Wen Hung / 洪靖雯 / PhD Candidate, Graduate Institute of Networking and Multimedia, National Taiwan University',
					'● For demo submissions, please contact [taiwanchi26+demo@gmail.com](mailto:taiwanchi26+demo@gmail.com)',
				],
			},
		],
	},
	newsSection: {
		...CONTENT_ZH.newsSection,
		subtitle: 'LATEST ANNOUNCEMENTS',
		loadMore: 'LOAD MORE',
		showLess: 'SHOW LESS',
		readMore: 'READ MORE',
		viewAll: 'VIEW ALL NEWS',
	},
	committeeSection: {
		...CONTENT_ZH.committeeSection,
		subtitle: 'COMMITTEE MEMBERS',
		aboutTitle: 'About TAICHI',
		aboutDescription: [
			'As computer science continues to rapidly evolve, computing has become embedded in every aspect of everyday life. The ways people communicate with computers have expanded, and the importance of human-computer interaction has grown accordingly. Because new forms of computing continue to emerge, HCI research constantly opens up new opportunities and important questions. Its findings are closely connected to industry services and products. Through the collective efforts of researchers across many domains, HCI scholarship in Taiwan has flourished and gained international visibility. To further promote research, development, and exchange in Taiwan, the Taiwan Association of Human-Computer Interaction was established in spring 2016 at the Department of Computer Science and Information Engineering, National Taiwan University, and formally approved in early summer of the same year.',
		],
		aboutButtonText: 'Association Website',
	},
	competitionSection: {
		title: 'COMPETITION',
		badge: 'COMING SOON',
		highlightTitle: 'Competition Details Coming Soon',
		description: 'TAICHI 2026 is preparing a new competition program. More details will be announced soon, so please stay tuned to the official website.',
	},
	familyFriendlySection: {
		...CONTENT_ZH.familyFriendlySection,
		seoDescription:
			'TAICHI 2026 welcomes family-accompanied participation and supports a more inclusive on-site experience.',
		headline: 'TAICHI 2026 Welcomes Families',
		intro: [
			'TAICHI 2026 warmly welcomes all attendees, and we are delighted to welcome your families as well.',
			'Our families are a source of support, inspiration, and strength. Whether they are partners, children, or parents, they accompany us through our journeys in research, work, and everyday life. For TAICHI, inviting families to be part of this academic gathering is both a natural and meaningful step.',
			'This year, TAICHI 2026 is launching its first family-friendly initiative, designed to help attendees who are coming with family members participate with greater peace of mind.',
		],
		demo: {
			...CONTENT_ZH.familyFriendlySection.demo,
			heading: 'Family-Friendly Demos',
			description:
				'We invited all demo teams to indicate whether their work is suitable for children. On-site, family-friendly works are marked with a “Family-Friendly Demo” sticker, so parents can explore interactive works together with their children based on age and interest.',
			stickerAlt: '“Family-Friendly Demo” sticker',
			photoAlt: 'Family-Friendly Demo sticker on-site',
		},
		hero: {
			...CONTENT_ZH.familyFriendlySection.hero,
			heading: 'Future HCIer',
			description:
				'Stop by the service desk to pick up a limited-edition kids’ name badge, and let your children become a TAICHI 2026 Future HCIer — a Little Hero ready to explore the future alongside the grown-ups.',
			imageAlt: 'Future HCIer kids’ name badge design',
			caption: 'Kids’ name badge · HERO',
		},
		closing: [
			'This is TAICHI’s first step toward a more family-friendly conference.',
			'Through this initiative, we hope to bring our academic community closer to everyday life and to support more researchers in taking part fully. If you plan to attend with family members, please let us know through the registration form so we can prepare in advance.',
			'We look forward to welcoming you and your family to TAICHI 2026.',
		],
		nearbyMap: {
			...CONTENT_ZH.familyFriendlySection.nearbyMap,
			heading: 'Nearby Map',
			description:
				'We provide a curated family-friendly guide to the area around the venue — nearby parks, kid-friendly rest spots, pharmacies, convenience stores, and more — with a Google Maps list so you can find and plan on the go.',
			categories: ['Parks', 'Kid-friendly rest spots', 'Pharmacies', 'Convenience stores'],
			buttonText: 'Open the nearby list on Google Maps',
		},
		facilitiesHeading: 'Syntrend Family-Friendly Facilities',
		facilities: [
			{ icon: 'toilet', label: 'Family Restrooms', floors: 'B2, 3F, 5F, 7F, 8F, 9F, 12F' },
			{ icon: 'baby', label: 'Diaper Changing Stations', floors: 'B2, 2F-9F' },
			{ icon: 'milk', label: 'Nursing Room', floors: '7F' },
			{ icon: 'accessibility', label: 'Accessible Restrooms', floors: '2F, 4F, 6F, 8F, 9F' },
			{ icon: 'droplets', label: 'Water Fountains', floors: '2F, 3F, 4F, 5F, 6F, 7F, 8F, 9F' },
		],
		facilitiesSourceLabel: 'Source: Syntrend Creative Park official website',
		facilitiesSourceUrl: 'https://www.syntrend.com.tw/service',
	},
	sponsorshipSection: {
		...CONTENT_ZH.sponsorshipSection,
		seoTitle: 'Sponsorship',
		seoDescription:
			'TAICHI 2026 sincerely invites companies and organizations to support the 12th Taiwan CHI conference. Download the full sponsorship invitation and prospectus.',
		pageTitle: 'Sponsorship',
		kicker: 'TAICHI 2026 SPONSORSHIP',
		headline: 'Let’s make the future go Big Bang!',
		paragraphs: [
			'TAICHI 2026 takes place on August 5–6 at Syntrend Creative Park and National Taipei University of Technology in Taipei. This year’s theme, “Big Bang! Futures”, brings the universe’s first explosive moment into the city — a future you can walk through, play with, and experience together, through interactive installations, experimental works, and a night-market-style space where everyone can feel how technology shapes the way we’ll live.',
			'This year is different: on August 5 we join forces at Syntrend with the NSTC Taiwan Chip-based Humanities initiative, the Asia-Pacific APMAR, and the technology-art society ISAT — bringing academia, exhibition, and the public together in one shared field, with a large turnout of scholars, industry partners, and the public expected.',
			'TAICHI is the Taiwan HCI community’s most important annual gathering, held every year since 2015 and drawing hundreds of scholars, industry partners, and students. Our members’ work regularly appears at top international venues such as CHI, UIST, CSCW, Ubicomp, and DIS.',
			'We warmly invite you to become a sponsor this year — to put your brand alongside some of the most creative people around, and make Taiwan’s future experience go Big Bang together. The sponsorship plans are below; we look forward to partnering with you.',
		],
		highlightsTitle: 'Event Highlights',
		highlights: [
			{ label: 'DATE', value: 'Aug 5 – 6, 2026' },
			{ label: 'VENUE', value: 'Syntrend Creative Park × NTUT' },
			{ label: 'THEME', value: 'Big Bang! Futures' },
			{ label: 'CO-HOSTED', value: 'Chip-based Humanities × APMAR × ISAT' },
			{ label: 'COMMUNITY', value: 'Hundreds of scholars, industry & students yearly' },
		],
		plansTitle: 'Sponsorship Plans',
		plansIntro:
			'The following sponsorship plans are available. If none fits your organization’s needs, you are welcome to contact us to discuss other options.',
		tierNames: ['Diamond', 'Platinum', 'Gold', 'Silver'],
		planRows: [
			{ label: 'Amount (NT$)', values: ['80,000', '50,000', '30,000', '15,000'] },
			{ label: 'Complimentary tickets', values: ['8', '6', '3', '2'] },
			{ label: 'Logo on conference website', values: ['✓', '✓', '✓', '✓'] },
			{
				label: 'On-site logo display',
				values: ['Stage, podium, registration & venue signage', 'Stage, podium, registration & venue signage', 'Stage, podium, registration & venue signage', 'Stage, podium, registration & venue signage'],
			},
			{ label: 'Online handbook (program) logo', values: ['Logo + promo copy', 'Logo + promo copy', 'Logo + promo copy', 'Logo only'] },
			{ label: 'Dedicated exhibition booth', values: ['1 set / 2 booths', '1 set / 1 booth', '1 set / 1 booth', '—'] },
			{ label: 'Flyer at registration desk', values: ['✓', '✓', '✓', '—'] },
			{ label: 'On-site video rotation', values: ['✓ (30 sec)', '✓ (10 sec)', '✓ (5 sec)', '—'] },
			{ label: 'Aug 5 Interactive Night Market', values: ['Logo + stage intro (8 min)', 'Logo + stage intro (5 min)', 'Logo display', '—'] },
		],
		plansNoteTitle: 'Notes',
		plansNotes: [
			'Please contact the organizing team to confirm sponsorship items before completing the sponsorship agreement.',
			'Please complete payment within one week of confirming your sponsorship items so promotional preparations can proceed.',
			'Plans and on-site space are limited; the organizers reserve related decisions on a first-paid, first-served basis.',
		],
		pdfHeading: 'Full Sponsorship Invitation & Prospectus',
		pdfDescription: 'Sponsorship tiers, benefits, and how to sign up are detailed in the full document. You are welcome to download it.',
		pdfButtonText: 'Download Sponsorship Prospectus (PDF)',
		processTitle: 'Sponsorship Process',
		processSteps: [
			{
				title: 'Step 1 | Confirm sponsorship items',
				body: [
					'Sponsorship contact: Max Chen, Dept. of Information Management, Ming Chuan University | 0952-702363 | maxchen@mail.mcu.edu.tw',
					'Payment contact: June Lai, Taiwan CHI society | 02-33664888 ext. 503 | june@cmlab.csie.ntu.edu.tw',
				],
			},
			{
				title: 'Step 2 | Send the sponsorship agreement',
				body: ['Email or fax the [Sponsorship Agreement] to June Lai (june@cmlab.csie.ntu.edu.tw) and Max Chen (maxchen@mail.mcu.edu.tw).'],
			},
			{
				title: 'Step 3 | Make payment',
				body: ['Account name: Taiwan Association for Computer-Human Interaction', 'Bank: Hua Nan Commercial Bank (code 008)', 'Account no.: 154-10-009173-1'],
			},
			{
				title: 'Step 4 | Payment notification',
				body: [
					'After payment, email June Lai (june@cmlab.csie.ntu.edu.tw) and Max Chen (maxchen@mail.mcu.edu.tw) with:',
					'1. The last five digits of the paying account',
					'2. The name and phone number of the paying company’s contact person',
				],
			},
		],
		contactHeading: 'Sponsorship Inquiries',
		contactText: 'For any sponsorship-related questions, please contact the organizing team:',
	},
	keynoteSection: {
		title: 'KEYNOTE SPEAKERS',
		subtitle: 'INVITED TALKS',
		tbd: 'Speakers TBD',
	},
	programSection: {
		title: 'AGENDA',
		subtitle: 'CONFERENCE SCHEDULE',
		viewDetail: 'SESSION // ',
		backToIndex: 'BACK TO AGENDA',
		viewProject: 'SESSION // ',
		agendaTba: 'Agenda to be announced.',
		chairsLabel: 'Chairs',
	},
	programPageSection: {
		title: 'Program',
		dateTabs: [
			{ key: 'day1', date: '8.05', day: 'WED' },
			{ key: 'day2', date: '8.06', day: 'THU' },
		],
		labels: {
			scheduleTitle: 'Full Schedule',
			photoPlaceholder: 'Photo',
			timeLocationLabel: 'Time / Location',
			websiteButtonLabel: 'Event Details',
		},
		day1: {
			// Day1 is a single joint event (title/description used to hang under the hero image on both days; now Day1-only)
			title: 'Joint event by TAICHI, Program on Semiconductors and Humanities, APMAR, and ISAT',
			description: 'Big Bang! Futures! is jointly organized by the Program on Semiconductors and Humanities, TAICHI, APMAR, and ISAT — bringing together technology, humanities, art, and design to unlock the many possibilities of the future.',
			time: '09:20 - 20:00',
			location: '5F Exhibition Hall & 12F Multi-purpose Hall, Syntrend Creative Park, Taipei',
			websiteUrl: 'https://humanities-ic.tw/',
			// Timetable: hourly axis + venue blocks sized proportionally to their duration (details live on the official site)
			venueColumns: { time: 'Time', f5: '5F Exhibition Hall', f12: '12F Multi-purpose Hall' },
			// Block display names are bilingual brand strings, identical across languages (\n = line break)
			venueBlocks: {
				f5: { title: '未來演講\nFuture Stage', tags: ['Keynotes', 'Panels', 'International Exchange'] },
				f12: { title: '互動夜市\nBig Bang!\nNight Market!', tags: ['Demo', 'Poster', 'Performances', 'Food', 'Market'] },
			},
			sessions: [
				{
					id: 'day1-5f',
					title: 'Big Bang! Futures Stage',
					tagline: 'Hear ideas. Shape futures.',
					time: '09:20 - 16:40',
					location: '5F Exhibition Hall, Syntrend Creative Park, Taipei',
					tags: ['Keynotes', 'Panels', 'International Exchange'],
					description: 'From keynote talks and panel discussions to research presentations, discover diverse perspectives, exchange ideas, and unlock new possibilities for the future.',
					websiteUrl: 'https://humanities-ic.tw/',
					gradient: true,
					schedule: [
						{ time: '9:20 - 9:45', label: 'Registration' },
						{ time: '9:45 - 10:00', label: 'Opening' },
						{
							time: '10:00 - 11:00',
							label: 'Jun Rekimoto',
							sublabel: 'Professor Emeritus, University of Tokyo / Director, Sony CSL Kyoto',
							featured: true,
							fullBio:
								'Jun Rekimoto received his Ph.D. in Information Science from the Tokyo Institute of Technology in 1996. Since joining Sony Computer Science Laboratories (Sony CSL) in 1994, he has led pioneering research in Human-Computer Interaction, augmented reality, and Human Augmentation. He founded the Interaction Laboratory in 1999 and currently directs Sony CSL Kyoto Laboratory. Rekimoto is also Professor Emeritus of the University of Tokyo. His projects include NaviCam, one of the world’s first handheld AR systems, CyberCode, an early marker-based AR platform, and SmartSkin, a foundational multitouch technology. His recent work explores Human-AI Integration, silent speech interfaces, and the Internet of Abilities (IoA). He has received numerous honors, including ACM SIGCHI Academy membership and two ACM UIST Lasting Impact Awards.',
						},
						{
							time: '11:05 - 12:05',
							label: 'Pedro Lopes',
							sublabel: 'Associate Professor of Computer Science, University of Chicago',
							featured: true,
							fullBio:
								'Pedro Lopes is an Associate Professor of Computer Science at University of Chicago, who focuses on integrating computer interfaces with the human body. His novel types of computers augment the body, not just cognitively, but physically. Pedro’s work has received several awards, such as eight ACM CHI/UIST Best Papers, and captured the interest of the public in outlets such as the New York Times, and more. Pedro is the technical program chair of CHI 2026, a Sloan fellow, and a recipient of the NSF CAREER Award and IEEE VR New Significant Researcher Award.',
						},
						{ time: '12:05 - 13:30', label: 'Lunch' },
						{
							time: '13:30 - 14:30',
							label: 'Huaishu Peng',
							sublabel: 'Associate Professor of Computer Science, University of Maryland',
							featured: true,
							fullBio:
								'Huaishu Peng is an Associate Professor of Computer Science at the University of Maryland and director of the Small Artifacts Lab (SMART Lab). He explores tangible computing through an interdisciplinary research agenda that makes electronics more repairable, interfaces more accessible, and technology a medium for cultural expression. His work has appeared at CHI, UIST, and SIGGRAPH, earning multiple Best Paper and Honorable Mention awards, and has been featured widely in the media, including Wired, MIT Technology Review, TechCrunch, and Gizmodo. He is also a recipient of the NSF Award to Advance Semiconductor Learning.',
						},
						{
							time: '14:35 - 15:35',
							label: 'Andrea Bianchi',
							sublabel: 'Associate Professor, Department of Industrial Design / Joint Associate Professor, School of Computing, KAIST',
							featured: true,
							fullBio:
								'Andrea Bianchi is an Associate Professor in the Department of Industrial Design and a joint Associate Professor in the School of Computing at KAIST, where he directs the Make Lab. His research focuses on human-computer interaction (HCI), with an emphasis on prototyping tools for interactive systems and augmented on-body hardware for mixed reality (MR). Before joining KAIST, he taught in the Department of Computer Science at Sungkyunkwan University in Korea and worked as a video game programmer at a startup in New York. Andrea’s research has been published at top international venues including ACM CHI, UIST, and IMWUT, earning best paper and design awards and coverage from Engadget, ZDNet, New Scientist, MAKE, and Gizmodo. He received his PhD from KAIST in 2012 and his master’s degree from New York University in 2007.',
						},
						{ time: '15:35 - 15:40', label: 'Coffee Break' },
						{ time: '15:40 - 16:40', label: 'Panel', sublabel: 'Jun Rekimoto, Huaishu Peng, Andrea Bianchi', featured: true },
					],
				},
				{
					id: 'day1-12f',
					title: 'Big Bang! Night Market',
					tagline: 'Come for the food. Stay for the future.',
					time: '15:30 - 20:00',
					location: '12F Multi-purpose Hall, Syntrend Creative Park, Taipei',
					tags: ['Demo', 'Poster', 'Performances', 'Food', 'Market'],
					description: 'More than a night market, this is where technology, culture, and creativity collide. Wander through interactive demos, research posters, live coding, projection puppetry, and curated night market food to discover your own multiverse of futures.',
					websiteUrl: 'https://humanities-ic.tw/',
					gradient: false,
					schedule: [
						{ time: '15:30', label: 'Welcome' },
						{ time: '17:30', label: 'Opening Show' },
						{ time: '17:45', label: 'ISAT Award' },
						{
							time: '18:00',
							label: 'National Yang Ming Chiao Tung University | Experience Design Lab',
							sublabel: '"Future Budaixi: Illusion and Cosmos" — Mixed Reality × Contemporary Dance Immersive Performance',
							featured: true,
							fullBio: 'Team: Chun-Cheng Hsu, Wei-Chen Yen, Yi-Jen Lin\nPerformers: Yi-Jen Lin, Siang-Fu Zeng\nPuppetry Master: Yong-Ting Lai',
							workDescription:
								'"Future Budaixi: Illusion and Cosmos" brings together Taiwanese glove puppetry (Budaixi), mixed reality (MR), and contemporary dance in an immersive performance experience. The performance opens with a traditional narration by a Budaixi puppeteer, guiding Sun Wukong and a Dan character across the boundary between the physical and virtual worlds. As the puppets transcend the confines of the palm stage, dancers interact with MR technology, virtual puppets, and flowing particle effects, extending puppeteering gestures into full-body movement. Through this process of digital translation, the embodied aesthetics of Budaixi are reimagined, creating an immersive future theater where tradition and technology converge.',
						},
						{
							time: '18:10',
							label: 'Chiao-Wei Ho',
							sublabel: '"unix_time"',
							featured: true,
							fullBio:
								'Hochiaowei Practices is an independently run creative collective: DML (Digital Medicine Lab) focuses on speculative design and new-media creation and research; TPS Press (tshut-pán-siā) promotes culturally critical, experimental design publications through independent publishing; the sound project KIKORI Collective, through live coding and the TOPLAP NTUST community, turns sound into a freely usable creative medium; and the teaching experiment SNN (School of New Now) focuses on teaching open-source-oriented creative tools and methods so that knowledge can be shared equally.',
							workHeading: 'Opening Show: "unix_time"',
							workDescription:
								'"unix_time" is an electronic sound piece generated through live coding. Built from numbers, countdowns, alarms, and system notification sounds, it organizes a string of otherwise meaningless digits, live, into a sound structure that keeps closing in on an endpoint.\n\nAbstract numbers carry no event in themselves — they are simply arranged symbols. But once they begin running as a countdown, that string of symbols takes on a sense of direction. The piece doesn’t try to make the countdown stand for any specific “symbol”; instead, it treats the countdown as an empty structure. As the numbers close in on the end, what’s really being heard isn’t some definite event, but how we install an imagined future into a string of digits.',
						},
						{ time: '20:00', label: 'Bye Bye' },
					],
				},
			],
			performance: {
				title: 'Performance Area',
				cards: [
					{
						name: 'Vibe Coding Stage',
						description: 'Not a DJ set, not a traditional performance — this is code brought to the stage. Creators write code live with AI and live coding, letting sound, visuals, and interaction emerge together in front of the audience. Every show is unrepeatable — each one is a Big Bang that exists only in the moment.',
					},
					{
						name: 'TOPLAP NTUST',
						description: 'TOPLAP NTUST is an electronic music collective centered on live coding, combined with real-time visuals and live performance. Carrying on the spirit of the international TOPLAP and Algorave movements, it turns live-generated sound and image into an ever-evolving music culture and lifestyle.',
						toggleLabel: 'Performance Order',
						toggleContent:
							'1. Ting Yi\n2. Heng-Hao Wang\n3. Cong-Wei Wang\n4. I-Kai Liao\n5. Ai-Yun Chiu\n6. En-Yu Liu\n7. Ching-Hao Chan\n8. Pei-Chen Lin\n9. Zec Lai\n10. Ruei-Shan Tsai',
					},
				],
				// TODO: word order looks garbled in the source copy — should likely read "To close the performance area, the audience is welcome to take the stage and join the live coding!"
				closingLine1: 'To close the performance area, the audience is welcome to take the stage,',
				closingLine2: 'and join the live coding!',
			},
			residency: {
				title: 'Cardboard Chair Showcase',
				introTitle: 'More Than Just a Chair',
				introInstructor: 'Instructor: Assistant Professor Cheng Yu-Ting, Department of Design',
				introDescription: 'The cardboard chairs are a signature outcome of the first-year "Basic Design" course in the Department of Design at National Taiwan University of Science and Technology. Using only a single 100 × 200 cm sheet of corrugated cardboard — no glue or any other material — students built a weight-bearing chair through cutting, folding, and joint structures alone. The pieces on display are selected from the course and repurposed as public seating for the Big Bang! Futures rest area, bringing design out of the classroom and into the exhibition, and inviting every visitor to experience the creativity and possibility of design firsthand.',
				cards: [
					{
						name: 'Rice Stool',
						description: 'Named for its side profile, which resembles the Chinese character for "rice" (米). Through soft curves and a stacked-cardboard construction technique, it balances aesthetics and load-bearing strength within limited materials — turning simple cardboard into a stool that is comfortable, sturdy, and charming.',
						toggleLabel: 'Designer Bio',
						toggleContent:
							'Kiki Wu\n\nFirst-year undergraduate student in the Department of Design at National Taiwan University of Science and Technology, the designer of Rice Stool.I like to start with playful ideas, believing that aesthetics attract attention, while functionality keeps people engaged. My goal is to create designs that are both delightful and practical.',
					},
					{
						name: 'ㄇ Chair',
						description: 'Assembled from four ㄇ-shaped (Zhuyin/Bopomofo) cardboard panels, this chair takes its name from and carries Taiwan’s unique Zhuyin phonetic culture. The design maximizes load-bearing capacity along the cardboard’s vertical grain while minimizing damage to its structural integrity — achieving both strong support and a minimalist aesthetic with just four pieces.',
						toggleLabel: 'Designer Bio',
						toggleContent:
							'Alger Yu\n\nFirst-year undergraduate student in the Department of Design at National Taiwan University of Science and Technology, the designer of ㄇ Chair.I enjoy thinking deeply about design. Rather than relying solely on intuition, I prefer to begin with careful reflection, developing a clear logic or methodology that guides a series of designs and creative works.',
					},
				],
			},
			food: {
				title: 'Food',
				cards: [
					{
						name: 'CANCAN',
						// TODO: real copy for CANCAN pending (the Figma source has unrelated placeholder text here, not reused)
						description: '',
					},
					{
						name: 'Lao Ji An Healing Herbar',
						description: 'Founded in 1972, Lao Ji An carries on three generations of herbal-tea craft from Wanhua’s Herb Lane, continually reinterpreting Taiwanese herbal tea with new flavors. For this collaboration with Big Bang! Futures, a limited herbal blend brings local tradition together with visions of the future.',
						longform: true,
					},
				],
				promo: {
					heading: 'Limited Edition Collab Drinks',
					items: ['Name TBD by Lao Ji An [Alcoholic]', 'Big Bang! × Lao Ji An Herbal Tea Collab [Non-Alcoholic]'],
				},
			},
		},
		day2: {
			// Second venue confirmed: 6th Teaching Building Room 427; the three afternoon meetings run together as one block
			venueHeaders: { main: 'International Conference Hall', second: '6th Teaching Building, Room 427' },
			secondVenue: {
				events: [
					{ time: '12:00 - 14:20', title: 'General Assembly + Board Meeting + ACM SIGCHI Taipei Chapter Election Meeting' },
				],
			},
			sessions: [
				{
					id: 'day2-taichi',
					title: 'TAICHI Annual Society Meeting',
					time: '08:00 - 17:00',
					location: 'National Taipei University of Technology, Hongyu Technology Building B1 International Conference Hall',
					// kind: 'break' = non-session slots (registration/breaks/lunch), rendered as muted dashed blocks
					schedule: [
						{ time: '08:30 - 09:00', label: 'Registration', kind: 'break' },
						{ time: '09:00 - 09:50', label: 'Paper Session I' },
						{ time: '09:50 - 10:00', label: 'Break', kind: 'break' },
						{ time: '10:00 - 10:50', label: 'Paper Session II' },
						{ time: '10:50 - 11:10', label: 'Poster session', sublabel: '(Coffee Break)', kind: 'break' },
						{ time: '11:10 - 12:00', label: 'Graduate Thesis Award Presentations' },
						{ time: '12:00 - 13:30', label: 'Lunch Break', kind: 'break' },
						{ time: '13:30 - 14:20', label: 'Paper Session III' },
						{ time: '14:20 - 14:30', label: 'Break', kind: 'break' },
						{ time: '14:30 - 15:20', label: 'Paper Session IV' },
						{ time: '15:20 - 15:40', label: 'Poster session', sublabel: '(Coffee Break)', kind: 'break' },
						{ time: '15:40 - 16:20', label: 'Award / Closing / TAICHI 2027' },
					],
				},
			],
		},
		// Presentation lists: entries (proper nouns) are shared from CONTENT_ZH; only labels and slot strings are localized here.
		programLists: {
			labels: {
				sectionTitle: 'Presentation List',
				idCol: 'ID',
				titleCol: 'Title',
				authorCol: 'Authors',
				note: 'Listed by presentation slot; actual placement follows on-site announcements.',
			},
			day1: {
				demo: {
					...CONTENT_ZH.programPageSection.programLists.day1.demo,
					slot: 'Aug 05 · Big Bang! Night Market (12F, Syntrend Creative Park)',
				},
				poster: {
					...CONTENT_ZH.programPageSection.programLists.day1.poster,
					slot: 'Aug 05 · Big Bang! Night Market (12F, Syntrend Creative Park)',
				},
			},
			day2: {
				paper: {
					...CONTENT_ZH.programPageSection.programLists.day2.paper,
					slot: 'Aug 06 · TAICHI Society Meeting, International Conference Hall',
				},
				poster: {
					...CONTENT_ZH.programPageSection.programLists.day2.poster,
					slot: 'Aug 06 · Poster Session (Coffee Break 10:50–11:10 / 15:20–15:40)',
				},
			},
		},
	},
	venueSection: {
		...CONTENT_ZH.venueSection,
		subtitle: 'VENUE PLAN',
		openMap: 'OPEN MAP',
		overview: {
			title: 'Overview',
			intro:
				'TAICHI 2026 is part of a larger cross-disciplinary event series running from 2026/08/03 to 2026/08/06, co-organized with the Program on Semiconductors and Humanities, APMAR, and ISAT. Together, these events shape one connected field spanning research, exhibition, performance, and public participation. APMAR begins on 8/3 and 8/4, the four organizations jointly open to the public on 8/5, and TAICHI continues with the conference program on 8/6.',
			events: {
				preEvent: {
					date: '2026/08/03–04 [APMAR]',
					description: [
						'APMAR opens the series on 8/3 and 8/4 with a program centered on artistic research, interdisciplinary practice, and international exchange.',
						'Use the link below to view the official APMAR program and website.',
					],
					buttonLabel: 'Open APMAR Website',
					buttonType: 'external',
					href: 'https://sites.google.com/view/apmar2026/',
					image: '/images/overview-02.jpg',
				},
				day1: {
					date: '2026/08/05 [TAICHI × Semiconductors and Humanities × APMAR × ISAT]',
					description: [
						'On 8/5, Syntrend Creative Park hosts the joint public day featuring international keynotes, an interactive night market, performances, and open participation.',
						'Use the button below to jump to the 8/5 venue details.',
					],
					buttonLabel: 'View 8/5 Venue Details',
					buttonType: 'section',
					target: 'venue-day-1',
					image: '/images/overview-03.jpg',
				},
				day2: {
					date: '2026/08/06 [TAICHI]',
					description: [
						'On 8/6, National Taipei University of Technology hosts the TAICHI annual conference with paper presentations, forums, and academic exchange.',
						'Use the button below to jump to the 8/6 venue details.',
					],
					buttonLabel: 'View 8/6 Venue Details',
					buttonType: 'section',
					target: 'venue-day-2',
					image: '/images/overview-04.jpg',
				},
			},
			timeline: [
				{ label: '8/3', sublabel: 'APMAR', key: 'preEvent' },
				{ label: '8/4', sublabel: 'APMAR', key: 'preEvent' },
				{ label: '8/5', sublabel: 'TAICHI, Semiconductors and Humanities / APMAR, ISAT', key: 'day1' },
				{ label: '8/6', sublabel: 'TAICHI', key: 'day2' },
			],
		},
		days: [
			{
				...CONTENT_ZH.venueSection.days[0],
				heroTitle: '8/5(Wed): Night Market',
				heroBadge: 'OPEN TO PUBLIC',
				heroSubtitle: 'Joint event by TAICHI, Program on Semiconductors and Humanities, APMAR, and ISAT',
				highlight: {
					label: 'Venue',
					venue: 'Syntrend Creative Park, 5F and 12F',
					details: ['5F international keynote talks', '12F interactive night market, snacks, and Live Coding performances'],
					scheduleLabel: 'Full Schedule',
					scheduleTo: '/program#day1',
				},
				venues: [
					{ ...CONTENT_ZH.venueSection.days[0].venues[0], title: '5F CLAPPER STUDIO [Syntrend Creative Park]', addressLabel: 'Address', venueLabel: 'Venue', venueName: '5F CLAPPER STUDIO hosts international keynote talks.' },
					{ ...CONTENT_ZH.venueSection.days[0].venues[1], title: '12F SYNTREND SHOW [Syntrend Creative Park]', addressLabel: 'Address', venueLabel: 'Venue', venueName: 'Interactive night market, snacks, and Live Coding performances.' },
				],
				travelPanels: [
					{ title: 'Public Transportation', items: [{ title: 'MRT', lines: ['Bannan Line / Zhongxiao Xinsheng Station Exit 1, about a 3-minute walk', 'Zhonghe-Xinlu Line / Zhongxiao Xinsheng Station Exit 1, about a 3-minute walk'] }, { title: 'Bus', lines: ['Multiple routes stop near Syntrend Creative Park and Guanghua Market'] }] },
					{ title: 'Driving', items: [{ title: 'Parking', lines: ['Syntrend parking lot', 'Parking lots near Guanghua Digital Plaza', 'Jianguo elevated roadway parking'] }], calloutTitle: 'Recommendation', callout: 'Public transport is recommended. If driving, allow extra time for parking and queues.' },
				],
			},
			{
				...CONTENT_ZH.venueSection.days[1],
				heroTitle: '8/6(Thu): Annual Conference',
				heroSubtitle: 'TAICHI annual conference',
				highlight: { label: 'Venue', venue: 'NTUT Hongyu Technology Building', details: ['Paper presentations and forum sessions'], scheduleLabel: 'Full Schedule', scheduleTo: '/program#day2' },
				venues: [{ ...CONTENT_ZH.venueSection.days[1].venues[0], title: 'B1 International Conference Hall [Hongyu Technology Building]', addressLabel: 'Address', venueLabel: 'Venue', venueName: 'Paper presentations and talks.' }],
				travelPanels: [
					{ title: 'Public Transportation', items: [{ title: 'MRT', lines: ['Bannan Line / Zhongxiao Xinsheng Station Exit 4, about a 5-minute walk', 'Transfer from Wenhu Line at Zhongxiao Fuxing and continue on foot or by bus'] }, { title: 'HSR / TRA', lines: ['From Taipei Main Station, transfer to the Bannan Line and exit at Zhongxiao Xinsheng'] }, { title: 'Bus', lines: ['Multiple routes stop near Zhengyi Post Office and NTUT'] }] },
					{ title: 'Driving', items: [{ title: 'Parking', lines: ['Parking lots around NTUT', 'Jianguo elevated roadway parking', 'Street parking near the campus'] }], calloutTitle: 'Recommendation', callout: 'Parking near the campus is limited. Consider arriving early or taking the MRT.' },
				],
			},
		],
	},
	venueV2Section: {
		...CONTENT_ZH.venueV2Section,
		subtitle: 'TRANSIT PLAN',
		openMap: 'OPEN MAP',
		overview: {
			title: 'Overview',
			intro:
				'TAICHI 2026 is part of a larger cross-disciplinary event series running from 2026/08/03 to 2026/08/06, co-organized with the Program on Semiconductors and Humanities, APMAR, and ISAT. Together, these events shape one connected field spanning research, exhibition, performance, and public participation. APMAR begins on 8/3 and 8/4, the four organizations jointly open to the public on 8/5, and TAICHI continues with the conference program on 8/6.',
			events: {
				preEvent: {
					date: '2026/08/03–04 [APMAR]',
					description: [
						'APMAR opens the series on 8/3 and 8/4 with a program centered on artistic research, interdisciplinary practice, and international exchange.',
						'Use the link below to view the official APMAR program and website.',
					],
					buttonLabel: 'Open APMAR Website',
					buttonType: 'external',
					href: 'https://sites.google.com/view/apmar2026/',
					image: '/images/overview-02.jpg',
				},
				day1: {
					date: '2026/08/05 [TAICHI × Semiconductors and Humanities × APMAR × ISAT]',
					description: [
						'On 8/5, Syntrend Creative Park hosts the joint public day featuring international keynotes, an interactive night market, performances, and open participation.',
						'Use the button below to jump to the 8/5 venue details.',
					],
					buttonLabel: 'View 8/5 Venue Details',
					buttonType: 'section',
					target: 'venue-day-1',
					image: '/images/overview-03.jpg',
				},
				day2: {
					date: '2026/08/06 [TAICHI]',
					description: [
						'On 8/6, National Taipei University of Technology hosts the TAICHI annual conference with paper presentations, forums, and academic exchange.',
						'Use the button below to jump to the 8/6 venue details.',
					],
					buttonLabel: 'View 8/6 Venue Details',
					buttonType: 'section',
					target: 'venue-day-2',
					image: '/images/overview-04.jpg',
				},
			},
			timeline: [
				{ label: '8/3', sublabel: 'APMAR', key: 'preEvent' },
				{ label: '8/4', sublabel: 'APMAR', key: 'preEvent' },
				{ label: '8/5', sublabel: 'TAICHI, Semiconductors and Humanities / APMAR, ISAT', key: 'day1' },
				{ label: '8/6', sublabel: 'TAICHI', key: 'day2' },
			],
		},
		days: [
			{
				...CONTENT_ZH.venueV2Section.days[0],
				heroTitle: '8/5(Wed): Night Market',
				heroBadge: 'OPEN TO PUBLIC',
				heroSubtitle: 'Joint event by TAICHI, Program on Semiconductors and Humanities, APMAR, and ISAT',
				highlight: {
					label: 'Venue',
					venue: 'Syntrend Creative Park, 5F and 12F',
					details: ['5F international keynote talks', '12F interactive night market, snacks, and Live Coding performances'],
					scheduleLabel: 'Full Schedule',
					scheduleTo: '/program#day1',
				},
				venue: {
					...CONTENT_ZH.venueV2Section.days[0].venue,
					sectionTitle: 'Getting Here',
					name: 'Syntrend Creative Park',
					addressLabel: 'Address',
					address: 'No. 2, Sec. 3, Civic Blvd., Zhongzheng Dist., Taipei City 100013',
					schedule: ['09:20 - 16:40　5F Exhibition Hall (elevator & escalator)', '15:30 - 20:00　12F Multi-purpose Hall (elevator only)'],
					entryNote: 'Before 11:00 the general entrances and escalators are not open yet — please enter via the Pumpkin Gate Entry Guide below and take the elevator up to 5F.',
				},
				entryGuide: {
					title: 'Pumpkin Gate Entry Guide',
					// badge: 'Before 11:00',
					before: { timeLabel: 'Arriving before 11:00', text: 'Enter via the "Pumpkin Gate", follow the blue pumpkin floor markers to the entrance, and take the elevator directly to 5F.' },
					after: { timeLabel: 'Arriving after 11:00', text: 'Enter the 5F and 12F venues through any main entrance of Syntrend Creative Park.' },
					gateMapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d600.1116542769362!2d121.5310313!3d25.0456191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a90012baaa2b%3A0x5c9a4c36e5dc7582!2z5Y2X55Oc6ZaA!5e0!3m2!1szh-TW!2stw!4v1772020903779!5m2!1szh-TW!2stw',
					sticker: { image: '/images/pumpkin-ground-marker.png', alt: 'Green pumpkin floor marker' },
					locators: [
						{ image: '/images/transit_syntrend_scene.png', caption: 'Pumpkin Gate', alt: 'Mirror pumpkin sculpture and entrance at Syntrend Creative Park' },
						{ image: '/images/transit_syntrend_map.png', caption: 'Area map', alt: 'Syntrend Creative Park area map with Pumpkin Gate location' },
					],
					routeMap: { image: '/images/transit_syntrend_route.png', caption: 'Elevator route', alt: 'Indoor route map showing the Pumpkin Gate entrance and elevator location' },
					videos: [
						{ label: 'Route from the left', src: '/videos/pumpkin-left.mp4' },
						{ label: 'Route from the right', src: '/videos/pumpkin-right.mp4' },
					],
				},
				travelPanels: [
					{
						title: 'Public Transportation',
						items: [
							{ title: 'MRT', lines: ['Zhonghe-Xinlu Line or Bannan Line, Zhongxiao Xinsheng Station Exit 1, about a 5-minute walk.'] },
							{ title: 'Bus', stops: [
								{ name: 'Bade Rd. "Taipei Tech Station"', routes: ['205', '257', '276'] },
								{ name: 'Civic Blvd. "Guanghua Market Station"', routes: ['669'] },
								{ name: 'Xinsheng N. Rd. "Guanghua Market Station"', routes: ['72', '109', '214', '214 Exp.', '222', '226', '280', '280 Exp.', '290', '505', '642', '643', '665', '668', '675', '676', '680'] },
							] },
						],
					},
					{
						title: 'Driving',
						items: [
							{ title: 'Civic Blvd. Expressway (westbound)', lines: ['Exit at Civic Blvd. Sec. 3 / Jianguo S. Rd., continue and use the U-turn on Civic Blvd. Sec. 2 back to Sec. 3, then pass the Jinshan N. Rd. intersection to arrive.'] },
							{ title: 'Civic Blvd. Expressway (eastbound)', lines: ['Exit at Civic Blvd. Sec. 3 / Jinshan N. Rd., continue past the Jinshan N. Rd. intersection to arrive.'] },
							{ title: 'Xinsheng Expressway (southbound)', lines: ["Exit at Xinsheng N. Rd. Sec. 1 / Chang'an E. Rd. Sec. 2, keep right along Xinsheng N. Rd. onto Jinshan N. Rd. southbound, U-turn to Jinshan N. Rd. northbound, then continue to the Civic Blvd. intersection."] },
						],
					},
					{
						title: 'Parking',
						wide: true,
						image: { src: '/images/transit_syntrend_parking.png', alt: 'Map of the Syntrend parking lot entrance', caption: 'Syntrend parking entrance (Jinshan N. Rd. / under Xinsheng Expressway)' },
						items: [
							{ title: 'CityParking Syntrend Lot (under Xinsheng Expressway)', lines: ['Address: No. 23-77, Jinshan N. Rd., Zhongzheng Dist., Taipei 100'], rates: [{ label: 'Car', value: 'NT$30 / 30 min on weekdays (max NT$200/day)' }, { label: 'Scooter', value: 'NT$20 per entry' }], notes: ['Billed per 30 minutes; free within the first 10 minutes.', 'Disability ID holders get 4 hours free at the B3 parking office; from the 5th hour, in-mall purchases can be applied.', 'Payment machines accept cash, EasyCard, and contactless credit cards.'] },
						],
						links: [
							{ label: 'Parking location', href: 'https://maps.app.goo.gl/rQtA9WjDgtkUs6S59' },
							{ label: 'Syntrend transport info', href: 'https://www.syntrend.com.tw/traffic.html' },
						],
					},
				],
			},
			{
				...CONTENT_ZH.venueV2Section.days[1],
				heroTitle: '8/6(Thu): Annual Conference',
				heroSubtitle: 'TAICHI annual conference',
				highlight: { label: 'Venue', venue: 'NTUT Hongyu Technology Building', details: ['Paper presentations and forum sessions'], scheduleLabel: 'Full Schedule', scheduleTo: '/program#day2' },
				venue: {
					...CONTENT_ZH.venueV2Section.days[1].venue,
					sectionTitle: 'Getting Here',
					name: 'National Taipei University of Technology',
					addressLabel: 'Address',
					address: "No. 1, Sec. 3, Zhongxiao E. Rd., Da'an Dist., Taipei City 10608",
					schedule: ['Hongyu Technology Research Building'],
				},
				campusMap: {
					title: 'Campus Map · Hongyu Technology Building',
					image: '/images/transit_ntut_campus.png',
					caption: 'The building highlighted in orange is the Hongyu Technology Building; enter via MRT Zhongxiao Xinsheng Station Exit 4 or the campus gate.',
					alt: 'NTUT campus map with the Hongyu Technology Building highlighted in orange',
					photo: {
						image: '/images/ntut_hongyu_entrance.png',
						caption: 'Entrance to the International Conference Hall, Hongyu Technology Building — follow the orange arrow.',
						alt: 'Entrance of the Hongyu Technology Building International Conference Hall with an orange arrow pointing to the doorway',
					},
				},
				travelPanels: [
					{
						title: 'Public Transportation',
						items: [
							{ title: 'MRT', lines: ['Bannan Line or Zhonghe-Xinlu Line, Zhongxiao Xinsheng Station Exit 4, walk to Taipei Tech.'] },
							{ title: 'Bus', stops: [
								{ name: 'Taipei Tech Station', routes: ['212', '212 Exp.', '232', '262', '299', '605'] },
								{ name: 'Zhongxiao Xinsheng Intersection', routes: ['72', '109', '115', '214', '222', '226', '280', '290', '505', '642', '665', '668', '672', 'Songjiang-Xinsheng Trunk'] },
							] },
							{ title: 'Train (TRA)', lines: ['From Taipei Main Station, transfer to the MRT Bannan Line to Zhongxiao Xinsheng Station Exit 4 for Taipei Tech.'] },
							{ title: 'HSR', lines: ['From HSR Taipei Station, transfer to the MRT Bannan Line to Zhongxiao Xinsheng Station Exit 4 for Taipei Tech.'] },
						],
					},
					{
						title: 'Driving',
						items: [
							{ title: 'National Highway 1', lines: ['Exit at the Jianguo N. Rd. / Songjiang Rd. interchange (keep left onto the Jianguo N. Rd. elevated road), exit at Zhongxiao E. Rd. (keep right, turn right onto Zhongxiao E. Rd.), continue about 100 m to the campus.'] },
							{ title: 'National Highway 3', lines: ['Take the Xindian interchange to the Muzha interchange, exit onto Xinhai Rd., turn onto Jianguo S. Rd., and continue to the Zhongxiao E. Rd. intersection to reach the campus.'] },
						],
					},
				],
			},
		],
	},
	transitSection: {
		...CONTENT_ZH.transitSection,
		seoTitle: 'Transit',
		seoDescription: 'TAICHI 2026 transit and arrival guide: Syntrend Creative Park (8/5) and National Taipei University of Technology (8/6).',
		openMapLabel: 'Open in Google Maps',
		mapPlaceholder: '[ Google Map ]',
		videoPlaceholder: 'Video coming soon',
		days: [
			{
				...CONTENT_ZH.transitSection.days[0],
				heroTitle: '8/5(Wed): Night Market',
				heroBadge: 'OPEN TO PUBLIC',
				heroSubtitle: 'Joint event by TAICHI, Program on Semiconductors and Humanities, APMAR, and ISAT',
				highlight: { label: 'Venue', venue: 'Syntrend Creative Park, 5F and 12F', details: ['5F international keynote talks', '12F interactive night market, snacks, and Live Coding performances'], scheduleLabel: 'Full Schedule', scheduleTo: '/program#day1' },
				sectionTitle: '08/05 Getting There',
				venue: {
					...CONTENT_ZH.transitSection.days[0].venue,
					title: '08/05 Venue',
					name: 'Syntrend Creative Park',
					addressLabel: 'Address',
					address: 'No. 2, Sec. 3, Civic Blvd., Zhongzheng Dist., Taipei City 100013',
					schedule: ['09:20 - 16:40　5F Exhibition Hall (elevator & escalator)', '15:30 - 20:00　12F Multi-purpose Hall (elevator only)'],
				},
				entryGuide: {
					...CONTENT_ZH.transitSection.days[0].entryGuide,
					title: 'The Pumpkin Gate',
					steps: ['Before 11:00, please enter through the “Pumpkin Gate”, follow the blue pumpkin markers on the ground to the entrance, and take the elevator directly up to 5F.', 'After 11:00, you may enter the 5F and 12F venues through any Syntrend Creative Park entrance.'],
				},
				areaMap: { ...CONTENT_ZH.transitSection.days[0].areaMap, alt: 'Pumpkin Gate location and Syntrend Creative Park area map' },
				routeMap: { ...CONTENT_ZH.transitSection.days[0].routeMap, alt: 'Syntrend Creative Park arrival route map', subtitles: ['Pumpkin on the left', 'Pumpkin on the right'] },
				videos: [{ label: 'Find the pumpkin (left)', src: '/videos/往左找南瓜.mp4' }, { label: 'Find the pumpkin (right)', src: '/videos/往右找南瓜.mp4' }],
				travelPanels: [
					{
						title: 'Public Transportation',
						items: [
							{ title: 'MRT', lines: ['Take the Zhonghe-Xinlu Line or Bannan Line to Zhongxiao Xinsheng Station, leave via Exit 1, and walk about 5 minutes.'] },
							{ title: 'Bus', lines: ['Bade Rd. “Taipei Tech Station” │ 205, 257, 276', 'Civic Blvd. “Guanghua Market Station” │ 669', 'Xinsheng N. Rd. “Guanghua Market Station” │ 72, 109, 214, 214 Express, 222, 226, 280, 280 Express, 290, 505, 642, 643, 665, 668, 675, 676, 680'] },
						],
					},
					{
						title: 'Driving',
						items: [
							{ title: 'Civic Blvd. Expressway (westbound)', lines: ['Take the Sec. 3 Civic Blvd. / Jianguo S. Rd. exit, continue to the Sec. 2 Civic Blvd. U-turn back onto Sec. 3, and drive past the Jinshan N. Rd. intersection to arrive.'] },
							{ title: 'Civic Blvd. Expressway (eastbound)', lines: ['Take the Sec. 3 Civic Blvd. / Jinshan N. Rd. exit and continue past the Jinshan N. Rd. intersection to arrive.'] },
							{ title: 'Xinsheng Expressway (southbound)', lines: ['Take the Sec. 1 Xinsheng N. Rd. / Sec. 2 Chang’an E. Rd. exit, keep right along Xinsheng N. Rd. onto Jinshan N. Rd. southbound, U-turn to Jinshan N. Rd. northbound, and continue to the Civic Blvd. intersection.'] },
						],
					},
					{
						title: 'Parking',
						items: [
							{ title: 'CityParking – Syntrend Creative Park Lot (under the Xinsheng elevated road)', lines: ['Address: No. 23-77, Jinshan N. Rd., Zhongzheng Dist., Taipei City 100', 'Car: NT$30 / 30 min on weekdays (NT$200 daily max)', 'Motorcycle: NT$20 per entry', 'Billed per half hour; free within the first 10 minutes.', 'With a disability ID, enjoy 4 hours free at the B3 parking office; from the 5th hour, in-mall purchases can offset fees.', 'Auto-pay machines accept cash, EasyCard, and contactless credit cards.'] },
						],
						link: { label: 'Syntrend Traffic Info', href: 'https://www.syntrend.com.tw/traffic.html' },
						map: { mapLink: 'https://maps.app.goo.gl/dsFiCupwnS3ZPDQYA' },
					},
				],
			},
			{
				...CONTENT_ZH.transitSection.days[1],
				heroTitle: '8/6(Thu): Annual Conference',
				heroSubtitle: 'TAICHI annual conference',
				highlight: { label: 'Venue', venue: 'NTUT Hongyu Technology Building', details: ['Paper presentations and forum sessions'], scheduleLabel: 'Full Schedule', scheduleTo: '/program#day2' },
				sectionTitle: '08/06 Getting There',
				venue: {
					...CONTENT_ZH.transitSection.days[1].venue,
					title: '08/06 Venue',
					name: 'National Taipei University of Technology',
					addressLabel: 'Address',
					address: "No. 1, Sec. 3, Zhongxiao E. Rd., Da'an Dist., Taipei City 10608",
					schedule: ['Hongyu Technology Research Building'],
				},
				entryGuide: {
					...CONTENT_ZH.transitSection.days[1].entryGuide,
					title: 'Hongyu Technology Research Building',
					steps: ['The conference is held in the Hongyu Technology Research Building. Enter the campus via the main gate or Zhongxiao Xinsheng Station Exit 4 and follow the campus signage.'],
				},
				routeMap: { ...CONTENT_ZH.transitSection.days[1].routeMap, alt: 'NTUT campus map' },
				travelPanels: [
					{
						title: 'Public Transportation',
						items: [
							{ title: 'MRT', lines: ['Bannan (Blue) Line or Zhonghe-Xinlu (Orange) Line to Zhongxiao Xinsheng Station; Exit 4 reaches Taipei Tech.'] },
							{ title: 'Bus', lines: ['Taipei Tech Station: 212, 212 Express, 232, 262, 299, 605', 'Zhongxiao Xinsheng Intersection: 72, 109, 115, 214, 222, 226, 280, 290, 505, 642, 665, 668, 672, Songjiang-Xinsheng Trunk'] },
							{ title: 'Train (TRA)', lines: ['From Taipei Main Station, transfer to the MRT Bannan Line to Zhongxiao Xinsheng Station, Exit 4 for Taipei Tech.'] },
							{ title: 'HSR', lines: ['From HSR Taipei Station, transfer to the MRT Bannan Line to Zhongxiao Xinsheng Station, Exit 4 for Taipei Tech.'] },
						],
					},
					{
						title: 'Driving',
						items: [
							{ title: 'National Freeway 1', lines: ['Exit at the Jianguo N. Rd. / Songjiang Rd. interchange (keep left onto the Jianguo N. Rd. viaduct), take the Zhongxiao E. Rd. exit (turn right onto Zhongxiao E. Rd.), and continue about 100 m to the campus.'] },
							{ title: 'National Freeway 3', lines: ['At the Xindian interchange connect to the Muzha interchange, exit onto Xinhai Rd., turn onto Jianguo S. Rd., and continue to the Zhongxiao E. Rd. intersection to reach the campus.'] },
						],
					},
				],
			},
		],
	},
	sponsorsSection: {
		...CONTENT_ZH.sponsorsSection,
		mainOrganizers: 'Main Organizers',
		coOrganizersTitle: 'Co-Organizers',
		supportingOrganizersTitle: 'Supporting Organizations',
		sponsorsTitle: 'Sponsors',
	},
	registrationSection: {
		...CONTENT_ZH.registrationSection,
		seoTitle: 'Registration',
		seoDescription: 'TAICHI 2026 registration and pricing information, including ticket rates and two ways to register.',
		pricingHeading: 'TAICHI 2026 Ticket Pricing',
		pricingDeadlineNote: 'Registration deadline: 2026/07/28 00:00',
		pricingTable: {
			...CONTENT_ZH.registrationSection.pricingTable,
			typeHeader: 'Ticket Type',
			tierNames: ['Price'],
			rows: [
				{ label: 'General', values: ['3500'] },
				{ label: 'Student', values: ['1750'] },
			],
		},
		paperRegistrationNote: 'Each accepted paper requires at least one registrant; please provide the paper ID on the registration form.',
		membershipNote:
			'**TAICHI membership renewal fees apply: NT$1,000 for general members and NT$500 for student members — please add this when registering.** New members, please contact the [society](https://taiwanchi.org/memberpay/).',
		methodsHeading: 'How to register for TAICHI',
		kktixHeading: '1. Register via KKTIX',
		kktixButtonLabel: 'KKTIX Registration Link',
		kktixComingSoonLabel: 'Coming Soon',
		manualHeading: '2. Group Registration',
		manualIntro:
			'If you prefer not to use KKTIX, you may register as a group by following the steps below. For any questions, please contact [taiwanchi26+registration@gmail.com](mailto:taiwanchi26+registration@gmail.com).',
		transferStepHeading: 'Transfer the registration fee to the following account',
		bankDetails: [
			'Account name: Taiwan Association for Computer-Human Interaction',
			'Bank: Hua Nan Commercial Bank (code 008)',
			'Account no.: 154100091731',
		],
		formStepHeading: 'Fill out the group registration form',
		formButtonLabel: 'Open the Form',
		emailStepText:
			'After registering, email a screenshot of the transfer receipt and the group registration form to [taiwanchi26+registration@gmail.com](mailto:taiwanchi26+registration@gmail.com)',
		apmarPricingHeading: 'APMAR 2026 Ticket Pricing',
		apmarIntro:
			'APMAR 2026 will be held on Aug 3–4. Registering for APMAR grants free admission to TAICHI 2026.',
		apmarPricingTable: {
			...CONTENT_ZH.registrationSection.apmarPricingTable,
			typeHeader: 'Ticket Type',
			tierNames: ['Price'],
			rows: [
				{ label: 'General', values: ['6200'] },
				{ label: 'Student', values: ['4400'] },
			],
		},
		apmarPricingDeadlineNote: 'Registration deadline: 2026/08/02 00:00',
		apmarMethodsHeading: 'How to register for APMAR',
	},
	footer: {
		...CONTENT_ZH.footer,
		socialsTitle: 'FOLLOW US',
		locationsTitle: 'CONTACT',
	},
} as const;
