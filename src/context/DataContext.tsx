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

	useEffect(() => {
		handleSyncData();
	}, []);

	const handleSyncData = async () => {
		setIsSyncing(true);
		await new Promise((resolve) => setTimeout(resolve, 500));

		try {
			const [fetchedPeople, fetchedSessions, fetchedNews] = await Promise.all([
				fetchPeopleFromNotion(),
				fetchSessionsFromNotion(),
				fetchNewsFromNotion(),
			]);

			let hasUpdate = false;
			if (fetchedPeople && fetchedPeople.length > 0) {
				setPeople(fetchedPeople);
				hasUpdate = true;
			}
			if (fetchedSessions && fetchedSessions.length > 0) {
				setSessions(fetchedSessions);
				hasUpdate = true;
			}
			if (fetchedNews && fetchedNews.length > 0) {
				setNews(fetchedNews);
				hasUpdate = true;
			}

			if (hasUpdate) {
				setDataSource('notion');
				const now = new Date();
				setLastSynced(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
			}
		} catch (error) {
			console.error('Failed to sync data from Notion:', error);
		} finally {
			setIsSyncing(false);
		}
	};

	return <DataContext.Provider value={{ people, sessions, news, isSyncing, dataSource, lastSynced }}>{children}</DataContext.Provider>;
};
