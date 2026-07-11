import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Note: a Tailwind class sorter runs on save in the editor and reorders utility
// classes within a className string (this has no effect on the rendered CSS —
// Tailwind's cascade order comes from the generated stylesheet, not attribute
// order). Assertions below check for distinctive tokens rather than exact
// multi-class sequences so they don't break every time the formatter re-sorts.

test('program page uses the figma-driven dark design system', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /content\.programPageSection/);
	// Page title uses the sitewide standard (ds-page-title + typography.scale.pageTitle),
	// not the old bespoke font-pixel sizing.
	assert.match(source, /ds-page-title/);
	assert.match(source, /typography\.scale\.pageTitle/);
	assert.doesNotMatch(source, /text-5xl font-pixel/);
	assert.match(source, /bg-zinc-950\/80/);
	assert.match(source, /border-zinc-800/);
	assert.match(source, /text-program-green/);
	assert.match(source, /rounded-\[14px\]/);
	assert.doesNotMatch(source, /shadow-/);
});

test('program page keeps schedule-row bios expanding inline via a named accordion group', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.doesNotMatch(source, /FeaturedCardRow/);
	assert.doesNotMatch(source, /featuredCards/);
	assert.match(source, /row\.fullBio/);
	assert.match(source, /row\.workHeading/);
	assert.match(source, /row\.workDescription/);
	assert.match(source, /<details className='border-b group\/row border-zinc-800'>/);
	assert.match(source, /group-open\/row:rotate-180/);
});

test('program page wires the time/location label into both day1 partner cards and day2 static sessions', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const timeLocationUses = source.match(/<TimeLocationBlock label=\{labels\.timeLocationLabel\} time=\{session\.time\} location=\{session\.location\} \/>/g) ?? [];
	assert.equal(timeLocationUses.length, 2);
	assert.doesNotMatch(source, /label=''/);
});

test('program page schedule-row expand chevron rotates and is visually bold', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /group-open\/row:rotate-180' size=\{20\} strokeWidth=\{3\}/);
});

test('program page keeps bottom spacing before the footer on both day1 and day2 views', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const pb16Wrappers = source.match(/<div className='pb-16'>/g) ?? [];
	assert.equal(pb16Wrappers.length, 2);
});

test('program page adapts layout across breakpoints', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /px-6/);
	assert.match(source, /md:px-20 md:pt-48/);
	assert.match(source, /grid-cols-\[72px_1fr\] items-center gap-3 py-3 sm:grid-cols-\[202px_1fr\]/);
	assert.match(source, /flex flex-col gap-4 pb-6 sm:flex-row sm:gap-6 sm:pl-\[214px\]/);
});

test('program page is routed at /program and the Navbar link is wired up', () => {
	const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
	const navbarSource = readFileSync(new URL('../components/layout/Navbar.tsx', import.meta.url), 'utf8');

	assert.match(appSource, /const ProgramPage = lazy\(\(\) => import\('\.\/pages\/ProgramPage'\)\)/);
	assert.match(appSource, /<Route path='program' element={<ProgramPage \/>} \/>/);
	assert.match(navbarSource, /{ label: content\.nav\.program, to: '\/program', isActive: location\.pathname === '\/program' }/);
	assert.match(navbarSource, /{ key: 'program', label: content\.nav\.program, to: '\/program', isActive: location\.pathname === '\/program' }/);
});

test('program page renders a day-dependent hero banner and an optional day2 schedule', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /activeDay === 'day1' \? '\/images\/program_hero_bigbang\.png' : '\/images\/program_hero_bigbang2\.png'/);
	assert.match(source, /schedule\?: readonly ProgramScheduleRow\[\]/);
	assert.match(source, /<ScheduleTable rows=\{session\.schedule\} title=\{labels\.scheduleTitle\} photoLabel=\{labels\.photoPlaceholder\} \/>/);
});

test('program page day2 session renders plainly, not as a collapsible accordion', () => {
	// Day2 currently has only one session, so it is temporarily shown fully expanded
	// with no collapse affordance (see the removed <details>/<summary> treatment).
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const day2Fn = source.slice(source.indexOf('const Day2StaticSession'), source.indexOf('const ProgramPage: React.FC'));
	assert.doesNotMatch(day2Fn, /<details/);
	assert.doesNotMatch(day2Fn, /<summary/);
	assert.doesNotMatch(day2Fn, /ChevronDown/);
	assert.match(day2Fn, /<div className='flex flex-col gap-6 px-4 py-12 sm:px-8 md:px-16 md:py-20'>/);
});

test('program schedule row label wraps instead of being truncated on narrow screens', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.doesNotMatch(source, /truncate font-mono text-\[14px\]/);
});

test('program page day2 content drops the ISAT session and marks TAICHI as tentative with a schedule', () => {
	const zhSource = readFileSync(new URL('../content.zh.ts', import.meta.url), 'utf8');
	const enSource = readFileSync(new URL('../content.en.ts', import.meta.url), 'utf8');

	for (const source of [zhSource, enSource]) {
		assert.doesNotMatch(source, /day2-isat/);
		assert.match(source, /id: 'day2-taichi'/);
		assert.match(source, /label: 'Paper Session I'/);
		assert.match(source, /label: 'Paper Session IV'/);
		assert.match(source, /label: 'Award \/ Closing \/ TAICHI 2027'/);
	}

	assert.match(zhSource, /title: 'TAICHI年度學會 「暫定」'/);
	assert.match(enSource, /title: 'TAICHI Annual Society Meeting \(Tentative\)'/);
});

test('program page day1 sessions render as expandable accordions with the full inline schedule', () => {
	// Restored per visual-chair request: day1 shows the complete session info
	// inline (schedule + performance/residency/food sections), no external link.
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const day1Fn = source.slice(source.indexOf('const SessionAccordion'), source.indexOf('const ToggleReveal'));
	assert.match(day1Fn, /<details/);
	assert.match(day1Fn, /<summary/);
	assert.match(day1Fn, /<ScheduleTable rows=\{session\.schedule\}/);
	assert.doesNotMatch(day1Fn, /websiteUrl/);
	assert.doesNotMatch(source, /ExternalLink/);

	assert.match(source, /const ToggleReveal/);
	assert.match(source, /const SideBySideIntro/);
	assert.match(source, /const PerformanceSection/);
	assert.match(source, /const ResidencySection/);
	assert.match(source, /const FoodSection/);
	assert.match(source, /session\.id === 'day1-12f'/);
});
