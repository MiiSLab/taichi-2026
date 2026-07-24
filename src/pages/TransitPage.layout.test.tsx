import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('transit page is routed at /transit via a lazy import', () => {
	const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');

	assert.match(appSource, /const TransitPage = lazy\(\(\) => import\('\.\/pages\/TransitPage'\)\)/);
	assert.match(appSource, /<Route path='transit' element={<TransitPage \/>} \/>/);
});

test('transit page reuses the program date-tab pattern and venue travel panels', () => {
	const source = readFileSync(new URL('./TransitPage.tsx', import.meta.url), 'utf8');

	// hero + title share the program/venue shell
	assert.match(source, /ds-page-title/);
	assert.match(source, /typography\.scale\.pageTitle/);
	// hash-driven day tabs copied from ProgramPage
	assert.match(source, /location\.hash === '#day2' \? 'day2' : 'day1'/);
	assert.match(source, /navigate\(`#\$\{tab\.key\}`\)/);
	assert.match(source, /border-primary bg-primary text-black/);
	// figma frameless travel layout: orange section titles + green sub-headings
	assert.match(source, /const SubHeading = /);
	// google map iframe keeps the venue referrer policy
	assert.match(source, /referrerPolicy='no-referrer-when-downgrade'/);
});

test('transit content defines both days for both languages', () => {
	const zhSource = readFileSync(new URL('../content.zh.ts', import.meta.url), 'utf8');
	const enSource = readFileSync(new URL('../content.en.ts', import.meta.url), 'utf8');

	for (const source of [zhSource, enSource]) {
		assert.match(source, /transitSection: \{/);
		assert.match(source, /dateTabs:/);
	}
	assert.match(zhSource, /'08\/05 交通方式'/);
	assert.match(zhSource, /'08\/06 交通方式'/);
	assert.match(zhSource, /南瓜門/);
	assert.match(enSource, /\.\.\.CONTENT_ZH\.transitSection/);
	assert.match(enSource, /'08\/05 Getting There'/);
});
