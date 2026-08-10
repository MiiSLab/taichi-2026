import assert from 'node:assert/strict';
import test from 'node:test';
import { NEWS, PEOPLE, SESSIONS } from './content';

// 活動結束後 PEOPLE/SESSIONS 來自凍結快照（src/frozenData.ts）、NEWS 來自手動公告
// （src/announcementsData.ts）。live Notion 資料庫沒有 keynote 類型的人（AgendaPage
// 對此顯示 TBD 文案），故不驗 keynote。
test('static content is populated', () => {
	assert.ok(PEOPLE.length > 0, 'expected people data');
	assert.ok(NEWS.length > 0, 'expected news data');
	assert.ok(SESSIONS.length > 0, 'expected session data');

	assert.ok(PEOPLE.some((person) => /chair/i.test(person.chairType)), 'expected committee data');
	assert.ok(SESSIONS.some((session) => session.topics && session.topics.length > 0), 'expected nested topics');

	// 靜態化不變量：資料內不得殘留外部圖片連結（news 的 link 欄位可為外部 href，不在此限）
	const externalImages = [...PEOPLE, ...NEWS].filter((item) => /^http/.test(item.image ?? ''));
	assert.deepEqual(
		externalImages.map((item) => item.image),
		[],
		'expected all image fields to be local paths',
	);
});
