import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./QPage.tsx', import.meta.url), 'utf8');
const layoutSource = readFileSync(new URL('../components/layout/Layout.tsx', import.meta.url), 'utf8');

test('digital pass follows the site language switch instead of hardcoded chinese', () => {
	assert.match(source, /const zh = language === 'zh'/);
	assert.match(source, /zh \? '數位通行證' : 'Digital Pass'/);
	assert.match(source, /zh \? '查詢通行證' : 'Find my pass'/);
	assert.match(source, /zh \? '進入 Poster \/ Demo 投票' : 'Enter Poster \/ Demo voting'/);
	assert.match(source, /zh \? 'Check-in Desk 報到處' : 'Check-in Desk'/);
	assert.match(source, /toLocaleString\(zh \? 'zh-TW' : 'en-US'/);

	// 錯誤訊息存錯誤碼、渲染時才翻譯，切語言時已顯示的訊息才會跟著換
	assert.match(source, /setLookupErrorCode\(result\.error\)/);
	assert.match(source, /setVerifyErrorCode\(result\.error\)/);
	assert.match(source, /setPassErrorCode\(result\.error\)/);
	assert.match(source, /message\(LOOKUP_ERRORS, lookupErrorCode, LOOKUP_FALLBACK, zh\)/);
	assert.match(source, /message\(VERIFY_ERRORS, verifyErrorCode, VERIFY_FALLBACK, zh\)/);

	// 每個錯誤碼都要兩種語言，不能只補中文
	const errorEntries = source.match(/\{ zh: '[^']*', en: '[^']*' \}|\{\s*zh:\s*\n?/g) ?? [];
	assert.ok(errorEntries.length >= 9, `expected every error copy to carry zh + en, saw ${errorEntries.length}`);
	assert.doesNotMatch(source, /^const (LOOKUP|VERIFY)_ERRORS: Record<string, string>/m);
});

test('digital pass keeps check-in desk, QR and vote entry on one screen', () => {
	// 外層撐滿視窗；QR 是唯一可伸縮的區塊，其餘固定高
	assert.match(source, /flex min-h-\[100dvh\] flex-col/);
	assert.match(source, /flex max-h-\[720px\] min-h-0 w-full flex-1 flex-col justify-center/);
	assert.match(source, /ds-surface-panel flex min-h-0 flex-1 flex-col items-center/);
	// QR：外層 min-h-32 是掃得動的下限，方框自己吃剩餘高度（不用百分比高度，
	// height:100% 在 min-height 撐出來的 flex 鏈上會塌成 0）
	assert.match(source, /flex min-h-32 w-full flex-1 flex-col items-center justify-center/);
	assert.match(source, /flex aspect-square min-h-0 max-h-60 max-w-full flex-1 bg-white/);
	assert.match(source, /className='min-w-0 flex-1 object-contain \[image-rendering:pixelated\]'/);
	assert.doesNotMatch(source, /h-full max-h-\[248px\]/);
	// 舊做法：QR 固定寬度 + 頁面自然流動，桌機與手機都會把投票入口推出摺線
	assert.doesNotMatch(source, /w-\[min\(248px,34dvh\)\]/);

	// 留白靠視窗高度斷點給，不是 sm/md — 決定擠不擠的是高度
	assert.match(source, /px-5 pb-4 pt-20 sm:px-8 taller:pb-8 taller:pt-24/);
	// 英文小標整行砍掉（標題已經寫著數位通行證），不是靠高度斷點藏起來
	assert.doesNotMatch(source, /TAICHI 2026 DIGITAL PASS/);
	assert.doesNotMatch(source, /ds-page-note/);
	assert.match(source, /tall:md:text-\[40px\]/);
	const config = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf8');
	assert.match(config, /tall: \{ raw: '\(min-height: 720px\)' \}/);
	assert.match(config, /taller: \{ raw: '\(min-height: 820px\)' \}/);

	// 驗證表單併成一列，是「一屏」成立的關鍵一刀
	assert.match(source, /className='min-w-0 flex-1 border border-white\/15 bg-black\/40/);
	assert.match(source, /zh \? '驗證' : 'Verify'/);

	// 站尾比一屏還高，/q 掛上去等於保證要捲動。尾斜線要先去掉：正式站是 q/index.html，
	// GitHub Pages 把 /q 301 到 /q/，直接比 '/q' 只有本機會過
	assert.match(layoutSource, /pathname\.replace\(\/\\\/\+\$\/, ''\) !== '\/q'/);
	assert.match(layoutSource, /\{showFooter \? <Footer \/> : null\}/);
	assert.match(layoutSource, /min-h-\[100dvh\]/);
});

test('trailing-slash normalisation matches how github pages serves the route', () => {
	// build 產出 q/index.html → Pages 301 /q → /q/，兩種寫法都必須認得，其他路由不受影響
	const showFooter = (pathname: string) => pathname.replace(/\/+$/, '') !== '/q';
	assert.equal(showFooter('/q'), false);
	assert.equal(showFooter('/q/'), false);
	assert.equal(showFooter('/'), true);
	assert.equal(showFooter('/vote'), true);
	assert.equal(showFooter('/vote/'), true);
	assert.equal(showFooter('/program/'), true);
});
