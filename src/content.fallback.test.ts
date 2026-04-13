import assert from 'node:assert/strict';
import test from 'node:test';
import { NEWS, PEOPLE, SESSIONS } from './content';

test('static fallback content is populated for offline layout work', () => {
	assert.ok(PEOPLE.length > 0, 'expected offline people data');
	assert.ok(NEWS.length > 0, 'expected offline news data');
	assert.ok(SESSIONS.length > 0, 'expected offline session data');

	assert.ok(PEOPLE.some((person) => /chair/i.test(person.chairType)), 'expected committee data');
	assert.ok(PEOPLE.some((person) => /keynote/i.test(person.chairType)), 'expected keynote data');
	assert.ok(SESSIONS.some((session) => session.topics && session.topics.length > 0), 'expected nested topics');
});
