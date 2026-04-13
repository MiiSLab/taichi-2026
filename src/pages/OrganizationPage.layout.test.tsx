import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('organization and sponsors source match the figma-driven layout skeleton', () => {
	const organizationSource = readFileSync(new URL('./OrganizationPage.tsx', import.meta.url), 'utf8');
	const sponsorsSource = readFileSync(new URL('../components/Sponsors.tsx', import.meta.url), 'utf8');

	assert.match(organizationSource, /content\.committeeSection\.title/);
	assert.match(organizationSource, /bg-\[rgba\(24,24,27,0\.5\)\]/);
	assert.match(organizationSource, /ds-page-title/);
	assert.match(organizationSource, /ds-surface-panel/);
	assert.match(organizationSource, /ds-button-secondary/);
	assert.match(organizationSource, /justify-center/);
	assert.match(organizationSource, /text-\[24px\]/);
	assert.match(organizationSource, /text-\[#CCFF00\]/);
	assert.match(organizationSource, /bg-\[rgba\(0,0,0,0\.4\)\]/);
	assert.match(organizationSource, /size-\[48px\]/);
	assert.match(organizationSource, /aboutTitle/);
	assert.match(organizationSource, /aboutButtonUrl/);
	assert.match(organizationSource, /space-y-36 md:space-y-40/);

	assert.match(sponsorsSource, /mainOrganizers/);
	assert.match(sponsorsSource, /coOrganizersTitle/);
	assert.match(sponsorsSource, /supportingOrganizersTitle/);
	assert.match(sponsorsSource, /sponsorsTitle/);
	assert.match(sponsorsSource, /import ScrollReveal from '\.\/ScrollReveal'/);
	assert.match(sponsorsSource, /delayStep = 70/);
	assert.match(sponsorsSource, /<ScrollReveal delay=\{200\}>/);
	assert.match(sponsorsSource, /getLogoFrameClasses/);
	assert.match(sponsorsSource, /getLogoImageClasses/);
	assert.match(sponsorsSource, /getLogoOpticalClasses/);
	assert.match(sponsorsSource, /台灣人機互動學會/);
	assert.match(sponsorsSource, /國科會晶創人文計畫/);
	assert.match(sponsorsSource, /美國創新中心/);
	assert.match(sponsorsSource, /flex-nowrap items-center/);
	assert.match(sponsorsSource, /bg-\[#F2F2ED\]/);
	assert.doesNotMatch(sponsorsSource, /rounded-\[28px\] border border-black\/8 bg-white\/65/);
	assert.doesNotMatch(sponsorsSource, /className\?: string/);
});
