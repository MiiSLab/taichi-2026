import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('program page uses the figma-driven dark design system and accordion pattern', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /content\.programPageSection/);
	assert.match(source, /font-pixel text-5xl text-primary/);
	assert.match(source, /bg-zinc-950\/80/);
	assert.match(source, /border-zinc-800/);
	assert.match(source, /text-program-green/);
	assert.match(source, /rounded-\[14px\]/);
	assert.match(source, /<details className='group border-b border-primary'>/);
	assert.match(source, /group-open:rotate-180/);
	assert.doesNotMatch(source, /shadow-/);
});

test('program page adapts layout across breakpoints', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /px-6 pb-8 pt-40 md:px-20 md:pt-48/);
	assert.match(source, /flex flex-col gap-6 sm:flex-row sm:items-center/);
	assert.match(source, /grid-cols-\[72px_1fr\] items-center gap-3 border-b border-zinc-800 py-3 sm:grid-cols-\[202px_1fr\]/);
	assert.match(source, /grid grid-cols-1 gap-8 md:grid-cols-2/);
	assert.match(source, /sm:flex-row sm:gap-6 sm:p-6/);
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
