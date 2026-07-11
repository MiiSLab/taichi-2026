import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('vote page source splits desktop and mobile galleries with scroll-safe desktop controls', () => {
	const source = readFileSync(new URL('./VotePage.tsx', import.meta.url), 'utf8');

	assert.match(source, /from '@react-three\/fiber'/);
	assert.match(source, /from '@react-three\/drei'/);
	assert.match(source, /matchMedia\('\(pointer: fine\) and \(hover: hover\)'\)/);
	assert.match(source, /DesktopPosterGallery/);
	assert.match(source, /MobilePosterGallery/);
	assert.match(source, /PosterDetailModal/);
	assert.match(source, /<Canvas/);
	assert.match(source, /enableZoom/);
	assert.match(source, /if \(!event\.ctrlKey\)/);
	assert.match(source, /addEventListener\('wheel', blockWheelZoom, \{ capture: true \}\)/);

	assert.match(source, /h-\[100dvh\]/);
	assert.match(source, /snap-x/);
	assert.doesNotMatch(source, /<PosterDetailPanel/);
});

test('vote page source wires the live voting flow to the voting service', () => {
	const source = readFileSync(new URL('./VotePage.tsx', import.meta.url), 'utf8');

	assert.match(source, /from '\.\.\/services\/votingService'/);
	assert.match(source, /getPosters/);
	assert.match(source, /getVoteState/);
	assert.match(source, /castVote/);
	assert.match(source, /getVotedPosterIds/);
	assert.match(source, /MAX_VOTES/);
	assert.match(source, /VOTE_STATE_POLL_MS/);
	assert.match(source, /searchParams\.get\('t'\)/);
	assert.doesNotMatch(source, /mockPosters/);
	assert.doesNotMatch(source, /COMING SOON/);
});

test('vote page source includes image-focused modal inspection flow', () => {
	const source = readFileSync(new URL('./VotePage.tsx', import.meta.url), 'utf8');

	assert.match(source, /PosterImageViewer/);
	assert.match(source, /cursor-zoom-in/);
	assert.match(source, /selectedImagePoster/);
	assert.match(source, /Open poster image/i);
	assert.match(source, /max-h-\[96vh\]/);
	assert.match(source, /object-contain/);
});

test('mobile vote gallery source includes quick poster jump menu', () => {
	const source = readFileSync(new URL('./VotePage.tsx', import.meta.url), 'utf8');

	assert.match(source, /mobilePosterRefs/);
	assert.match(source, /scrollIntoView\(\{ behavior: 'smooth', inline: 'center', block: 'nearest' \}\)/);
	assert.match(source, /Poster Quick Jump/);
	assert.match(source, /poster.id.replace\('poster-', ''\)/);
});
