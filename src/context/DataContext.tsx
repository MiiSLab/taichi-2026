import React, { createContext, useContext, useEffect } from 'react';
import { NEWS as STATIC_NEWS, PEOPLE as STATIC_PEOPLE, SESSIONS as STATIC_SESSIONS } from '../content';

/**
 * 活動已結束（2026-08）：資料全面靜態化，不再於執行期連 Notion。
 *
 * PEOPLE/SESSIONS 來自 src/frozenData.ts（由 scripts/freeze-notion-data.mjs 凍結產出），
 * NEWS 來自 src/announcementsData.ts（手動維護的公告）。
 * 原本的 Notion 背景同步實作保留於 src/services/notionService.ts 與本檔的 git 歷史，
 * 重新啟用方式見 HANDOVER.md。
 */

interface DataContextType {
	people: PersonItem[];
	sessions: SessionItem[];
	news: NewsItem[];
	isSyncing: boolean;
	dataSource: 'static' | 'notion';
	lastSynced: string;
}

// 舊版同步機制留下的 localStorage cache key（內含已過期的外部圖片 URL），載入時清除
const LEGACY_CACHE_KEY = 'taichi_2026_notion_cache';

const STATIC_DATA: DataContextType = {
	people: STATIC_PEOPLE,
	sessions: STATIC_SESSIONS,
	news: STATIC_NEWS,
	isSyncing: false,
	dataSource: 'static',
	lastSynced: '',
};

const DataContext = createContext<DataContextType>(STATIC_DATA);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	useEffect(() => {
		try {
			localStorage.removeItem(LEGACY_CACHE_KEY);
		} catch {
			// localStorage 不可用（如隱私模式）時忽略
		}
	}, []);

	return <DataContext.Provider value={STATIC_DATA}>{children}</DataContext.Provider>;
};
