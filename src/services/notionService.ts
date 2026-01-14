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

const NOTION_BASE_URL = 'https://notion-api.splitbee.io/v1/table/';

const getProp = (obj: any, key: string) => {
	if (!obj) return undefined;
	if (obj[key] !== undefined) return obj[key];

	const lowerKey = key.toLowerCase();
	const keys = Object.keys(obj);
	const foundKey = keys.find((k) => k.toLowerCase() === lowerKey);
	if (foundKey && obj[foundKey] !== undefined) return obj[foundKey];

	const cleanKey = lowerKey.replace(/\s/g, '');
	const foundKeyNoSpace = keys.find((k) => k.toLowerCase().replace(/\s/g, '') === cleanKey);
	if (foundKeyNoSpace && obj[foundKeyNoSpace] !== undefined) return obj[foundKeyNoSpace];

	return undefined;
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
	if (Array.isArray(rawImage) && rawImage.length > 0) url = rawImage[0].url;
	else if (typeof rawImage === 'string') url = rawImage;

	if (url && (url.includes('drive.google.com') || url.includes('googleusercontent.com'))) {
		return convertGoogleDriveImageUrl(url);
	}
	return url;
};

const extractImageGallery = (rawGallery: any): string[] => {
	if (!rawGallery) return [];
	let urls: string[] = [];
	if (Array.isArray(rawGallery)) urls = rawGallery.map((file: any) => file.url).filter(Boolean);
	return urls.map((url) => {
		if (url.includes('drive.google.com')) return convertGoogleDriveImageUrl(url);
		return url;
	});
};

// Fetch People (Committee & Keynotes)
export const fetchPeopleFromNotion = async (): Promise<PersonItem[]> => {
	if (!MEMBERS_NOTION_PAGE_ID) return STATIC_PEOPLE;

	try {
		const url = `${NOTION_BASE_URL}${MEMBERS_NOTION_PAGE_ID}?t=${new Date().getTime()}`;
		console.log(`[Debug] People URL:`, { url: url });
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		console.log(`[Debug] People Data:`, { data: data, json: JSON.stringify(data) });

		if (Array.isArray(data) && data.length > 0) {
			const people = data.map((row: any) => {
				const name = String(getProp(row, 'name') || getProp(row, 'Name') || 'Unknown');
				const chairType = String(getProp(row, 'Chair Type') || getProp(row, 'Role') || 'Committee Member');
				const email = String(getProp(row, 'Email') || '');
				const website = String(getProp(row, 'Website') || getProp(row, 'Link') || '');
				const rawImage = getProp(row, 'Image') || getProp(row, 'Photo') || getProp(row, 'Headshot');
				const imageUrl = extractImageUrl(rawImage);
				// Extract all fields from Notion
				const institution = String(getProp(row, 'Institution') || '');
				const department = String(getProp(row, 'Department') || '');
				const country = String(getProp(row, 'Country') || '');
				const notes = String(getProp(row, 'Notes') || '');

				return {
					id: row.id || Math.random().toString(36).substr(2, 9),
					name,
					chairType,
					email: email || undefined,
					image: imageUrl || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop',
					website: website || undefined,
					institution: institution || undefined,
					department: department || undefined,
					country: country || undefined,
					notes: notes || undefined,
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

		const sessionsUrl = `${NOTION_BASE_URL}${SESSIONS_NOTION_PAGE_ID}?t=${new Date().getTime()}`;
		console.log(`[Debug] Sessions URL:`, { url: sessionsUrl });
		const sessionsResponse = await fetch(sessionsUrl);
		if (!sessionsResponse.ok) throw new Error('Network response was not ok');
		const sessionsData = await sessionsResponse.json();
		console.log(`[Debug] Sessions Data:`, { data: sessionsData, json: JSON.stringify(sessionsData) });

		if (!Array.isArray(sessionsData) || sessionsData.length === 0) {
			return STATIC_SESSIONS;
		}

		// Fetch topics if topics database is configured
		let topicsData: any[] = [];
		if (TOPICS_NOTION_PAGE_ID) {
			try {
				const topicsUrl = `${NOTION_BASE_URL}${TOPICS_NOTION_PAGE_ID}?t=${new Date().getTime()}`;
				console.log(`[Debug] Topics URL:`, { url: topicsUrl });
				const topicsResponse = await fetch(topicsUrl);
				if (topicsResponse.ok) {
					topicsData = await topicsResponse.json();
					console.log(`[Debug] Topics Data:`, { data: topicsData, json: JSON.stringify(topicsData) });
				}
			} catch (err) {
				console.warn('Failed to fetch Topics', err);
			}
		}

		// Group topics by session ID
		const topicsBySession = new Map<string, Topic[]>();
		if (Array.isArray(topicsData)) {
			console.log(`[Debug] Processing ${topicsData.length} topics...`);
			topicsData.forEach((topicRow: any) => {
				const sessionIds = getProp(topicRow, 'Session');
				console.log(`[Debug] Topic "${getProp(topicRow, 'Topic')}" Session IDs:`, sessionIds);

				if (Array.isArray(sessionIds) && sessionIds.length > 0) {
					const sessionId = sessionIds[0]; // Take first session

					const topic: Topic = {
						id: topicRow.id || Math.random().toString(36).substr(2, 9),
						topic: String(getProp(topicRow, 'Topic') || ''),
						startTime: String(getProp(topicRow, 'Start Time') || ''),
						endTime: String(getProp(topicRow, 'End Time') || ''),
						sessionId,
					};

					// Resolve chair IDs to PersonItem objects
					const chairIds = getProp(topicRow, 'Chairs');
					if (Array.isArray(chairIds) && chairIds.length > 0) {
						topic.chairs = chairIds.map((id) => peopleMap.get(id)).filter(Boolean) as PersonItem[];
					}

					if (!topicsBySession.has(sessionId)) {
						topicsBySession.set(sessionId, []);
					}
					topicsBySession.get(sessionId)!.push(topic);
				} else {
					console.warn(`[Debug] Topic "${getProp(topicRow, 'Topic')}" has no valid Session relation.`);
				}
			});
			console.log(`[Debug] Topics grouped by session:`, Object.fromEntries(topicsBySession));
		}

		// Build sessions
		const sessions = sessionsData.map((row: any): SessionItem => {
			const id = row.id || Math.random().toString(36).substr(2, 9);
			const title = String(getProp(row, 'Title') || 'Session');
			const day = String(getProp(row, 'Day') || 'Day 1');
			const startTime = String(getProp(row, 'Start Time') || '');
			const endTime = String(getProp(row, 'End Time') || '');

			const session: SessionItem = {
				id,
				title,
				day,
				startTime,
				endTime,
			};

			// Resolve chair IDs to PersonItem objects
			const chairIds = getProp(row, 'Chairs');
			if (Array.isArray(chairIds) && chairIds.length > 0) {
				session.chairs = chairIds.map((id) => peopleMap.get(id)).filter(Boolean) as PersonItem[];
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
	// Keeping this for compatibility or future use, though might not be used in main nav
	if (!TOPICS_NOTION_PAGE_ID) return STATIC_PUBLICATIONS;
	try {
		const url = `${NOTION_BASE_URL}${TOPICS_NOTION_PAGE_ID}?t=${new Date().getTime()}`;
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		if (Array.isArray(data) && data.length > 0) {
			return data.map((row: any) => ({
				id: row.id || Math.random().toString(36).substr(2, 9),
				title: getProp(row, 'Title') || 'Untitled',
				authors: getProp(row, 'Authors') || '',
				year: getProp(row, 'Year') || '',
				publication: getProp(row, 'Publication') || '',
				doi: getProp(row, 'DOI') || '',
				category: getProp(row, 'Category') || 'Paper',
			}));
		}
		return STATIC_PUBLICATIONS;
	} catch (error) {
		return STATIC_PUBLICATIONS;
	}
};

export const fetchNewsFromNotion = async (): Promise<NewsItem[]> => {
	if (!NEWS_NOTION_PAGE_ID) return STATIC_NEWS;

	try {
		const url = `${NOTION_BASE_URL}${NEWS_NOTION_PAGE_ID}?t=${new Date().getTime()}`;
		console.log(`[Debug] News URL:`, { url: url });
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		console.log(`[Debug] News Data:`, { data: data });

		if (Array.isArray(data) && data.length > 0) {
			const news = data.map((row: any) => {
				// Map using the keys provided by user (Capitalized based on sample)
				// Fallback to getProp for safety if keys vary slightly
				const id = row.id || row.Id || Math.random().toString(36).substr(2, 9);
				const title = String(row.Title || getProp(row, 'Title') || row.Name || 'Untitled Event');
				const subtitle = String(row.Subtitle || getProp(row, 'Subtitle') || '');
				const content = String(row.Content || getProp(row, 'Content') || '');
				const date = String(row.Date || getProp(row, 'Date') || '');
				const createdTime = String(row.Created || getProp(row, 'Created') || '');
				const place = String(row.Location || getProp(row, 'Location') || '');
				const link = String(row.Link || getProp(row, 'Link') || '');

				const rawHead = row.Headphoto || getProp(row, 'Headphoto');
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

			return news.sort((a: NewsItem, b: NewsItem) => {
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
