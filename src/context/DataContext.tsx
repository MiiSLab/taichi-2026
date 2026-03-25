import React, { createContext, useContext, useEffect, useState } from 'react';
import { NEWS as STATIC_NEWS, PEOPLE as STATIC_PEOPLE, SESSIONS as STATIC_SESSIONS } from '../content';
import { fetchNewsFromNotion, fetchPeopleFromNotion, fetchSessionsFromNotion } from '../services/notionService';

interface DataContextType {
	people: PersonItem[];
	sessions: SessionItem[];
	news: NewsItem[];
	isSyncing: boolean;
	dataSource: 'static' | 'notion';
	lastSynced: string;
}

const CACHE_KEY = 'taichi_2026_notion_cache';



const DataContext = createContext<DataContextType>({
	people: STATIC_PEOPLE,
	sessions: STATIC_SESSIONS,
	news: STATIC_NEWS,
	isSyncing: false,
	dataSource: 'static',
	lastSynced: '',
});



export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [people, setPeople] = useState<PersonItem[]>(STATIC_PEOPLE);
	const [sessions, setSessions] = useState<SessionItem[]>(STATIC_SESSIONS);
	const [news, setNews] = useState<NewsItem[]>(STATIC_NEWS);
	const [isSyncing, setIsSyncing] = useState(false);
	const [dataSource, setDataSource] = useState<'static' | 'notion'>('static');
	const [lastSynced, setLastSynced] = useState<string>('');

	// 1. Initial Load from Cache (Immediate)
	useEffect(() => {
		const cached = localStorage.getItem(CACHE_KEY);
		if (cached) {
			try {
				const { data, timestamp, source } = JSON.parse(cached);
				if (data.people) setPeople(data.people);
				if (data.sessions) setSessions(data.sessions);
				if (data.news) setNews(data.news);
				setDataSource(source || 'notion');
				const date = new Date(timestamp);
				setLastSynced(`${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`);
			} catch (e) {
				console.warn('Failed to parse cache', e);
			}
		}
		
		// 2. Always trigger background sync on mount
		handleSyncData();
	}, []);

	const handleSyncData = async () => {
		setIsSyncing(true);

		try {
			// Fetch in parallel
			const [fetchedPeople, fetchedSessions, fetchedNews] = await Promise.all([
				fetchPeopleFromNotion(),
				fetchSessionsFromNotion(),
				fetchNewsFromNotion(),
			]);

			let hasUpdate = false;
			const newData: any = {};

			if (fetchedPeople && fetchedPeople.length > 0) {
				setPeople(fetchedPeople);
				newData.people = fetchedPeople;
				hasUpdate = true;
			}
			if (fetchedSessions && fetchedSessions.length > 0) {
				setSessions(fetchedSessions);
				newData.sessions = fetchedSessions;
				hasUpdate = true;
			}
			if (fetchedNews && fetchedNews.length > 0) {
				setNews(fetchedNews);
				newData.news = fetchedNews;
				hasUpdate = true;
			}

			if (hasUpdate) {
				setDataSource('notion');
				const now = Date.now();
				const date = new Date(now);
				setLastSynced(`${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`);

				// Save to Cache
				localStorage.setItem(
					CACHE_KEY,
					JSON.stringify({
						data: newData,
						timestamp: now,
						source: 'notion',
					}),
				);
			}
		} catch (error) {
			console.error('Failed to sync data from Notion:', error);
		} finally {
			setIsSyncing(false);
		}
	};

	return (
		<DataContext.Provider value={{ people, sessions, news, isSyncing, dataSource, lastSynced }}>{children}</DataContext.Provider>
	);
};


