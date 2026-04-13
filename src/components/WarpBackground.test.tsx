import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./WarpBackground.tsx', import.meta.url), 'utf8');

assert.match(source, /getResponsiveSettings/);
assert.match(source, /count: Math\.max\(75, Math\.round\(300 \* Math\.max\(0\.4, areaRatio\)\)\)/);
assert.match(source, /speed: Math\.max\(0\.42, widthRatio\)/);
assert.match(source, /trail: nextWidth < 768 \? 0\.22 : nextWidth < 1024 \? 0\.18 : 0\.15/);
assert.match(source, /this\.speed = \(Math\.random\(\) \* 15 \+ 5\) \* speedMultiplier/);
assert.match(source, /ctx\.fillStyle = `rgba\(0, 0, 0, \$\{trailAlpha\}\)`/);
