import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('cfp page keeps shared hero structure and typography tokens wired in', () => {
	const source = readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8');

	assert.equal(source.match(/SUBMISSION DEADLINE/g)?.length, 3);
	assert.match(source, /mainTitle: language === 'zh' \? '論文與圖像式論文' : 'Full Paper & Pictorial'/);
	assert.match(source, /mainTitle: language === 'zh' \? '海報論文' : 'Poster'/);
	assert.match(source, /mainTitle: language === 'zh' \? '互動展示' : 'Interactivity and Demo'/);
	assert.match(source, /taiwanchi26\+demo@gmail\.com/);
	assert.match(source, /inline-block whitespace-nowrap break-normal/);
	assert.match(source, /min-w-0 break-words \[overflow-wrap:anywhere\]/);
	assert.doesNotMatch(source, /'break-all'/);
	assert.match(source, /import FramePanel from '\.\.\/components\/FramePanel'/);
	assert.match(source, /import \{ panelFrame \} from '\.\.\/design-system\/panel'/);
	assert.match(source, /border-transparent bg-transparent md:border-\[#A8F020\]\/40 md:bg-black\/60/);
	assert.match(source, /cornerClassName='hidden md:block'/);
	assert.match(source, /import \{ typography \} from '\.\.\/design-system\/typography'/);
	assert.match(source, /typography\.scale\.pageTitle/);
	assert.match(source, /typography\.scale\.sectionEyebrow/);
	assert.match(source, /typography\.scale\.deadlineValue/);
	assert.match(source, /typography\.scale\.deadlineMeta/);
	assert.match(source, /typography\.scale\.body/);
	assert.match(source, /panelFrame\.sectionDivider/);
	assert.match(source, /typography\.scale\.pageTitle\} text-\[#A8F020\]/);
	assert.match(source, /content\.cfpSection\.importantDatesTitle/);
	assert.match(source, /flex h-full min-h-\[112px\] w-full max-w-\[28rem\] flex-col items-center justify-start/);
	assert.match(source, /<ConstellationMapSection language=\{language\} \/>/);
	assert.match(source, /<SubmissionButton \/>/);
	assert.match(source, /content\.cfpSection\.heroTimelineItems\.map/);
});

test('cfp page keeps notes and chairs inside framed panels for clear section boundaries', () => {
	const source = readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /const ChairsPanel = \(\{ title, chairs \}: \{ title: string; chairs: string\[\] \}\) => \(\s*<FramePanel className='h-full'/s);
	assert.match(source, /<FramePanel className='h-full min-h-\[320px\]' contentClassName='px-8 pb-8 pt-5 xl:p-8'>/);
	assert.match(source, /<FramePanel className='h-full' contentClassName='p-8'>/);
});
