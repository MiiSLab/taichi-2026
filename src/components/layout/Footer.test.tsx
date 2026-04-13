import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('footer source matches fixed figma brand signature layout', () => {
	const source = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8');

	assert.match(source, /TAICHI 2026/);
	assert.match(source, /BIG BANG! FUTURES!/);
	assert.match(source, /COPYRIGHT © 2026 TAICHI/);
	assert.match(source, /FOLLOW US/);
	assert.match(source, /content\.contact\.email/);
	assert.match(source, /href=\{`mailto:\$\{content\.contact\.email\}`\}/);
	assert.match(source, /ds-footer-shell/);
	assert.match(source, /ds-footer-brand/);
	assert.match(source, /ds-footer-meta/);
	assert.match(source, /ds-footer-link/);
	assert.match(source, /ds-footer-social-label/);
	assert.match(source, /ds-divider-brand/);
	assert.match(source, /justify-between/);
	assert.match(source, /text-right/);
	assert.match(source, /md:items-end/);
	assert.match(source, /md:min-h-\[92px\]/);
	assert.match(source, /md:justify-end/);
	assert.doesNotMatch(source, /bg-lab-lime/);
	assert.doesNotMatch(source, /content\.footer\.title/);
	assert.doesNotMatch(source, /content\.footer\.copyright/);
	assert.doesNotMatch(source, /content\.footer\.credits/);
});
