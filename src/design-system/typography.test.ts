import assert from 'node:assert/strict';
import test from 'node:test';

import { typography } from './typography';

test('page title typography scales down more aggressively on mobile while preserving desktop size', () => {
	assert.match(typography.scale.pageTitle, /text-\[clamp\(2\.1rem,11vw,3\.05rem\)\]/);
	assert.match(typography.scale.pageTitle, /tracking-\[0\.08em\]/);
	assert.match(typography.scale.pageTitle, /sm:text-5xl/);
	assert.match(typography.scale.pageTitle, /md:text-8xl/);
});

test('body typography tokens follow the proposed reading scale', () => {
	assert.equal(typography.scale.micro, 'font-sans text-[12px] leading-4');
	assert.equal(typography.scale.label, 'font-sans text-[14px] leading-5');
	assert.equal(typography.scale.body, 'font-sans text-[16px] leading-7');
	assert.equal(typography.scale.bodyLg, 'font-sans text-[18px] leading-8');
});
