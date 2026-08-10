import { ANNOUNCEMENTS } from './announcementsData';
import { FROZEN_PEOPLE, FROZEN_SESSIONS } from './frozenData';

export const CONFIG = {
	notion: {
		newsDatabaseId: '2e8ceff5447080c7914bfdbcb9758808',
		peopleDatabaseId: '2e7ceff5447080aebbbbf20d0ee07a0b',
		sessionsDatabaseId: 'af10738ec6964a58ba15b4f10219ad99',
		topicsDatabaseId: '2e7ceff544708077a369df3f0643c99e',
		chairTypeOrder: [
			'General Chairs',
			'Steering Committees',
			'Best Paper Award Committee',
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
	imageAdjustments: {
		'311ceff5-4470-8117-8d4c-d17d7183827a': {
			objectPosition: '50% 0%',
			lastUrl: 'https://www.csie.ntu.edu.tw/uploads/member_profile/avatar/63bfc72708911a59987ce2b9/8353.jpg',
		},
		'311ceff5-4470-8142-8792-ec014e1a5e33': {
			objectPosition: '75% 50%',
			lastUrl: 'https://www.dt.ntust.edu.tw/upload/teacher/34.png',
		},
		'311ceff5-4470-8131-ae27-c0f2517a578c': {
			objectPosition: '50% 0%',
			lastUrl: 'https://www.cs.nycu.edu.tw/storage/avatars/OumAStw1cZFsbegwMoPnCgcOv84D9GM3dwzymS4Q.png',
		},
		'311ceff5-4470-81d8-bdcf-cfc11bb7ca6a': {
			objectPosition: '50% 0%',
			lastUrl: 'https://ixd.ntut.edu.tw/var/file/89/1089/pictures/280/m/mczh-tw700x700_large19125_980685165558.jpeg',
		},
		'311ceff5-4470-81ea-a6d7-ffd10930330a': {
			objectPosition: '50% 0%',
			lastUrl: 'https://www.cs.nycu.edu.tw/storage/avatars/TxnBkEZOOQ1980JVAO9QD3U4Lg1cIzuvZ6upLWgE.png',
		},
		'311ceff5-4470-81a9-99cd-eff7d65fe9f4': {
			objectPosition: '50% 0%',
			lastUrl: 'https://www.cs.nycu.edu.tw/storage/avatars/fTQOrGKfJ7SQBteW5Db6nU5my8dpmMKYVmbp7Osz.png',
		},
		'311ceff5-4470-811a-8fcd-e302394efe28': {
			objectPosition: '50% 27%',
			lastUrl: 'https://dschool.ntu.edu.tw/wp-content/uploads/2021/03/12%E9%BB%83%E6%9B%B8%E7%B7%AF.jpg',
		},
		'311ceff5-4470-81c4-84a2-f4a94b0d1341': {
			objectPosition: '50% 16%',
			lastUrl: 'https://management.ntu.edu.tw/cm/teacher/430/63a5e9a1b6d85.png',
		},
		'312ceff5-4470-8028-86dc-e3c4f50f3942': {
			objectPosition: '50% 45%',
			lastUrl:
				'https://pub-4fc5c20515f14a43b24bd7bc8ed9e55a.r2.dev/members/26aa7f1b-413c-8042-8051-c45e0feeb01c/image/aHR0cHM6Ly9wcm9kLWZpbGVz.jpg',
		},
	} as Record<string, ImageAdjustment>,
	contact: {
		email: 'taiwanchi26@gmail.com',
		address: '',
	},
};

export const NEWS_NOTION_PAGE_ID = CONFIG.notion.newsDatabaseId;
export const MEMBERS_NOTION_PAGE_ID = CONFIG.notion.peopleDatabaseId;
export const SESSIONS_NOTION_PAGE_ID = CONFIG.notion.sessionsDatabaseId;
export const TOPICS_NOTION_PAGE_ID = CONFIG.notion.topicsDatabaseId;

export const PEOPLE: PersonItem[] = FROZEN_PEOPLE;
export const SESSIONS: SessionItem[] = FROZEN_SESSIONS;
export const PUBLICATIONS: PublicationItem[] = [];
export const NEWS: NewsItem[] = ANNOUNCEMENTS;
