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

	assert.match(source, /label=\{labels\.timeLocationLabel\}/);
	assert.match(source, /label=\{timeLocationLabel\}/);
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

test('program page is reachable at the /preview staging route while Navbar stays disabled', () => {
	// WIP staging: the page is previewed at /preview; the real Navbar link and /program route
	// are wired up once the page is finalized (see TODO in App.tsx).
	const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
	const navbarSource = readFileSync(new URL('../components/layout/Navbar.tsx', import.meta.url), 'utf8');

	assert.match(appSource, /const ProgramPage = lazy\(\(\) => import\('\.\/pages\/ProgramPage'\)\)/);
	assert.match(appSource, /<Route path='preview' element={<ProgramPage \/>} \/>/);
	assert.match(navbarSource, /{ label: 'PROGRAM \(TBD\)', disabled: true }/);
	assert.match(navbarSource, /{ key: 'program', label: 'PROGRAM \(TBD\)', disabled: true }/);
});
