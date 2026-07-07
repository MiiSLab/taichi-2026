import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Note: a Tailwind class sorter runs on save in the editor and reorders utility
// classes within a className string (this has no effect on the rendered CSS —
// Tailwind's cascade order comes from the generated stylesheet, not attribute
// order). Assertions below check for distinctive tokens rather than exact
// multi-class sequences so they don't break every time the formatter re-sorts.

test('program page uses the figma-driven dark design system and accordion pattern', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /content\.programPageSection/);
	assert.match(source, /font-pixel/);
	assert.match(source, /text-5xl/);
	assert.match(source, /bg-zinc-950\/80/);
	assert.match(source, /border-zinc-800/);
	assert.match(source, /text-program-green/);
	assert.match(source, /rounded-\[14px\]/);
	assert.match(source, /<details className='[^']*border-primary[^']*'>/);
	assert.match(source, /group-open:rotate-180/);
	assert.doesNotMatch(source, /shadow-/);
});

test('program page expands schedule-row bios and intro-card toggles inline instead of a separate card list', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.doesNotMatch(source, /FeaturedCardRow/);
	assert.doesNotMatch(source, /featuredCards/);
	assert.match(source, /row\.fullBio/);
	assert.match(source, /row\.workHeading/);
	assert.match(source, /row\.workDescription/);
	assert.match(source, /group-open\/row:rotate-180/);
	assert.match(source, /const ToggleReveal/);
	assert.match(source, /card\.toggleContent/);
});

test('program page wires the time/location label into both accordion and static sessions', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const timeLocationUses = source.match(/<TimeLocationBlock label=\{labels\.timeLocationLabel\} time=\{session\.time\} location=\{session\.location\} \/>/g) ?? [];
	assert.equal(timeLocationUses.length, 2);
	assert.doesNotMatch(source, /label=''/);
});

test('program page indents ToggleReveal content to line up with its own label', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /whitespace-pre-line pl-\[15px\]/);
});

test('program page shows ToggleReveal as a solid triangle placed after the label text', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	// CSS border-triangle (no icon library dependency): a 0x0 box with transparent
	// side borders and a solid top border renders as a filled downward triangle.
	assert.match(source, /h-0 w-0[^']*border-x-\[5px\][^']*border-t-\[6px\][^']*group-open\/toggle:rotate-180/);
	assert.match(source, /\{label\}\s*\n\s*<span className='h-0 w-0/);
});

test('program page nests performance/residency/food content inside the 12F night-market accordion', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /children\?: React\.ReactNode/);
	assert.match(source, /\{session\.id === 'day1-12f' && \(/);
	assert.match(source, /bg-gradient-to-b from-black to-zinc-950/);
	assert.doesNotMatch(source, /px-4 py-12 sm:px-8 md:py-20/);
	assert.match(source, /className='py-12 md:py-20'/);
});

test('program page schedule-row expand chevron rotates and is visually bold', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /group-open\/row:rotate-180' size=\{20\} strokeWidth=\{3\}/);
});

test('program page uses named tailwind groups so nested accordions do not fight over group-open state', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	// ScheduleRow and ToggleReveal are both nested inside SessionAccordion's own
	// `group` <details>. Without a distinct group name, Tailwind's `group-open:`
	// selector matches ANY ancestor `.group[open]` (not just the nearest one), so
	// expanding the outer session accordion would incorrectly force-rotate every
	// inner chevron regardless of that row/toggle's own open state.
	assert.match(source, /<details className='[^']*group\/row[^']*border-zinc-800'>/);
	assert.match(source, /group-open\/row:rotate-180/);
	assert.match(source, /<details className='group\/toggle'>/);
	assert.match(source, /group-open\/toggle:rotate-180/);
	assert.doesNotMatch(source, /<details className='group'>/);
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
	assert.match(source, /flex flex-col gap-6 sm:flex-row sm:items-center/);
	assert.match(source, /grid-cols-\[72px_1fr\] items-center gap-3 py-3 sm:grid-cols-\[202px_1fr\]/);
	assert.match(source, /grid grid-cols-1 gap-8 md:grid-cols-2/);
	assert.match(source, /flex flex-col gap-4 pb-6 sm:flex-row sm:gap-6 sm:pl-\[214px\]/);
});

test('program page is routed at /program while the Navbar link stays disabled', () => {
	// The route itself is live at /program, but the real Navbar link is wired up
	// once the page is finalized (see TODO in App.tsx).
	const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
	const navbarSource = readFileSync(new URL('../components/layout/Navbar.tsx', import.meta.url), 'utf8');

	assert.match(appSource, /const ProgramPage = lazy\(\(\) => import\('\.\/pages\/ProgramPage'\)\)/);
	assert.match(appSource, /<Route path='program' element={<ProgramPage \/>} \/>/);
	assert.match(navbarSource, /{ label: 'PROGRAM \(TBD\)', disabled: true }/);
	assert.match(navbarSource, /{ key: 'program', label: 'PROGRAM \(TBD\)', disabled: true }/);
});

test('program page renders a day-dependent hero banner and an optional day2 schedule', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /activeDay === 'day1' \? '\/images\/program_hero_bigbang\.png' : '\/images\/program_hero_bigbang2\.png'/);
	assert.match(source, /schedule\?: readonly ProgramScheduleRow\[\]/);
	assert.match(source, /<ScheduleTable rows=\{session\.schedule\} title=\{labels\.scheduleTitle\} photoLabel=\{labels\.photoPlaceholder\} \/>/);
});

test('program page day2 session is collapsible like day1 accordions', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const day2Fn = source.slice(source.indexOf('const Day2StaticSession'), source.indexOf('const ProgramPage: React.FC'));
	assert.match(day2Fn, /<details className='border-b group border-primary'>/);
	assert.match(day2Fn, /<summary className='flex cursor-pointer list-none/);
	assert.match(day2Fn, /group-open:rotate-180/);
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
