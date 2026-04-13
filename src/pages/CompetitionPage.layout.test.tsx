import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('competition page uses the shared organization-style static panel for the coming-soon block', () => {
	const source = readFileSync(new URL('./CompetitionPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /pt-48/);
	assert.match(source, /import \{ typography \} from '\.\.\/design-system\/typography'/);
	assert.match(source, /typography\.scale\.pageTitle/);
	assert.match(source, /content\.competitionSection\.badge/);
	assert.match(source, /ds-surface-panel/);
	assert.match(source, /ds-section-title/);
	assert.match(source, /content\.competitionSection\.highlightTitle/);
	assert.match(source, /content\.competitionSection\.description/);
	assert.doesNotMatch(source, /bg-\[radial-gradient\(circle_at_center,rgba\(168,240,32,0\.18\),transparent_68%\)\]/);
});
