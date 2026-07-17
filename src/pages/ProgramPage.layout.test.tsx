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
	assert.doesNotMatch(source, /shadow-/);
});

test('program page wires the time/location label into both the day1 joint block and day2 static sessions', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const timeLocationUses = source.match(/<TimeLocationBlock label=\{(?:section\.)?labels\.timeLocationLabel\}/g) ?? [];
	assert.equal(timeLocationUses.length, 2);
	assert.match(source, /time=\{day1\.time\} location=\{day1\.location\}/);
	assert.doesNotMatch(source, /label=''/);
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
	// timetable: narrow time column on mobile (start/end stacked), widens on sm+ (single line)
	assert.match(source, /grid-cols-\[60px_1fr_1fr\] gap-x-2 sm:grid-cols-\[150px_1fr_1fr\] sm:gap-x-4/);
	assert.match(source, /row\.time\.split/);
});

test('program page is routed at /program and the Navbar link is wired up', () => {
	const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
	const navbarSource = readFileSync(new URL('../components/layout/Navbar.tsx', import.meta.url), 'utf8');

	assert.match(appSource, /const ProgramPage = lazy\(\(\) => import\('\.\/pages\/ProgramPage'\)\)/);
	assert.match(appSource, /<Route path='program' element={<ProgramPage \/>} \/>/);
	assert.match(navbarSource, /{ label: content\.nav\.program, to: '\/program', isActive: location\.pathname === '\/program' }/);
	assert.match(navbarSource, /{ key: 'program', label: content\.nav\.program, to: '\/program', isActive: location\.pathname === '\/program' }/);

	// day tabs surface as a pinned navbar submenu (like /venue) and are hash-driven,
	// so /program#day2 deep-links (navbar submenu + venue schedule buttons) work
	const programSource = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');
	assert.match(navbarSource, /isProgramPage/);
	assert.match(navbarSource, /content\.programPageSection\.dateTabs\.map/);
	assert.match(programSource, /location\.hash === '#day2' \? 'day2' : 'day1'/);
	assert.doesNotMatch(programSource, /useState<'day1' \| 'day2'>/);
});

test('program page mounts both day banners so switching days swaps instantly', () => {
	// Both <img> stay in the DOM (hidden one still downloads) — no visible
	// loading delay when toggling day1/day2.
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /src='\/images\/program_hero_bigbang\.avif'/);
	assert.match(source, /src='\/images\/program_hero_bigbang2\.avif'/);
	assert.match(source, /activeDay === 'day1' \? 'w-full' : 'hidden'/);
	assert.match(source, /activeDay === 'day2' \? 'w-full' : 'hidden'/);
});

test('program page day2 session renders plainly, not as a collapsible accordion', () => {
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	const day2Fn = source.slice(source.indexOf('const Day2StaticSession'), source.indexOf('const ProgramPage: React.FC'));
	assert.doesNotMatch(day2Fn, /<details/);
	assert.doesNotMatch(day2Fn, /<summary/);
	assert.doesNotMatch(day2Fn, /ChevronDown/);
	assert.match(day2Fn, /<div className='flex flex-col gap-6 px-4 py-12 sm:px-8 md:px-16 md:py-20'>/);
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
		// non-session slots carry kind: 'break' so the timetable can mute them
		assert.match(source, /label: 'Registration', kind: 'break'/);
		assert.match(source, /label: 'Lunch Break', kind: 'break'/);
		assert.match(source, /label: 'Coffee Break', kind: 'break'/);
	}

	assert.match(zhSource, /title: 'TAICHI年度學會 「暫定」'/);
	assert.match(enSource, /title: 'TAICHI Annual Society Meeting \(Tentative\)'/);
});

test('program page renders both days through the shared calendar-style timetable', () => {
	// One generic DayTimetable: day1 = one hero block per venue (simplified),
	// day2 = every event as its own proportional block, incl. the second venue.
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /const DayTimetable/);
	assert.match(source, /const parseTimeRange/);
	assert.match(source, /VENUE_TONES/);
	// timetable title sits outside the dark table box as a real section heading
	// (h2, white, neutral underline) — distinct from the small colored venue headers
	assert.match(source, /\{title\}<\/h2>/);
	assert.doesNotMatch(source, /\{title\}<\/p>/);
	// header row underline is neutral, not brand red
	assert.doesNotMatch(source, /border-b-2 border-primary/);
	// break slots (registration/coffee/lunch) render muted + dashed, unlike sessions
	assert.match(source, /event\.kind === 'break'/);
	assert.match(source, /border-dashed/);
	// time-interval rows in the left column; venue blocks span the rows they overlap
	assert.match(source, /const rowSpanFor/);
	assert.match(source, /gridRow: `\$\{span\.first \+ 2\} \/ \$\{span\.last \+ 3\}`/);
	assert.match(source, /scheduleTimes/);
	// both days feed the same component
	assert.match(source, /venues=\{day1Venues\}/);
	assert.match(source, /venues=\{day2Venues\}/);
	assert.match(source, /day2Info\.venueHeaders\.main/);
	assert.match(source, /day2Info\.secondVenue/);
	// legacy per-row schedule list is gone
	assert.doesNotMatch(source, /ScheduleTable/);
	assert.doesNotMatch(source, /group-open\/row/);
});

test('program page day1 renders one joint event with the venue-block timetable', () => {
	// Per visual chair: day1 is a single joint event (晶創人文/TAICHI/APMAR/ISAT).
	// The Big Bang! Futures site link stays disabled until the site ships.
	const source = readFileSync(new URL('./ProgramPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /'day1-5f'/);
	assert.match(source, /'day1-12f'/);
	assert.match(source, /day1\.venueColumns/);
	assert.match(source, /day1\.venueBlocks/);
	// multi-line block titles (未來演講\nFuture Stage etc.)
	assert.match(source, /whitespace-pre-line/);
	assert.match(source, /\{day1\.title\}/);
	assert.match(source, /\{day1\.description\}/);

	// live event site link (official URL shipped — no more disabled button / pending note)
	assert.match(source, /href=\{day1\.websiteUrl\}/);
	assert.match(source, /ExternalLink/);
	assert.doesNotMatch(source, /websitePendingLabel/);
	assert.doesNotMatch(source, /SessionAccordion/);

	// joint title/description live in the day1 block, not under the hero image
	assert.doesNotMatch(source, /heroCaption/);
	assert.doesNotMatch(source, /heroDescription/);

	// the performance / residency (works) / food intro sections were removed from day1
	assert.doesNotMatch(source, /PerformanceSection/);
	assert.doesNotMatch(source, /ResidencySection/);
	assert.doesNotMatch(source, /FoodSection/);
	assert.doesNotMatch(source, /photoPlaceholder/);
});

test('program content defines the timetable venues in both languages', () => {
	const zhSource = readFileSync(new URL('../content.zh.ts', import.meta.url), 'utf8');
	const enSource = readFileSync(new URL('../content.en.ts', import.meta.url), 'utf8');

	for (const source of [zhSource, enSource]) {
		assert.match(source, /venueColumns/);
		assert.match(source, /venueBlocks/);
		// official day1 event site is live — pending label removed from labels
		assert.match(source, /websiteUrl: 'https:\/\/humanities-ic\.tw\/'/);
		assert.doesNotMatch(source, /websitePendingLabel/);
		// bilingual brand strings, identical across languages
		assert.match(source, /title: '未來演講\\nFuture Stage'/);
		assert.match(source, /title: '互動夜市\\nBig Bang!\\nNight Market!'/);
		// day2 second venue placeholder until the classroom agenda is confirmed
		assert.match(source, /venueHeaders/);
		assert.match(source, /secondVenue/);
		assert.doesNotMatch(source, /heroCaption/);
		assert.doesNotMatch(source, /heroDescription/);
	}
	assert.match(zhSource, /title: '晶創人文, TAICHI, APMAR, ISAT 聯合活動'/);
	assert.match(zhSource, /f5: '5F展演廳'/);
	assert.match(zhSource, /f12: '12F多元廳'/);
	assert.match(zhSource, /main: '國際會議廳'/);
});
