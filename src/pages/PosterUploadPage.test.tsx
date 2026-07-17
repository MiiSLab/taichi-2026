import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('app source registers a standalone poster upload route outside the shared layout', () => {
	const source = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');

	assert.match(source, /import PosterUploadPage from '\.\/pages\/PosterUploadPage';/);
	assert.match(source, /<Route path='poster-upload' element={<PosterUploadPage \/>} \/>/);
	assert.match(
		source,
		/<Routes>\s*<Route path='\/' element={<Layout \/>}>[\s\S]*<\/Route>\s*<Route path='poster-upload' element={<PosterUploadPage \/>} \/>/m,
	);
});

test('poster upload page source includes the required fields and standalone interaction model', () => {
	const source = readFileSync(new URL('./PosterUploadPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /const POSTER_THEMES = \[/);
	assert.equal((source.match(/id: 'theme-/g) ?? []).length, 11);
	assert.match(source, /posterId/);
	assert.match(source, /title/);
	assert.match(source, /authors/);
	assert.match(source, /abstract/);
	assert.match(source, /selectedTheme/);
	assert.match(source, /selectedImage/);
	assert.match(source, /URL\.createObjectURL/);
	assert.match(source, /mockSubmitted/);
	assert.match(source, /海報上傳/);
	assert.match(source, /POSTER SUBMISSION CONSOLE/);
	assert.match(source, /Poster ID/);
	assert.match(source, /Theme \/ Category/);
	assert.match(source, /Abstract/);
	assert.match(source, /Upload Poster Image/);
	assert.match(source, /Submission received/i);
	assert.doesNotMatch(source, /<Layout/);
});
