import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('constellation map source defaults mobile users to radar and keeps radar autoplay active across breakpoints', () => {
	const source = readFileSync(new URL('./ConstellationMap.tsx', import.meta.url), 'utf8');

	assert.match(source, /const \[isMobile, setIsMobile\] = useState\(false\)/);
	assert.match(source, /const \[viewMode, setViewMode\] = useState<ViewMode>\('constellation'\)/);
	assert.match(source, /window\.matchMedia\('\(max-width: 767px\)'\)/);
	assert.match(source, /setViewMode\(mediaQuery\.matches \? 'radar' : 'constellation'\)/);
	assert.match(source, /setSelectedTheme\(THEMES\[0\]\)/);
	assert.match(source, /window\.setInterval/);
	assert.match(source, /if \(viewMode !== 'radar'\)/);
	assert.match(source, /const currentIndex = currentTheme \? THEMES\.indexOf\(currentTheme\) : -1/);
	assert.match(source, /return THEMES\[\(currentIndex \+ 1\) % THEMES\.length\]/);
	assert.match(source, /const modes = isMobile \? \[/);
	assert.match(source, /!isMobile && viewMode === 'constellation'/);
});
