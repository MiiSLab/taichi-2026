import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('venue and cfp pages include adaptable layout guards across breakpoints', () => {
	const venueSource = readFileSync(new URL('./VenuePage.tsx', import.meta.url), 'utf8');
	const cfpSource = readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8');
	const voteSource = readFileSync(new URL('./VotePage.tsx', import.meta.url), 'utf8');

	assert.match(venueSource, /xl:grid-cols-\[minmax\(0,592px\)_minmax\(0,592px\)\]/);
	assert.match(venueSource, /min-h-\[320px\] md:min-h-\[475px\]/);
	assert.match(venueSource, /px-6 py-6 md:px-10 md:pb-\[18px\] md:pt-10/);
	assert.match(venueSource, /typography\.scale\.sectionTitle/);
	assert.match(venueSource, /typography\.scale\.body/);
	assert.match(venueSource, /ds-section-title mb-6 text-\[2rem\] md:text-\[2\.5rem\] md:leading-\[1\.5\]/);

	assert.match(cfpSource, /typography\.scale\.body/);
	assert.match(cfpSource, /typography\.scale\.sectionEyebrow/);
	assert.match(cfpSource, /grid w-full auto-rows-fr grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-stretch xl:max-w-\[1220px\] xl:gap-0/);
	assert.match(cfpSource, /h-full min-h-\[112px\] w-full max-w-\[28rem\] flex-col items-center justify-start[\s\S]*sm:max-w-none/);
	assert.match(cfpSource, /xl:grid-cols-2/);
	assert.match(cfpSource, /<ConstellationMapSection language=\{language\} \/>/);
	assert.match(cfpSource, /<SubmissionButton \/>/);
	assert.match(cfpSource, /ds-section-title mb-10 text-center md:mb-12/);

	assert.match(voteSource, /h-\[100dvh\]/);
	assert.match(voteSource, /DesktopPosterGallery/);
	assert.match(voteSource, /MobilePosterGallery/);
	assert.match(voteSource, /PosterDetailModal/);
	assert.match(voteSource, /PosterImageViewer/);
	assert.match(voteSource, /snap-x/);
});
