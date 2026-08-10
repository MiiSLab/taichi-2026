import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./EventEndedPage.tsx', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');

test('event ended page replaces /q and /vote but keeps the feature code for handover', () => {
	// 兩個 route 都掛收站頁；query 參數（舊 QR 連結的 ?t= / ?v=）落地後直接忽略
	assert.match(appSource, /<Route path='vote' element=\{<EventEndedPage \/>\} \/>/);
	assert.match(appSource, /<Route path='q' element=\{<EventEndedPage \/>\} \/>/);

	// QPage / VotePage 不再被 bundle 進站（lazy import 已註解），但檔案必須留著交接
	assert.doesNotMatch(appSource, /^const QPage = lazy/m);
	assert.doesNotMatch(appSource, /^const VotePage = lazy/m);
	assert.ok(existsSync(new URL('./QPage.tsx', import.meta.url)), 'QPage.tsx must stay for handover');
	assert.ok(existsSync(new URL('./VotePage.tsx', import.meta.url)), 'VotePage.tsx must stay for handover');
	assert.ok(existsSync(new URL('../services/votingService.ts', import.meta.url)), 'votingService.ts must stay for handover');
	assert.ok(existsSync(new URL('../services/supabaseRest.ts', import.meta.url)), 'supabaseRest.ts must stay for handover');
});

test('event ended page is static and bilingual', () => {
	// 收站頁本身不得碰任何外部服務
	assert.doesNotMatch(source, /votingService|supabaseRest|notionService|fetch\(/);

	// 雙語文案 + SEO，跟 NotFoundPage 同一套慣例
	assert.match(source, /const COPY = \{\s*\n\tzh: \{/);
	assert.match(source, /\ten: \{/);
	assert.match(source, /useSEO\(language === 'zh' \? '活動已結束' : 'Event Ended'/);

	// 導流出口：得獎名單（主）與首頁（次）
	assert.match(source, /<Link to='\/awards'/);
	assert.match(source, /<Link to='\/'/);
});
