import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CONTENT_EN } from '../content.en';
import { CONTENT_ZH } from '../content.zh';

test('CFP page source keeps redesigned paper sections and shared CTA typography', () => {
	const source = readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /論文與圖像式論文/);
	assert.match(source, /海報論文/);
	assert.match(source, /今年海報展出會開放大眾參觀。/);
	assert.match(source, /DESK REJECT/);
	assert.match(source, /Paper & Pictorial Chairs/);
	assert.match(source, /text-\[12px\]/);
	assert.match(source, /ds-button-primary/);
	assert.match(source, /ds-panel-heading/);
	assert.match(source, /ds-panel-subheading/);
	assert.match(source, /ds-backtotop/);
	assert.match(source, /typography\.scale\.buttonLabel/);
});

test('zh paper content keeps only the requested desk reject and chairs entries', () => {
	const paperCategory = CONTENT_ZH.cfpSection.categories.find((category) => category.id === 'papers');

	assert.ok(paperCategory);
	assert.ok(
		paperCategory.description.includes(
			'● 若投稿論文之主題與研討會徵稿範圍不符、研究貢獻不明確或未完整呈現，或未依規定格式撰寫，主辦單位有權於審查前進行初步篩選並直接退稿（desk reject）。以下為可能之情況說明：',
		),
	);
	assert.ok(
		paperCategory.description.includes(
			'● ● __研究範疇（Scope）__：未能充分回顧相關文獻，或缺乏足夠脈絡以說明研究之新穎性與對設計研究或互動系統領域之貢獻。論文應適當建立於既有研究、設計實務或相關領域之基礎上，且其貢獻應與篇幅相符。',
		),
	);
	assert.ok(
		paperCategory.description.includes(
			'● ● __方法論（Methodology）__：未提供足夠資訊以說明研究方法與過程，包含概念架構不清、論證不完整，或缺乏方法描述與研究透明度。',
		),
	);
	assert.ok(paperCategory.description.includes('● ● __資料（Data）__：缺乏足夠資料或證據支持分析與研究主張，致使研究結論難以驗證。'));
	assert.equal(paperCategory.description.filter((line) => line === '論文主席').length, 1);
	assert.deepEqual(
		paperCategory.description.filter((line) => line.includes(' / ') && !line.includes('taiwanchi26+paper@gmail.com')).slice(-4),
		[
			'Yaliang Chuang / 莊雅量 / 國立清華大學藝術與設計系',
			'Shan Yuan Teng / 鄧善元 / 國立臺灣大學資訊工程學系',
			'Hsin-Ruey (Ray) Tsai / 蔡欣叡 / 國立政治大學資訊科學系',
			'Yu-Chun (Grace) Yen / 顏羽君 / 國立陽明交通大學資訊工程系',
		],
	);
	assert.ok(paperCategory.description.some((line) => line.includes('taiwanchi26+paper@gmail.com')));
	assert.match(readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8'), /chairHeading: 'Paper & Pictorial Chairs'/);
});

test('zh poster and demo content align section markers with english chairs blocks', () => {
	const source = readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8');
	const posterCategory = CONTENT_ZH.cfpSection.categories.find((category) => category.id === 'posters');
	const demoCategory = CONTENT_ZH.cfpSection.categories.find((category) => category.id === 'demos');

	assert.ok(posterCategory);
	assert.ok(demoCategory);
	assert.ok(posterCategory.description.includes('海報主席'));
	assert.ok(demoCategory.description.includes('展示主席'));
	assert.ok(posterCategory.description.some((line) => line.includes('taiwanchi26+poster@gmail.com')));
	assert.ok(demoCategory.description.some((line) => line.includes('taiwanchi26+demo@gmail.com')));
	assert.match(source, /findDescriptionIndex\(category\.description, \['Poster Chairs', '海報主席'\]\)/);
	assert.match(source, /findDescriptionIndex\(category\.description, \['Demo Chairs', '展示主席'\]\)/);
	assert.match(source, /chairHeading: 'Poster Chairs'/);
	assert.match(source, /chairHeading: 'Demo Chairs'/);
});

test('en paper content keeps notes and desk reject policy as separate sections', () => {
	const paperCategory = CONTENT_EN.cfpSection.categories.find((category) => category.id === 'papers');

	assert.ok(paperCategory);

	const notesIndex = paperCategory.description.indexOf('Notes');
	const deskRejectHeadingIndex = paperCategory.description.indexOf('Desk Reject Policy');
	const deskRejectIntroIndex = paperCategory.description.findIndex((line) => line.includes('before review (desk reject)'));

	assert.ok(notesIndex >= 0);
	assert.ok(deskRejectHeadingIndex > notesIndex);
	assert.equal(deskRejectIntroIndex, deskRejectHeadingIndex + 1);
	assert.ok(paperCategory.description.slice(notesIndex + 1, deskRejectHeadingIndex).every((line) => line !== 'Desk Reject Policy'));
	assert.match(
		readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8'),
		/findDescriptionIndex\(category\.description, \['直接退稿規定', 'Desk Reject Policy'\]\)/,
	);
});
