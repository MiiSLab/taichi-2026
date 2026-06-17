#!/usr/bin/env node
/**
 * Upload TAICHI 2026 News announcements to the Notion News database.
 *
 * Security: the integration token is read ONLY from the NOTION_TOKEN env var.
 * Do NOT hardcode the token or read it from .env in this file.
 *
 * The News database id is the same one the frontend reads
 * (src/content.shared.ts -> CONFIG.notion.newsDatabaseId).
 *
 * Usage:
 *   NOTION_TOKEN=secret_xxx node scripts/upload-news-to-notion.mjs --inspect   # print DB schema, create nothing
 *   NOTION_TOKEN=secret_xxx node scripts/upload-news-to-notion.mjs --dry-run   # print payloads, create nothing
 *   NOTION_TOKEN=secret_xxx node scripts/upload-news-to-notion.mjs             # create the two pages
 *
 * PowerShell:
 *   $env:NOTION_TOKEN = 'secret_xxx'; node scripts/upload-news-to-notion.mjs --inspect
 */

const NEWS_DATABASE_ID = '2e8ceff5447080c7914bfdbcb9758808';
const NOTION_VERSION = '2022-06-28';
const API = 'https://api.notion.com/v1';

// Accept whichever env var name the existing (members) Notion setup uses.
const TOKEN =
	process.env.NOTION_TOKEN ||
	process.env.NOTION_API_KEY ||
	process.env.VITE_NOTION_API_KEY ||
	process.env.VITE_NOTION_TOKEN;
if (!TOKEN) {
	console.error(
		'\n[error] 找不到 Notion integration token。\n' +
			'  本 script 會依序讀取環境變數：NOTION_TOKEN / NOTION_API_KEY / VITE_NOTION_TOKEN。\n' +
			'  請用「上傳組織成員時所用的同一個 integration」token（需對 News 資料庫有寫入權限），例如：\n' +
			"    PowerShell:  $env:NOTION_TOKEN = 'secret_xxx'; node scripts/upload-news-to-notion.mjs --inspect\n" +
			'    bash:        NOTION_TOKEN=secret_xxx node scripts/upload-news-to-notion.mjs --inspect\n',
	);
	process.exit(1);
}

const mode = process.argv.includes('--inspect')
	? 'inspect'
	: process.argv.includes('--dry-run')
		? 'dry-run'
		: 'create';

const headers = {
	Authorization: `Bearer ${TOKEN}`,
	'Notion-Version': NOTION_VERSION,
	'Content-Type': 'application/json',
};

const notion = async (path, init = {}) => {
	const res = await fetch(`${API}${path}`, { ...init, headers });
	const text = await res.text();
	let json;
	try {
		json = text ? JSON.parse(text) : {};
	} catch {
		json = { raw: text };
	}
	if (!res.ok) {
		throw new Error(`Notion API ${res.status}: ${json.message || text}`);
	}
	return json;
};

// --- The two announcements (keep in sync with src/offlineFallbackData.ts OFFLINE_NEWS) ---
const TODAY = '2026-06-17';
const ANNOUNCEMENTS = [
	{
		Title: 'Call for Papers 投稿延期至 6/23',
		Subtitle: '投稿截止日期延長',
		Content:
			'TAICHI 2026 投稿截止日期延長！論文與圖像式論文（Paper & Pictorial）、海報論文（Poster）、互動展示（Demo）三類投稿截止日期，統一由原訂 2026/6/18（四）延長至 2026/6/23（二）23:59 (GMT+8)。審查結果通知（7/21）與最終完稿（7/27）日期維持不變。歡迎把握最後機會投稿！',
		Link: 'https://easychair.org/conferences/?conf=taichi2026',
		Date: TODAY,
	},
	{
		Title: '學生志工 (Student Volunteer) 招募中',
		Subtitle: 'SV 招募',
		Content:
			'TAICHI 2026 學生志工（Student Volunteer, SV）開始招募！誠摯邀請對人機互動有興趣的同學加入，協助會議現場運作，並有機會近距離參與議程、認識研究社群。歡迎填寫報名表單參加：https://forms.gle/2WNEyuApxP8yRgLV9',
		Link: 'https://forms.gle/2WNEyuApxP8yRgLV9',
		Date: TODAY,
	},
];

/**
 * Resolve the real property names/types from the DB schema, so we map fields
 * even if the column labels differ slightly from our assumptions.
 * The frontend reads: Title(title), Subtitle(rich_text), Content(rich_text),
 * Date(date), Created(date), Location(rich_text), Link(url), Headphoto(files).
 */
const findProp = (schema, candidates, expectedType) => {
	const entries = Object.entries(schema.properties || {});
	for (const want of candidates) {
		const hit = entries.find(([name]) => name.toLowerCase().replace(/\s/g, '') === want.toLowerCase().replace(/\s/g, ''));
		if (hit) return { name: hit[0], type: hit[1].type };
	}
	// fall back to the first property of the expected type
	const byType = entries.find(([, def]) => def.type === expectedType);
	return byType ? { name: byType[0], type: byType[1].type } : null;
};

const buildValue = (type, value) => {
	switch (type) {
		case 'title':
			return { title: [{ text: { content: value } }] };
		case 'rich_text':
			return { rich_text: [{ text: { content: value } }] };
		case 'url':
			return { url: value };
		case 'date':
			return { date: { start: value } };
		default:
			return null;
	}
};

const buildProperties = (schema, item) => {
	const map = {
		Title: { candidates: ['Title', 'Name'], type: 'title' },
		Subtitle: { candidates: ['Subtitle'], type: 'rich_text' },
		Content: { candidates: ['Content'], type: 'rich_text' },
		Date: { candidates: ['Date'], type: 'date' },
		Created: { candidates: ['Created'], type: 'date' },
		Link: { candidates: ['Link', 'URL'], type: 'url' },
	};

	const props = {};
	for (const [field, cfg] of Object.entries(map)) {
		if (item[field] === undefined) {
			// allow Created to mirror Date if present in schema
			if (field !== 'Created') continue;
		}
		const prop = findProp(schema, cfg.candidates, cfg.type);
		if (!prop) {
			if (field === 'Title') throw new Error('在資料庫找不到 title 欄位，無法建立 page。');
			console.warn(`  [warn] 略過欄位「${field}」：資料庫沒有對應的 ${cfg.type} 欄位。`);
			continue;
		}
		const raw = field === 'Created' ? item.Date : item[field];
		const val = buildValue(prop.type, raw);
		if (val) props[prop.name] = val;
	}
	return props;
};

const main = async () => {
	console.log(`[mode] ${mode}`);
	console.log(`[db]   ${NEWS_DATABASE_ID}\n`);

	const schema = await notion(`/databases/${NEWS_DATABASE_ID}`);

	console.log('=== 資料庫欄位 (property -> type) ===');
	for (const [name, def] of Object.entries(schema.properties || {})) {
		console.log(`  - ${name}: ${def.type}`);
	}
	console.log('');

	if (mode === 'inspect') {
		console.log('[inspect] 僅檢視結構，未建立任何 page。');
		return;
	}

	for (const item of ANNOUNCEMENTS) {
		const properties = buildProperties(schema, item);
		const payload = { parent: { database_id: NEWS_DATABASE_ID }, properties };

		if (mode === 'dry-run') {
			console.log('=== [dry-run] 將建立 ===');
			console.log(JSON.stringify(payload, null, 2));
			console.log('');
			continue;
		}

		const created = await notion('/pages', { method: 'POST', body: JSON.stringify(payload) });
		console.log(`[created] ${item.Title}  ->  ${created.id}`);
	}

	if (mode === 'create') console.log('\n[done] 兩則公告已上傳。');
	else console.log('\n[dry-run] 未實際建立，確認 payload 後移除 --dry-run 再執行一次。');
};

main().catch((err) => {
	console.error(`\n[error] ${err.message}`);
	process.exit(1);
});
