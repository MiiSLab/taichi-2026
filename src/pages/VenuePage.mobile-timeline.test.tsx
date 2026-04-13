import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('mobile timeline uses multiline centered labels for 8/5 and 8/6', () => {
	const source = readFileSync(new URL('./VenuePage.tsx', import.meta.url), 'utf8');

	assert.match(source, /label: '8\/5', sublabel: 'TAICHI\\n晶創人文\\nAPMAR\\nISAT'/);
	assert.match(source, /label: '8\/6', sublabel: 'TAICHI'/);
	assert.match(source, /whitespace-pre-line text-center/);
	assert.match(source, /onMouseEnter=\{onHover\}/);
	assert.match(source, /onClick=\{onSelect\}/);
	assert.match(source, /mx-4 mb-4 mt-5 h-\[280px\] bg-\[rgba\(9,9,11,0\.8\)\] p-4 md:absolute md:inset-x-4 md:bottom-4 md:top-\[196px\]/);
	assert.match(source, /ds-backtotop/);
});
