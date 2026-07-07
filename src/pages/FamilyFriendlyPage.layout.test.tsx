import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('family-friendly page renders the Syntrend facilities list with icons and a source link', () => {
	const source = readFileSync(new URL('./FamilyFriendlyPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /section\.facilitiesHeading/);
	assert.match(source, /section\.facilities\.map/);
	assert.match(source, /facility\.floors/);

	assert.match(source, /toilet: Toilet/);
	assert.match(source, /baby: Baby/);
	assert.match(source, /milk: Milk/);
	assert.match(source, /accessibility: Accessibility/);
	assert.match(source, /droplets: Droplets/);

	assert.match(source, /section\.facilitiesSourceUrl/);
	assert.match(source, /target='_blank'/);
	assert.match(source, /rel='noreferrer'/);
	assert.match(source, /text-secondary/);
});

test('family-friendly page content defines all five facilities for both languages', () => {
	const zhSource = readFileSync(new URL('../content.zh.ts', import.meta.url), 'utf8');
	const enSource = readFileSync(new URL('../content.en.ts', import.meta.url), 'utf8');

	for (const source of [zhSource, enSource]) {
		assert.match(source, /icon: 'toilet'/);
		assert.match(source, /icon: 'baby'/);
		assert.match(source, /icon: 'milk'/);
		assert.match(source, /icon: 'accessibility'/);
		assert.match(source, /icon: 'droplets'/);
	}

	assert.match(zhSource, /facilitiesSourceUrl: 'https:\/\/www\.syntrend\.com\.tw\/service'/);
});
