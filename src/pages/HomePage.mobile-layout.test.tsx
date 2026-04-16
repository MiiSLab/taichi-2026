import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('homepage and countdown source include mobile-first adaptations', () => {
	const homeSource = readFileSync(new URL('./HomePage.tsx', import.meta.url), 'utf8');
	const timerSource = readFileSync(new URL('../components/CountdownTimer.tsx', import.meta.url), 'utf8');

	assert.match(homeSource, /import ScrollCollapseSection from '\.\.\/components\/ScrollCollapseSection'/);
	assert.match(homeSource, /ds-section-title/);
	assert.match(homeSource, /typography\.scale\.sectionEyebrow/);
	assert.match(homeSource, /typography\.scale\.deadlineValue/);
	assert.match(homeSource, /typography\.scale\.deadlineMeta/);
	assert.match(homeSource, /language === 'zh'/);
	assert.match(homeSource, /投稿截止日期：/);
	assert.match(homeSource, /import ScrollReveal from '\.\.\/components\/ScrollReveal'/);
	assert.match(homeSource, /import \{ typography \} from '\.\.\/design-system\/typography'/);
	assert.match(homeSource, /<ScrollReveal delay=\{80\}>/);
	assert.match(homeSource, /<ScrollReveal delay=\{120\}>/);
	assert.match(homeSource, /<ScrollReveal delay=\{90\} className='mt-6 flex w-full justify-center'>/);
	assert.match(homeSource, /<ScrollReveal delay=\{180\} className='mt-8'>/);
	assert.match(homeSource, /<ScrollCollapseSection[\s\S]*onProgress=/);
	assert.match(homeSource, /marginTop: '-100vh'/);
	assert.match(homeSource, /nextSectionTranslateY/);
	assert.match(homeSource, /nextSectionOpacity/);
	assert.match(homeSource, /min-h-\[78dvh\][\s\S]*md:min-h-\[88dvh\]/);
	assert.match(homeSource, /delay=\{80 \+ index \* 70\}/);
	assert.match(homeSource, /grid w-full auto-rows-fr grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-stretch xl:max-w-\[1220px\] xl:gap-0/);
	assert.match(homeSource, /<ScrollReveal key=\{item\.title\} delay=\{80 \+ index \* 70\} className='w-full'>/);
	assert.match(homeSource, /h-full min-h-\[112px\] w-full max-w-\[28rem\] flex-col items-center justify-start[\s\S]*sm:max-w-none/);
	assert.match(homeSource, /rounded-none bg-white\/5 px-3 py-4 text-center sm:max-w-none xl:bg-transparent xl:px-6 xl:py-0/);
	assert.doesNotMatch(homeSource, /ds-surface-panel flex h-full min-h-\[112px\]/);
	assert.match(timerSource, /typography\.pattern\.countdownHeroValue/);
	assert.match(timerSource, /typography\.pattern\.countdownDefaultValue/);
	assert.match(timerSource, /typography\.pattern\.countdownLabel/);
	assert.match(timerSource, /mx-auto flex w-full flex-nowrap items-start justify-center/);
	assert.match(timerSource, /w-\[4\.5rem\] flex-none flex-col items-center/);
	assert.match(timerSource, /flex-1 basis-0/);
});

test('homepage source includes theme intro, home cfp hero, important dates, and sponsors flow', () => {
	const homeSource = readFileSync(new URL('./HomePage.tsx', import.meta.url), 'utf8');

	assert.match(homeSource, /<ScrollCollapseSection/);
	assert.match(homeSource, /content\.theme\.title/);
	assert.match(homeSource, /content\.theme\.slogan/);
	assert.match(homeSource, /content\.theme\.description/);
	assert.match(homeSource, /content\.cfpSection\.importantDatesTitle/);
	assert.match(homeSource, /content\.cfpSection\.heroTimelineItems\.map/);
	assert.match(homeSource, /Submit Now/);
	assert.match(homeSource, /立即投稿/);
	assert.match(homeSource, /<Sponsors \/>/);
	assert.doesNotMatch(homeSource, /content\.cfpSection\.subtitle/);
	assert.doesNotMatch(homeSource, /content\.cfpSection\.heroDeadlineNote/);
});
