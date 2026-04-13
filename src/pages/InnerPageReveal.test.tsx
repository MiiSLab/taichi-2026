import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('inner pages use scroll reveal wrappers and shared fade-up motion', () => {
	const newsSource = readFileSync(new URL('./NewsPage.tsx', import.meta.url), 'utf8');
	const venueSource = readFileSync(new URL('./VenuePage.tsx', import.meta.url), 'utf8');
	const cfpSource = readFileSync(new URL('./CFPPage.tsx', import.meta.url), 'utf8');
	const organizationSource = readFileSync(new URL('./OrganizationPage.tsx', import.meta.url), 'utf8');
	const competitionSource = readFileSync(new URL('./CompetitionPage.tsx', import.meta.url), 'utf8');
	const voteSource = readFileSync(new URL('./VotePage.tsx', import.meta.url), 'utf8');
	const revealStyles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

	assert.match(newsSource, /import ScrollReveal from '\.\.\/components\/ScrollReveal'/);
	assert.match(newsSource, /<ScrollReveal className='relative z-10 flex w-full max-w-7xl flex-col items-center'>/);
	assert.match(newsSource, /typography\.scale\.pageTitle/);
	assert.match(newsSource, /<ScrollReveal delay=\{80\}>/);

	assert.match(venueSource, /<ScrollReveal className='relative z-10 flex w-full max-w-7xl flex-col items-center'>/);
	assert.match(venueSource, /typography\.scale\.pageTitle/);
	assert.match(cfpSource, /typography\.scale\.pageTitle/);
	assert.match(organizationSource, /<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center'>/);
	assert.match(organizationSource, /typography\.scale\.pageTitle/);
	assert.match(organizationSource, /<ScrollReveal delay=\{70\}>/);
	assert.match(competitionSource, /import ScrollReveal from '\.\.\/components\/ScrollReveal'/);
	assert.match(competitionSource, /<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>/);
	assert.match(competitionSource, /typography\.scale\.pageTitle/);
	assert.match(competitionSource, /<ScrollReveal delay=\{90\}>/);
	assert.match(voteSource, /import ScrollReveal from '\.\.\/components\/ScrollReveal'/);
	assert.match(voteSource, /typography\.scale\.pageTitle/);
	assert.match(voteSource, /<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>/);

	assert.match(revealStyles, /transform: translate3d\(0, 28px, 0\);/);
	assert.match(revealStyles, /transition-property: opacity, transform;/);
	assert.match(revealStyles, /transform: translate3d\(0, 0, 0\);/);
});
