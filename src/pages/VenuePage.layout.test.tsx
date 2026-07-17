import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('venue page renders both day heroes with the same cover-background treatment', () => {
	const source = readFileSync(new URL('./VenuePage.tsx', import.meta.url), 'utf8');

	assert.match(source, /venueContent\.days\.map\(day => \(/);
	assert.match(source, /backgroundImage: `linear-gradient\(90deg,/);
	assert.match(source, /backgroundSize: 'cover'/);
	assert.doesNotMatch(source, /heroImageContain/);
	assert.match(source, /className='relative mx-auto flex min-h-\[420px\]/);
});

test('both venue days point at their own wide banner artwork', () => {
	const zhSource = readFileSync(new URL('../content.zh.ts', import.meta.url), 'utf8');

	assert.match(zhSource, /heroImage: '\/images\/venue_8_5_banner\.png'/);
	assert.match(zhSource, /heroImage: '\/images\/venue_8_6_banner\.png'/);
	assert.doesNotMatch(zhSource, /heroImageContain/);
	assert.doesNotMatch(zhSource, /day1location\.avif/);
	// day2's hero is themed banner art now, not the venue photo it used to reuse
	assert.doesNotMatch(zhSource, /heroImage: '\/images\/day2location\.avif'/);
});
