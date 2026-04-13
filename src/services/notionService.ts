import {
	MEMBERS_NOTION_PAGE_ID,
	NEWS_NOTION_PAGE_ID,
	SESSIONS_NOTION_PAGE_ID,
	NEWS as STATIC_NEWS,
	PEOPLE as STATIC_PEOPLE,
	PUBLICATIONS as STATIC_PUBLICATIONS,
	SESSIONS as STATIC_SESSIONS,
	TOPICS_NOTION_PAGE_ID,
} from '../content';

// 如果要使用官方 API，建議透過一個代理伺服器（Proxy Worker）來避免 CORS 問題和隱藏 API Key
// 請在前端專案的 .env 檔案中設定：
// VITE_NOTION_PROXY_URL=https://your-worker-proxy.xxx.workers.dev/v1/databases/
// 或
// 將 API Key 改為設定在代理伺服器（Cloudflare Worker）的環境變數中，以保護金鑰不外洩。
const NOTION_PROXY_URL = import.meta.env.VITE_NOTION_PROXY_URL || 'https://api.notion.com/v1/databases/';

const queryNotionDatabase = async (databaseId: string) => {
	// 防呆：如果是前端環境直接呼叫 api.notion.com 會遇到 CORS 問題，必須透過代理
	const url = `${NOTION_PROXY_URL}${databaseId}/query`;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'Notion-Version': '2022-06-28',
	};

	// 注意：為了安全性，Authorization (API Key) 應該由代理伺服器（Proxy）加上
	// 前端不應該直接發送包含 API Key 的請求，否則金鑰會外洩在公開的網頁 JavaScript 中。

	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			// 可加入 filter 或 sorts
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Notion API request failed: ${response.status} ${text}`);
	}

	const data = await response.json();
	return data.results || [];
};

// 官方 Notion API 的 properties 解析
const getProp = (properties: any, key: string) => {
	if (!properties) return undefined;

	let prop = properties[key];

	// Fuzzy match 如果找不到精確字眼
	if (!prop) {
		const lowerKey = key.toLowerCase();
		const keys = Object.keys(properties);
		const foundKey = keys.find(
			(k) => k.toLowerCase() === lowerKey || k.toLowerCase().replace(/\s/g, '') === lowerKey.replace(/\s/g, ''),
		);
		if (foundKey) prop = properties[foundKey];
	}

	if (!prop) return undefined;

	switch (prop.type) {
		case 'title':
			return prop.title?.map((t: any) => t.plain_text).join('') || '';
		case 'rich_text':
			return prop.rich_text?.map((t: any) => t.plain_text).join('') || '';
		case 'select':
			return prop.select?.name || '';
		case 'multi_select':
			return prop.multi_select?.map((s: any) => s.name) || [];
		case 'date':
			return prop.date?.start || '';
		case 'url':
			return prop.url || '';
		case 'email':
			return prop.email || '';
		case 'phone_number':
			return prop.phone_number || '';
		case 'number':
			return prop.number !== null ? prop.number : undefined;
		case 'checkbox':
			return prop.checkbox ?? false;
		case 'files':
			return prop.files?.map((f: any) => f.file?.url || f.external?.url).filter(Boolean) || [];
		case 'relation':
			return prop.relation?.map((r: any) => r.id) || [];
		default:
			return undefined;
	}
};

const convertGoogleDriveImageUrl = (url: string): string => {
	if (!url) return '';
	const idMatch1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
	if (idMatch1 && idMatch1[1]) return `https://drive.google.com/uc?export=view&id=${idMatch1[1]}`;
	const idMatch2 = url.match(/id=([a-zA-Z0-9_-]+)/);
	if (idMatch2 && idMatch2[1]) return `https://drive.google.com/uc?export=view&id=${idMatch2[1]}`;
	return url;
};

const extractImageUrl = (rawImage: any): string => {
	if (!rawImage) return '';
	let url = '';

	if (Array.isArray(rawImage) && rawImage.length > 0) {
		// 官方 API 的 files 解析會回傳字串陣列
		url = typeof rawImage[0] === 'string' ? rawImage[0] : rawImage[0].url;
	} else if (typeof rawImage === 'string') {
		url = rawImage;
	}

	if (url && (url.includes('drive.google.com') || url.includes('googleusercontent.com'))) {
		return convertGoogleDriveImageUrl(url);
	}
	return url;
};

// Fetch People (Committee & Keynotes)
export const fetchPeopleFromNotion = async (): Promise<PersonItem[]> => {
	if (!MEMBERS_NOTION_PAGE_ID) return STATIC_PEOPLE;

	try {
		// console.log(`[Debug] Fetching People from Official Notion API...`);
		const results = await queryNotionDatabase(MEMBERS_NOTION_PAGE_ID);
		// console.log(`[Debug] People Data Fetched:`, results.length);

		if (results.length > 0) {
			const people = results.map((row: any) => {
				const props = row.properties;
				const name = String(getProp(props, 'name') || getProp(props, 'Name') || 'Unknown');
				const chairType = String(getProp(props, 'Chair Type') || getProp(props, 'Role') || 'Committee Member');
				const email = String(getProp(props, 'Email') || '');
				const website = String(getProp(props, 'Website') || getProp(props, 'Link') || '');
				const rawImage = getProp(props, 'Image') || getProp(props, 'Photo') || getProp(props, 'Headshot');
				const imageUrl = extractImageUrl(rawImage);

				const institution = String(getProp(props, 'Institution') || '');
				const institutionEn = String(getProp(props, 'Institution (EN)') || '');
				const department = String(getProp(props, 'Department') || '');
				const departmentEn = String(getProp(props, 'Department (EN)') || '');
				const nameEn = String(getProp(props, 'Name (EN)') || '');
				const country = String(getProp(props, 'Country') || '');
				const notes = String(getProp(props, 'Notes') || '');
				const orderVal = getProp(props, 'Order') ?? getProp(props, 'order');
				const order = typeof orderVal === 'number' ? orderVal : undefined;

				return {
					id: row.id,
					name,
					nameEn: nameEn || undefined,
					chairType,
					email: email || undefined,
					image: imageUrl || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop',
					website: website || undefined,
					institution: institution || undefined,
					institutionEn: institutionEn || undefined,
					department: department || undefined,
					departmentEn: departmentEn || undefined,
					country: country || undefined,
					notes: notes || undefined,
					order,
				};
			});
			return people;
		}
		return STATIC_PEOPLE;
	} catch (error) {
		console.warn('Failed to fetch People from Notion', error);
		return STATIC_PEOPLE;
	}
};

// Fetch Sessions (Program)
export const fetchSessionsFromNotion = async (): Promise<SessionItem[]> => {
	if (!SESSIONS_NOTION_PAGE_ID) return STATIC_SESSIONS;

	try {
		// First, fetch all people to resolve chair IDs
		const people = await fetchPeopleFromNotion();
		const peopleMap = new Map(people.map((p) => [p.id, p]));

		// console.log(`[Debug] Fetching Sessions from Official Notion API...`);
		const sessionsData = await queryNotionDatabase(SESSIONS_NOTION_PAGE_ID);
		// console.log(`[Debug] Sessions Data Fetched:`, sessionsData.length);

		if (sessionsData.length === 0) {
			return STATIC_SESSIONS;
		}

		// Fetch topics if topics database is configured
		let topicsData: any[] = [];
		if (TOPICS_NOTION_PAGE_ID) {
			try {
				// console.log(`[Debug] Fetching Topics...`);
				topicsData = await queryNotionDatabase(TOPICS_NOTION_PAGE_ID);
			} catch (err) {
				console.warn('Failed to fetch Topics', err);
			}
		}

		// Group topics by session ID
		const topicsBySession = new Map<string, Topic[]>();
		if (topicsData.length > 0) {
			topicsData.forEach((topicRow: any) => {
				const props = topicRow.properties;
				const sessionIds = getProp(props, 'Session'); // This relates to a Session Relation

				if (Array.isArray(sessionIds) && sessionIds.length > 0) {
					const sessionId = sessionIds[0]; // Take first session's ID

					const topic: Topic = {
						id: topicRow.id,
						topic: String(getProp(props, 'Topic') || ''),
						startTime: String(getProp(props, 'Start Time') || ''),
						endTime: String(getProp(props, 'End Time') || ''),
						sessionId,
					};

					// Resolve chair relation IDs to PersonItem objects
					const chairIds = getProp(props, 'Chairs');
					if (Array.isArray(chairIds) && chairIds.length > 0) {
						topic.chairs = chairIds.map((id: string) => peopleMap.get(id)).filter(Boolean) as PersonItem[];
					}

					if (!topicsBySession.has(sessionId)) {
						topicsBySession.set(sessionId, []);
					}
					topicsBySession.get(sessionId)!.push(topic);
				}
			});
		}

		// Build sessions
		const sessions = sessionsData.map((row: any): SessionItem => {
			const props = row.properties;
			const id = row.id;
			const title = String(getProp(props, 'Title') || 'Session');
			const day = String(getProp(props, 'Day') || 'Day 1');
			const startTime = String(getProp(props, 'Start Time') || '');
			const endTime = String(getProp(props, 'End Time') || '');

			const session: SessionItem = {
				id,
				title,
				day,
				startTime,
				endTime,
			};

			// Resolve chair relation IDs
			const chairIds = getProp(props, 'Chairs');
			if (Array.isArray(chairIds) && chairIds.length > 0) {
				session.chairs = chairIds.map((cid: string) => peopleMap.get(cid)).filter(Boolean) as PersonItem[];
			}

			// Attach topics for this session
			const topics = topicsBySession.get(id);
			if (topics && topics.length > 0) {
				session.topics = topics.sort((a, b) => a.startTime.localeCompare(b.startTime));
			}

			return session;
		});

		// Sort by day first, then by start time
		return sessions.sort((a, b) => {
			if (a.day !== b.day) return a.day.localeCompare(b.day);
			return a.startTime.localeCompare(b.startTime);
		});
	} catch (error) {
		console.warn('Failed to fetch Sessions from Notion', error);
		return STATIC_SESSIONS;
	}
};

export const fetchPublicationsFromNotion = async (): Promise<PublicationItem[]> => {
	if (!TOPICS_NOTION_PAGE_ID) return STATIC_PUBLICATIONS;
	try {
		const results = await queryNotionDatabase(TOPICS_NOTION_PAGE_ID);
		if (results.length > 0) {
			return results.map((row: any) => {
				const props = row.properties;
				return {
					id: row.id,
					title: String(getProp(props, 'Title') || 'Untitled'),
					authors: String(getProp(props, 'Authors') || ''),
					year: String(getProp(props, 'Year') || ''),
					publication: String(getProp(props, 'Publication') || ''),
					doi: String(getProp(props, 'DOI') || ''),
					category: String(getProp(props, 'Category') || 'Paper'),
				};
			});
		}
		return STATIC_PUBLICATIONS;
	} catch (error) {
		return STATIC_PUBLICATIONS;
	}
};

export const fetchNewsFromNotion = async (): Promise<NewsItem[]> => {
	if (!NEWS_NOTION_PAGE_ID) return STATIC_NEWS;

	try {
		// console.log(`[Debug] Fetching News from Official Notion API...`);
		const results = await queryNotionDatabase(NEWS_NOTION_PAGE_ID);

		if (results.length > 0) {
			const news = results.map((row: any) => {
				const props = row.properties;

				const id = row.id;
				const title = String(getProp(props, 'Title') || getProp(props, 'Name') || 'Untitled Event');
				const subtitle = String(getProp(props, 'Subtitle') || '');
				const content = String(getProp(props, 'Content') || '');
				const date = String(getProp(props, 'Date') || '');
				const createdTime = String(getProp(props, 'Created') || '');
				const place = String(getProp(props, 'Location') || '');
				const link = String(getProp(props, 'Link') || '');

				const rawHead = getProp(props, 'Headphoto') || getProp(props, 'Image') || getProp(props, 'Photo');
				const image =
					extractImageUrl(rawHead) ||
					'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop';

				return {
					id,
					title,
					subtitle,
					content,
					date,
					createdTime,
					place,
					image,
					link,
				};
			});

			return news.sort((a, b) => {
				const timeA = new Date(a.createdTime || a.date).getTime();
				const timeB = new Date(b.createdTime || b.date).getTime();
				return timeB - timeA;
			});
		}
		return STATIC_NEWS;
	} catch (error) {
		console.error('Error fetching news:', error);
		return STATIC_NEWS;
	}
};
