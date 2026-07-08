import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('registration page renders the pricing table and the two registration methods', () => {
	const source = readFileSync(new URL('./RegistrationPage.tsx', import.meta.url), 'utf8');

	assert.match(source, /section\.pricingTable/);
	assert.match(source, /table\.tierNames\.map/);
	assert.match(source, /table\.rows\.map/);

	assert.match(source, /parseText\(section\.membershipNote, secondaryLinkClassName\)/);
	assert.match(source, /parseText\(section\.manualIntro, secondaryLinkClassName\)/);
	assert.match(source, /parseText\(section\.emailStepText, secondaryLinkClassName\)/);
	assert.match(source, /text-secondary/);

	assert.match(source, /section\.kktixUrl === '#'/);
	assert.match(source, /section\.kktixComingSoonLabel/);
	assert.match(source, /href=\{section\.kktixUrl\}/);
	assert.match(source, /section\.bankDetails\.map/);
	assert.match(source, /href=\{section\.formUrl\}/);
	assert.match(source, /target='_blank'/);
	assert.match(source, /rel='noreferrer'/);
});

test('registration content defines matching pricing and registration-method fields for both languages', () => {
	const zhSource = readFileSync(new URL('../content.zh.ts', import.meta.url), 'utf8');
	const enSource = readFileSync(new URL('../content.en.ts', import.meta.url), 'utf8');

	assert.match(zhSource, /registrationSection: \{/);
	assert.match(zhSource, /pricingTable: \{/);
	assert.match(zhSource, /kktixUrl: 'https:\/\/taiwanchi\.kktix\.cc\/events\/202608050806'/);
	assert.match(zhSource, /kktixComingSoonLabel: '即將開放'/);
	assert.match(zhSource, /manualHeading: '2\. 團體報名'/);
	assert.match(zhSource, /manualIntro:/);
	assert.match(zhSource, /bankDetails: \[/);
	assert.match(zhSource, /154100091731/);

	assert.match(enSource, /registrationSection: \{/);
	assert.match(enSource, /\.\.\.CONTENT_ZH\.registrationSection/);
	assert.match(enSource, /pricingTable: \{/);
	assert.match(enSource, /kktixComingSoonLabel: 'Coming Soon'/);
	assert.match(enSource, /manualHeading: '2\. Group Registration'/);
	assert.match(enSource, /manualIntro:/);
	assert.match(enSource, /bankDetails: \[/);
});

test('registration page is routed and linked from the navbar and homepage CTA', () => {
	const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
	const navSource = readFileSync(new URL('../components/layout/Navbar.tsx', import.meta.url), 'utf8');
	const homeSource = readFileSync(new URL('../components/home/HomeSections.tsx', import.meta.url), 'utf8');

	assert.match(appSource, /RegistrationPage = lazy\(\(\) => import\('\.\/pages\/RegistrationPage'\)\)/);
	assert.match(appSource, /path='registration' element=\{<RegistrationPage \/>\}/);

	const navLinks = navSource.match(/<Link\s+to='\/registration'/g) ?? [];
	assert.equal(navLinks.length, 2);

	assert.match(homeSource, /<Link\s*\n?\s*to='\/registration'/);
	assert.doesNotMatch(homeSource, /Coming Soon/);
	assert.doesNotMatch(homeSource, /即將開放/);
	assert.match(homeSource, /<span className='flex-1 text-center'>\{registerButtonLabel\}<\/span>/);
});
