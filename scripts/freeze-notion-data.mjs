#!/usr/bin/env node
/**
 * Freeze the live Notion data (people / sessions / news) into static files.
 *
 * 活動結束後執行一次，把 Notion 資料庫內容與所有外部圖片抓下來：
 *   - 圖片下載到 public/images/people/ 與 public/images/news/
 *   - 資料寫成 src/frozenData.ts（image 欄位改指本地路徑）
 *
 * 之後前端不再連 Notion（見 src/context/DataContext.tsx）。
 * mapping 邏輯移植自 src/services/notionService.ts（該檔保留原樣供交接參考，
 * 因其使用 import.meta.env 無法直接在 Node 引用）。
 *
 * 不需要 Notion token — 走與前端相同的 Cloudflare Worker proxy（由 proxy 加上金鑰）。
 * Proxy URL 依序取自：環境變數 VITE_NOTION_PROXY_URL → .env 內同名變數 → 預設 worker URL。
 *
 * Usage:
 *   node scripts/freeze-notion-data.mjs --dry-run   # 只抓資料印統計，不寫任何檔案
 *   node scripts/freeze-notion-data.mjs             # 下載圖片 + 產出 src/frozenData.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PEOPLE_IMG_DIR = join(ROOT, 'public', 'images', 'people');
const NEWS_IMG_DIR = join(ROOT, 'public', 'images', 'news');
const OUTPUT_FILE = join(ROOT, 'src', 'frozenData.ts');

// 與 src/content.shared.ts CONFIG.notion 一致
const DB = {
	people: '2e7ceff5447080aebbbbf20d0ee07a0b',
	sessions: 'af10738ec6964a58ba15b4f10219ad99',
	topics: '2e7ceff544708077a369df3f0643c99e',
	news: '2e8ceff5447080c7914bfdbcb9758808',
};

// notionService.ts 的兩個 Unsplash 預設圖，各存一份本地 placeholder
const PLACEHOLDER_SOURCES = {
	person: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000&auto=format&fit=crop',
	news: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
};
const PLACEHOLDER_PATHS = {
	person: '/images/people/_placeholder_person.jpg',
	news: '/images/news/_placeholder_news.jpg',
};

const DRY_RUN = process.argv.includes('--dry-run');

// 部分教職員網站會擋非瀏覽器 UA
const BROWSER_UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const resolveProxyUrl = () => {
	if (process.env.VITE_NOTION_PROXY_URL) return process.env.VITE_NOTION_PROXY_URL;
	try {
		const env = readFileSync(join(ROOT, '.env'), 'utf8');
		const line = env.split(/\r?\n/).find((l) => l.trim().startsWith('VITE_NOTION_PROXY_URL='));
		if (line) {
			const value = line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
			if (value) return value;
		}
	} catch {
		// no .env — fall through
	}
	return 'https://taichi-notion-proxy.miislab-ntust.workers.dev/v1/databases/';
};

const PROXY_URL = resolveProxyUrl();

// ---------- Notion query（加分頁；notionService.ts 版本只抓第一頁 100 筆） ----------

const queryNotionDatabase = async (databaseId) => {
	const results = [];
	let cursor;
	do {
		const res = await fetch(`${PROXY_URL}${databaseId}/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Notion-Version': '2022-06-28',
			},
			body: JSON.stringify(cursor ? { start_cursor: cursor } : {}),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Notion query failed for ${databaseId}: ${res.status} ${text.slice(0, 300)}`);
		}
		const data = await res.json();
		results.push(...(data.results || []));
		cursor = data.has_more ? data.next_cursor : undefined;
	} while (cursor);
	return results;
};

// ---------- property 解析（移植自 notionService.ts） ----------

const getProp = (properties, key) => {
	if (!properties) return undefined;
	let prop = properties[key];
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
			return prop.title?.map((t) => t.plain_text).join('') || '';
		case 'rich_text':
			return prop.rich_text?.map((t) => t.plain_text).join('') || '';
		case 'select':
			return prop.select?.name || '';
		case 'multi_select':
			return prop.multi_select?.map((s) => s.name) || [];
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
			return prop.files?.map((f) => f.file?.url || f.external?.url).filter(Boolean) || [];
		case 'relation':
			return prop.relation?.map((r) => r.id) || [];
		default:
			return undefined;
	}
};

const convertGoogleDriveImageUrl = (url) => {
	if (!url) return '';
	const idMatch1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
	if (idMatch1 && idMatch1[1]) return `https://drive.google.com/uc?export=view&id=${idMatch1[1]}`;
	const idMatch2 = url.match(/id=([a-zA-Z0-9_-]+)/);
	if (idMatch2 && idMatch2[1]) return `https://drive.google.com/uc?export=view&id=${idMatch2[1]}`;
	return url;
};

const extractImageUrl = (rawImage) => {
	if (!rawImage) return '';
	let url = '';
	if (Array.isArray(rawImage) && rawImage.length > 0) {
		url = typeof rawImage[0] === 'string' ? rawImage[0] : rawImage[0].url;
	} else if (typeof rawImage === 'string') {
		url = rawImage;
	}
	if (url && (url.includes('drive.google.com') || url.includes('googleusercontent.com'))) {
		return convertGoogleDriveImageUrl(url);
	}
	return url;
};

// ---------- 圖片下載 ----------

const EXT_BY_MIME = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/avif': '.avif',
	'image/gif': '.gif',
	'image/svg+xml': '.svg',
};

const slugify = (value) =>
	value
		.normalize('NFKD')
		.replace(/[^\x00-\x7F]/g, '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');

const usedFilenames = new Set();
const downloadedByUrl = new Map(); // url -> local public path（同 URL 只下載一次）
const failedDownloads = [];

const downloadImage = async (url, dir, publicPrefix, baseSlug, fallbackPath) => {
	if (!url) return fallbackPath;
	if (url.startsWith('/')) return url; // 已是本地路徑
	if (downloadedByUrl.has(url)) return downloadedByUrl.get(url);

	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': BROWSER_UA, Accept: 'image/*,*/*;q=0.8' },
			signal: AbortSignal.timeout(30000),
			redirect: 'follow',
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const buffer = Buffer.from(await res.arrayBuffer());
		if (buffer.length < 100) throw new Error(`suspiciously small response (${buffer.length} bytes)`);

		const mime = (res.headers.get('content-type') || '').split(';')[0].trim();
		const urlExt = (new URL(url).pathname.match(/\.(jpe?g|png|webp|avif|gif|svg)$/i) || [])[0];
		const ext = EXT_BY_MIME[mime] || (urlExt ? urlExt.toLowerCase().replace('.jpeg', '.jpg') : '.jpg');

		let filename = `${baseSlug}${ext}`;
		if (usedFilenames.has(filename)) filename = `${baseSlug}_${downloadedByUrl.size}${ext}`;
		usedFilenames.add(filename);

		const publicPath = `${publicPrefix}/${filename}`;
		if (!DRY_RUN) writeFileSync(join(dir, filename), buffer);
		downloadedByUrl.set(url, publicPath);
		console.log(`  [image] ${publicPath}  <-  ${url.slice(0, 90)}${url.length > 90 ? '…' : ''}`);
		return publicPath;
	} catch (err) {
		failedDownloads.push({ url, baseSlug, reason: err.message });
		console.warn(`  [warn] 圖片下載失敗（改用 placeholder）: ${baseSlug}  ${url.slice(0, 90)}  (${err.message})`);
		return fallbackPath;
	}
};

const personSlug = (person) => {
	// nameEn 優先，其次名字中的拉丁文段（"中文 / English" 格式），最後用 Notion id 後 8 碼
	const latinSegment = person.name
		.split('/')
		.map((s) => s.trim())
		.find((s) => s && !/[㐀-鿿]/.test(s));
	return (
		slugify(person.nameEn || '') ||
		slugify(latinSegment || '') ||
		`person_${person.id.replace(/-/g, '').slice(-8)}`
	);
};

// ---------- mappers（移植自 notionService.ts，image 改為本地化） ----------

const mapPeople = async (rows) => {
	const people = [];
	for (const row of rows) {
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

		const person = {
			id: row.id,
			name,
			nameEn: nameEn || undefined,
			chairType,
			email: email || undefined,
			image: '',
			website: website || undefined,
			institution: institution || undefined,
			institutionEn: institutionEn || undefined,
			department: department || undefined,
			departmentEn: departmentEn || undefined,
			country: country || undefined,
			notes: notes || undefined,
			order,
		};
		person.image = await downloadImage(imageUrl, PEOPLE_IMG_DIR, '/images/people', personSlug(person), PLACEHOLDER_PATHS.person);
		people.push(person);
	}
	return people;
};

const mapSessions = (sessionRows, topicRows, peopleMap) => {
	const topicsBySession = new Map();
	for (const topicRow of topicRows) {
		const props = topicRow.properties;
		const sessionIds = getProp(props, 'Session');
		if (!Array.isArray(sessionIds) || sessionIds.length === 0) continue;
		const sessionId = sessionIds[0];

		const topic = {
			id: topicRow.id,
			topic: String(getProp(props, 'Topic') || ''),
			startTime: String(getProp(props, 'Start Time') || ''),
			endTime: String(getProp(props, 'End Time') || ''),
			sessionId,
		};
		const chairIds = getProp(props, 'Chairs');
		if (Array.isArray(chairIds) && chairIds.length > 0) {
			topic.chairs = chairIds.map((id) => peopleMap.get(id)).filter(Boolean);
		}
		if (!topicsBySession.has(sessionId)) topicsBySession.set(sessionId, []);
		topicsBySession.get(sessionId).push(topic);
	}

	const sessions = sessionRows.map((row) => {
		const props = row.properties;
		const session = {
			id: row.id,
			title: String(getProp(props, 'Title') || 'Session'),
			day: String(getProp(props, 'Day') || 'Day 1'),
			startTime: String(getProp(props, 'Start Time') || ''),
			endTime: String(getProp(props, 'End Time') || ''),
		};
		const chairIds = getProp(props, 'Chairs');
		if (Array.isArray(chairIds) && chairIds.length > 0) {
			session.chairs = chairIds.map((cid) => peopleMap.get(cid)).filter(Boolean);
		}
		const topics = topicsBySession.get(session.id);
		if (topics && topics.length > 0) {
			session.topics = topics.sort((a, b) => a.startTime.localeCompare(b.startTime));
		}
		return session;
	});

	return sessions.sort((a, b) => {
		if (a.day !== b.day) return a.day.localeCompare(b.day);
		return a.startTime.localeCompare(b.startTime);
	});
};

const mapNews = async (rows) => {
	const news = [];
	for (const row of rows) {
		const props = row.properties;
		const id = row.id;
		const title = String(getProp(props, 'Title') || getProp(props, 'Name') || 'Untitled Event');
		const rawHead = getProp(props, 'Headphoto') || getProp(props, 'Image') || getProp(props, 'Photo');
		const imageUrl = extractImageUrl(rawHead);
		const baseSlug = slugify(title) || `news_${id.replace(/-/g, '').slice(-8)}`;

		news.push({
			id,
			title,
			subtitle: String(getProp(props, 'Subtitle') || ''),
			content: String(getProp(props, 'Content') || ''),
			date: String(getProp(props, 'Date') || ''),
			createdTime: String(getProp(props, 'Created') || ''),
			place: String(getProp(props, 'Location') || ''),
			image: await downloadImage(imageUrl, NEWS_IMG_DIR, '/images/news', baseSlug, PLACEHOLDER_PATHS.news),
			link: String(getProp(props, 'Link') || ''),
		});
	}
	return news.sort((a, b) => {
		const timeA = new Date(a.createdTime || a.date).getTime();
		const timeB = new Date(b.createdTime || b.date).getTime();
		return timeB - timeA;
	});
};

// ---------- 驗證（對齊 content.fallback.test.ts 的斷言 + 本地化不變量） ----------

// src/content.shared.ts CONFIG.imageAdjustments 的 9 個 person id（裁切設定依 id 對應，遺失即失效）
const ADJUSTED_IDS = [
	'311ceff5-4470-8117-8d4c-d17d7183827a',
	'311ceff5-4470-8142-8792-ec014e1a5e33',
	'311ceff5-4470-8131-ae27-c0f2517a578c',
	'311ceff5-4470-81d8-bdcf-cfc11bb7ca6a',
	'311ceff5-4470-81ea-a6d7-ffd10930330a',
	'311ceff5-4470-81a9-99cd-eff7d65fe9f4',
	'311ceff5-4470-811a-8fcd-e302394efe28',
	'311ceff5-4470-81c4-84a2-f4a94b0d1341',
	'312ceff5-4470-8028-86dc-e3c4f50f3942',
];

const validate = (people, sessions, news) => {
	const errors = [];
	if (people.length === 0) errors.push('people 為空');
	if (news.length === 0) errors.push('news 為空');
	if (sessions.length === 0) errors.push('sessions 為空');
	if (!people.some((p) => /chair/i.test(p.chairType))) errors.push('缺 committee (chair) 資料');
	// live 資料庫沒有 keynote 類型的人（AgendaPage 對此顯示 TBD 文案），不列為錯誤
	if (!people.some((p) => /keynote/i.test(p.chairType))) {
		console.warn('[note] people 中無 keynote 類型（與 live 現況一致，/agenda keynote 區塊顯示 TBD）');
	}
	if (!sessions.some((s) => s.topics && s.topics.length > 0)) errors.push('sessions 缺 nested topics');

	const externalImages = [
		...people.filter((p) => /^http/.test(p.image)).map((p) => `person ${p.name}: ${p.image}`),
		...news.filter((n) => /^http/.test(n.image)).map((n) => `news ${n.title}: ${n.image}`),
	];
	if (externalImages.length > 0) errors.push(`image 欄位仍有外部 URL：\n    ${externalImages.join('\n    ')}`);

	if (errors.length > 0) {
		throw new Error(`凍結資料驗證失敗：\n  - ${errors.join('\n  - ')}`);
	}

	const peopleIds = new Set(people.map((p) => p.id));
	for (const id of ADJUSTED_IDS) {
		if (!peopleIds.has(id)) {
			console.warn(`[warn] imageAdjustments 的 id ${id} 不在抓回的 people 中（該裁切設定將失效）`);
		}
	}
};

// ---------- 產出 ----------

const emit = (people, sessions, news) => {
	const serialize = (value) => JSON.stringify(value, null, '\t');
	return `// AUTO-GENERATED by scripts/freeze-notion-data.mjs on ${new Date().toISOString()}
// 活動結束後自 Notion 凍結的資料快照，請勿手動編輯；需更新時重跑：
//   node scripts/freeze-notion-data.mjs
// Source DBs — people: ${DB.people} / sessions: ${DB.sessions} / topics: ${DB.topics} / news: ${DB.news}
// 詳見 HANDOVER.md

export const FROZEN_PEOPLE: PersonItem[] = ${serialize(people)};

export const FROZEN_SESSIONS: SessionItem[] = ${serialize(sessions)};

// 注意：站上公告實際使用 src/announcementsData.ts（含 modal / linkLabel 等 Notion 沒有的欄位），
// FROZEN_NEWS 僅為 Notion News 資料庫的凍結快照，目前無程式引用。
export const FROZEN_NEWS: NewsItem[] = ${serialize(news)};
`;
};

// ---------- main ----------

const main = async () => {
	console.log(`[mode]  ${DRY_RUN ? 'dry-run（不寫檔）' : 'freeze'}`);
	console.log(`[proxy] ${PROXY_URL}\n`);

	if (!DRY_RUN) {
		mkdirSync(PEOPLE_IMG_DIR, { recursive: true });
		mkdirSync(NEWS_IMG_DIR, { recursive: true });
	}

	// placeholder 先各抓一份（人物/新聞缺圖時代用，取代原本的 Unsplash 熱連結）
	await downloadImage(PLACEHOLDER_SOURCES.person, PEOPLE_IMG_DIR, '/images/people', '_placeholder_person', PLACEHOLDER_PATHS.person);
	await downloadImage(PLACEHOLDER_SOURCES.news, NEWS_IMG_DIR, '/images/news', '_placeholder_news', PLACEHOLDER_PATHS.news);

	console.log('[fetch] people…');
	const peopleRows = await queryNotionDatabase(DB.people);
	console.log(`        ${peopleRows.length} rows`);
	const people = await mapPeople(peopleRows);

	console.log('[fetch] sessions + topics…');
	const [sessionRows, topicRows] = await Promise.all([queryNotionDatabase(DB.sessions), queryNotionDatabase(DB.topics)]);
	console.log(`        ${sessionRows.length} sessions, ${topicRows.length} topics`);
	// peopleMap 用「改寫後」的 person 物件，讓 chairs 內嵌資料也吃到本地圖片路徑
	const peopleMap = new Map(people.map((p) => [p.id, p]));
	const sessions = mapSessions(sessionRows, topicRows, peopleMap);

	console.log('[fetch] news…');
	const newsRows = await queryNotionDatabase(DB.news);
	console.log(`        ${newsRows.length} rows`);
	const news = await mapNews(newsRows);

	validate(people, sessions, news);

	console.log(`\n[stats] people=${people.length} sessions=${sessions.length} news=${news.length}`);
	console.log(`[stats] images downloaded=${downloadedByUrl.size} failed=${failedDownloads.length}`);
	if (failedDownloads.length > 0) {
		console.warn('\n[warn] 以下圖片下載失敗，已代入 placeholder，請手動補檔後把資料中的路徑改回：');
		for (const f of failedDownloads) console.warn(`  - ${f.baseSlug}: ${f.url}  (${f.reason})`);
	}

	if (DRY_RUN) {
		console.log('\n[dry-run] 未寫入任何檔案。確認統計無誤後移除 --dry-run 再執行。');
		return;
	}

	writeFileSync(OUTPUT_FILE, emit(people, sessions, news), 'utf8');
	console.log(`\n[done] 已寫入 ${OUTPUT_FILE}`);
};

main().catch((err) => {
	console.error(`\n[error] ${err.message}`);
	process.exit(1);
});
