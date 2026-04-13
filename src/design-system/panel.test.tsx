import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('panel design system exposes shared frame tokens and component', () => {
	const panelSource = readFileSync(new URL('./panel.ts', import.meta.url), 'utf8');
	const componentSource = readFileSync(new URL('../components/FramePanel.tsx', import.meta.url), 'utf8');

	assert.match(panelSource, /legacyFrameBase:/);
	assert.match(panelSource, /legacyFrameCorner:/);
	assert.match(panelSource, /figmaFrameBase:/);
	assert.match(panelSource, /figmaTopLeftMarker:/);
	assert.match(panelSource, /figmaBottomRightMarker:/);
	assert.match(panelSource, /sectionDivider:/);
	assert.match(panelSource, /bg-\[rgba\(0,0,0,0\.6\)\]/);
	assert.match(componentSource, /variant = 'figmaContainer'/);
	assert.match(componentSource, /variant\?: 'figmaContainer' \| 'legacyCorners'/);
	assert.match(componentSource, /panelFrame\.legacyFrameBase/);
	assert.match(componentSource, /panelFrame\.figmaFrameBase/);
	assert.match(componentSource, /cornerSize = 12/);
	assert.match(componentSource, /showCorners = true/);
});

test('venue, organization, and cfp pages use the shared frame panel system', () => {
	const venueSource = readFileSync(new URL('../pages/VenuePage.tsx', import.meta.url), 'utf8');
	const organizationSource = readFileSync(new URL('../pages/OrganizationPage.tsx', import.meta.url), 'utf8');
	const cfpSource = readFileSync(new URL('../pages/CFPPage.tsx', import.meta.url), 'utf8');

	assert.match(venueSource, /import FramePanel from '\.\.\/components\/FramePanel'/);
	assert.match(venueSource, /import \{ panelFrame \} from '\.\.\/design-system\/panel'/);
	assert.doesNotMatch(venueSource, /const CornerDecor =/);

	assert.match(organizationSource, /import FramePanel from '\.\.\/components\/FramePanel'/);
	assert.match(organizationSource, /import \{ panelFrame \} from '\.\.\/design-system\/panel'/);
	assert.doesNotMatch(organizationSource, /const CornerDecor =/);
	assert.doesNotMatch(organizationSource, /const FramedPanel =/);

	assert.match(cfpSource, /import FramePanel from '\.\.\/components\/FramePanel'/);
	assert.match(cfpSource, /import \{ panelFrame \} from '\.\.\/design-system\/panel'/);
	assert.doesNotMatch(cfpSource, /const CornerDecor =/);
	assert.match(cfpSource, /panelFrame\.sectionDivider/);
});
