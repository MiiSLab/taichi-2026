import { AlertTriangle, Cookie, Search, Vote } from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';
import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';
import {
	CONFERENCES,
	getPassInfo,
	getVoteState,
	isSupabaseConfigured,
	isVoteVerified,
	lookupPass,
	rememberVoteVerified,
	verifyVoteAccess,
	type PassInfo,
} from '../services/votingService';

/**
 * /q — 參與者數位通行證（Layout 內，含站點 Navbar；此路由不出 Footer，見 Layout.tsx）。
 *
 * 兩階段（見 Taichi_check_in/docs/adr/0004）：
 *   1. 選會別（四選一）+ 姓名 → 通行 QR 與餅乾資格綠標。
 *      沒有留 email 的人也查得到，同名多筆時才追問 email。
 *   2. 補上正確 email（沒有 email 的人用萬能通行語）→ 才解鎖投票入口。
 *      驗證是伺服器狀態，直接開 /vote 也繞不過去。
 *
 * 從信件連結（`?t=…&v=…`）進來的人跳過第二階段：投票碼只存在於寄出去的連結，
 * 查詢頁不會產生它（見 Taichi_check_in/docs/adr/0006）。
 *
 * 通行證就是網址：查到後把 token 寫回網址參數，可收藏或截圖。
 *
 * 雙語：字串就地寫成 { zh, en }（與 /vote 同做法），不進 content.zh/en —
 * 這些句子只有本頁用得到，放共用 content 反而變成兩檔對照維護。
 * 錯誤訊息存的是「錯誤碼」不是譯好的句子，切語言時已顯示的訊息才會跟著換。
 *
 * 一屏：外層撐滿 100dvh，QR 是唯一可伸縮的區塊（flex-1 + 128–240px 上下限），
 * 其餘區塊固定高；視窗變矮先縮 QR，縮到掃得動的下限才讓頁面長出捲軸。
 * 留白用 tall / taller（視窗高度斷點，見 tailwind.config.js）給，不用 sm — 決定
 * 擠不擠的是高度，矮的筆電視窗跟手機一樣需要緊排。量過的下限：視窗高 ≥650px
 * 三者同屏（未驗證、要填 Email 的最高狀態）；再矮才需要捲一小段。
 *
 * QR 尺寸刻意不用百分比高度（height:100% 在 min-height 撐出來的 flex 鏈上解不出來，
 * 會塌成 0）：改讓 QR 方框自己當 flex item 吃剩餘高度，寬度由 aspect-square 推出來。
 */

type Copy = { zh: string; en: string };
const t = (copy: Copy, zh: boolean) => (zh ? copy.zh : copy.en);

const LOOKUP_ERRORS: Record<string, Copy> = {
	not_found: {
		zh: '查無符合的報名資料，請確認會別與姓名和報名時填寫的一致。',
		en: 'No matching registration. Check that the conference and name match what you registered with.',
	},
	ambiguous: {
		zh: '有多位同名的與會者，請一併輸入報名時填寫的 Email。',
		en: 'Several attendees share this name — please also enter the email you registered with.',
	},
	missing_input: { zh: '請選擇會別並輸入姓名。', en: 'Please pick a conference and enter your name.' },
	not_configured: { zh: '查詢服務尚未設定完成，請稍後再試。', en: 'Lookup is not configured yet. Please try again later.' },
};

const VERIFY_ERRORS: Record<string, Copy> = {
	email_mismatch: { zh: 'Email 與報名資料不符，請再確認一次。', en: 'That email does not match your registration. Please check it again.' },
	no_email: { zh: '你的報名資料沒有留 Email，請洽現場工作人員協助。', en: 'Your registration has no email on file — please ask a staff member for help.' },
	not_eligible: { zh: '此通行碼沒有投票資格。', en: 'This pass is not eligible to vote.' },
	invalid_token: { zh: '通行碼無效，請重新查詢。', en: 'Invalid pass code. Please look it up again.' },
	not_configured: { zh: '投票驗證尚未設定完成，請稍後再試。', en: 'Vote verification is not configured yet. Please try again later.' },
};

const LOOKUP_FALLBACK: Copy = { zh: '查詢失敗，請確認網路後再試。', en: 'Lookup failed. Check your connection and try again.' };
const PASS_FALLBACK: Copy = { zh: '無法取得通行證資料。', en: 'Could not load this pass.' };
const VERIFY_FALLBACK: Copy = { zh: '驗證失敗，請確認網路後再試。', en: 'Verification failed. Check your connection and try again.' };

const message = (table: Record<string, Copy>, code: string, fallback: Copy, zh: boolean) => t(table[code] ?? fallback, zh);

const formatWindowTime = (iso: string | null, zh: boolean): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString(zh ? 'zh-TW' : 'en-US', {
		month: zh ? 'numeric' : 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};

const QPage: React.FC = () => {
	const { language } = useLanguage();
	const zh = language === 'zh';
	useSEO(
		zh ? '數位通行證' : 'Digital Pass',
		zh
			? 'TAICHI 2026 參與者數位通行證：報到與投票入口。'
			: 'TAICHI 2026 attendee digital pass: check-in and voting entry.',
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const token = searchParams.get('t') ?? '';
	// 信件連結自帶的投票碼；查詢頁查出來的網址不會有這個參數
	const voteCode = searchParams.get('v') ?? '';
	// tt=測試旗標：只解 UI 的時間鎖（voteHref 會把 tt 一起帶去 /vote）；
	// 伺服器端 cast_vote 仍照回合時間窗驗證，不構成繞過
	const forceVoteOpen = searchParams.has('tt');

	const [pass, setPass] = useState<PassInfo | null>(null);
	const [passErrorCode, setPassErrorCode] = useState<string | null>(null);
	const [qrDataUrl, setQrDataUrl] = useState('');
	const [voteOpen, setVoteOpen] = useState<boolean | null>(null); // null = 載入中/未知
	const [opensAt, setOpensAt] = useState<string | null>(null);
	const [closesAt, setClosesAt] = useState<string | null>(null);

	// 第一階段：會別 + 姓名（同名時才追加 email）
	const [conference, setConference] = useState<string>(CONFERENCES[0]);
	const [lookupName, setLookupName] = useState('');
	const [lookupEmail, setLookupEmail] = useState('');
	const [needEmailToDisambiguate, setNeedEmailToDisambiguate] = useState(false);
	const [lookupBusy, setLookupBusy] = useState(false);
	const [lookupErrorCode, setLookupErrorCode] = useState<string | null>(null);

	// 第二階段：驗證身分才解鎖投票
	const [verified, setVerified] = useState(false);
	const [secret, setSecret] = useState('');
	const [verifyBusy, setVerifyBusy] = useState(false);
	const [verifyErrorCode, setVerifyErrorCode] = useState<string | null>(null);

	// 從信件連結進來的人不必再打一次 email。網址上的 v= 投票碼只出現在寄給本人的連結裡，
	// 查詢頁永遠不會產生它，所以「拿得出它」本身就是身分證明（見報到端 docs/adr/0006）。
	// 碼錯或過期就靜靜退回下面的 email 表單，不另外報錯——使用者只會覺得「要驗一下」。
	useEffect(() => {
		if (!token) {
			setVerified(false);
			return;
		}
		if (isVoteVerified(token)) {
			setVerified(true);
			return;
		}
		if (!voteCode) {
			setVerified(false);
			return;
		}
		let cancelled = false;
		void verifyVoteAccess(token, voteCode).then((result) => {
			if (cancelled || result.ok !== true) return;
			rememberVoteVerified(token);
			setVerified(true);
		});
		return () => {
			cancelled = true;
		};
	}, [token, voteCode]);

	const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (lookupBusy) return;
		setLookupBusy(true);
		setLookupErrorCode(null);
		const result = await lookupPass(conference, lookupName, needEmailToDisambiguate ? lookupEmail : undefined);
		setLookupBusy(false);
		// 無 strict mode，boolean discriminant 需 === true 才能收窄
		if (result.ok === true) {
			setPass(result);
			const next = new URLSearchParams(searchParams);
			next.set('t', result.token);
			setSearchParams(next);
			return;
		}
		if (result.error === 'ambiguous') setNeedEmailToDisambiguate(true);
		setLookupErrorCode(result.error);
	};

	const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (verifyBusy || !token) return;
		setVerifyBusy(true);
		setVerifyErrorCode(null);
		const result = await verifyVoteAccess(token, secret);
		setVerifyBusy(false);
		if (result.ok === true) {
			rememberVoteVerified(token);
			setVerified(true);
			return;
		}
		setVerifyErrorCode(result.error);
	};

	// 帶著 token 進來（掃 QR、收藏的網址）→ 取回顯示用資料
	useEffect(() => {
		if (!token) {
			setPass(null);
			return;
		}
		let cancelled = false;
		getPassInfo(token)
			.then((result) => {
				if (cancelled) return;
				if (result.ok === true) setPass(result);
				else setPassErrorCode(result.error);
			})
			.catch(() => {
				if (!cancelled) setPassErrorCode('fetch_failed');
			});
		return () => {
			cancelled = true;
		};
	}, [token]);

	// 通行 QR：編碼當前完整 URL（含 token），工作人員掃描即可報到
	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		QRCode.toDataURL(window.location.href, { width: 560, margin: 2 })
			.then((url) => { if (!cancelled) setQrDataUrl(url); })
			.catch(() => { /* QR 產生失敗時保留文字 token 供人工查驗 */ });
		return () => { cancelled = true; };
	}, [token]);

	// 投票入口時間鎖：任一回合開放就算開放，細節（哪個回合、剩幾票）由 /vote 處理
	useEffect(() => {
		let cancelled = false;
		getVoteState()
			.then((state) => {
				if (cancelled || !state) return;
				setVoteOpen(state.open);
				setOpensAt(state.opens_at);
				setClosesAt(state.closes_at);
			})
			.catch(() => { if (!cancelled) setVoteOpen(false); });
		return () => { cancelled = true; };
	}, []);

	const voteHref = `/vote?${searchParams.toString()}`;
	const opensLabel = formatWindowTime(opensAt, zh);
	const closesLabel = formatWindowTime(closesAt, zh);
	const windowOpen = voteOpen || forceVoteOpen;
	const secretLabel = useMemo(
		() => (pass?.has_email === false ? (zh ? '通行語 Passphrase' : 'Passphrase') : 'Email'),
		[pass, zh],
	);

	const voteWindowNote = forceVoteOpen && !voteOpen
		? zh
			? '測試模式（tt）：僅解除介面時間鎖，實際投票仍以伺服器時間窗為準。'
			: 'Test mode (tt): this only unlocks the interface — the server time window still governs real votes.'
		: voteOpen
			? closesLabel
				? zh ? `投票進行中，${closesLabel} 截止。` : `Voting is open, closes ${closesLabel}.`
				: zh ? '投票進行中。' : 'Voting is open.'
			: opensLabel
				? zh ? `投票將於 ${opensLabel} 開放，屆時回到本頁即可進入。` : `Voting opens ${opensLabel} — come back to this page then.`
				: zh ? '投票尚未開放，活動當日回到本頁即可進入。' : 'Voting is not open yet. Come back to this page on the event day.';

	return (
		<div className='relative isolate flex min-h-[100dvh] flex-col'>
			{/* pt 讓出固定 navbar（約 62px）；本頁在 Layout 內不出 Footer，整頁收在一屏內。
			    max-h-[720px]：桌機視窗很高時通行證不跟著拉長，維持一張卡片置中 */}
			<div className='mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-5 pb-4 pt-20 sm:px-8 taller:pb-8 taller:pt-24'>
				<div className='flex max-h-[720px] min-h-0 w-full flex-1 flex-col justify-center gap-2.5 taller:gap-4'>
					<header className='flex flex-col gap-1.5'>
						<div className='flex items-start justify-between gap-3'>
							<div className='min-w-0'>
								{/* 沒有英文小標：標題本身就寫著數位通行證，這一行只是重複，
								    砍掉的高度直接讓給 QR */}
								{/* 尺寸抄 typography.scale.sectionTitle，但把 md 那級加上高度條件：
								    矮的桌機視窗放大到 40px 就會擠出捲軸，寬度不是這裡的瓶頸 */}
								<h1 className='ds-page-title font-dela text-[28px] tracking-[0.12em] tall:md:text-[40px]'>
									{zh ? '數位通行證' : 'Digital Pass'}
								</h1>
							</div>
							{pass?.cookie_eligible ? (
								<span className='inline-flex shrink-0 items-center gap-1.5 border border-secondary/50 bg-secondary/15 px-3 py-1.5 font-mono text-xs text-secondary'>
									<Cookie size={16} />
									{zh ? '筊杯餅乾' : 'Cookie'}
								</span>
							) : null}
						</div>
						{/* 姓名與票種同一行：一屏內每一列都算，兩者都短，不必各佔一列 */}
						{pass?.name || pass?.ticket_type ? (
							<div className='flex flex-wrap items-center gap-x-3 gap-y-1.5'>
								{pass?.name ? (
									<p className={`${typography.scale.body} text-white/85`}>
										{zh ? `${pass.name}，你好！` : `Hello, ${pass.name}!`}
									</p>
								) : null}
								{pass?.ticket_type ? (
									<span className='inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-primary'>
										{pass.ticket_type}
									</span>
								) : null}
							</div>
						) : null}
					</header>

					{token ? (
						<>
							<section className='flex flex-col items-center flex-1 min-h-0 gap-2 p-4 ds-surface-panel sm:px-5 taller:gap-3 taller:py-5'>
								{/* 報到處：現場照會別分流排隊，這是掃 QR 之前先要看的一行。
								    查詢時選的會別未必等於報到處（跨會別的人只在一個櫃檯領名牌），所以印伺服器回的值 */}
								{pass?.conference ? (
									<div className='w-full px-4 py-2 text-center border border-primary/55 bg-primary/12'>
										<p className='ds-desk-kicker text-primary/75'>{zh ? 'Check-in Desk 報到處' : 'Check-in Desk'}</p>
										<p className='mt-0.5 font-mono text-2xl font-bold tracking-[0.14em] text-primary'>
											{pass.conference}
										</p>
									</div>
								) : (
									<p className='ds-section-kicker'>Check-in Pass</p>
								)}
								{/* QR 吃掉本頁剩下的高度：上限 240px（夠大好掃），下限 128px（再小掃不動，
								    此時改由頁面長高、允許捲動，而不是把投票入口擠出視窗）。
								    外層 min-h-32 是那道下限：它撐住高度，頁面才會長高而不是壓扁 QR */}
								<div className='flex flex-col items-center justify-center flex-1 w-full min-h-32'>
									{qrDataUrl ? (
										<div className='flex aspect-square min-h-0 max-h-60 max-w-full flex-1 bg-white p-2.5'>
											<img
												src={qrDataUrl}
												alt={zh ? '通行證 QR Code' : 'Digital pass QR code'}
												className='min-w-0 flex-1 object-contain [image-rendering:pixelated]'
											/>
										</div>
									) : (
										<div className='flex items-center justify-center flex-1 max-w-full min-h-0 border aspect-square max-h-60 border-white/10 bg-black/40'>
											<p className='animate-pulse font-mono text-xs uppercase tracking-[0.2em] text-secondary'>Generating QR…</p>
										</div>
									)}
								</div>
								<p className='font-mono text-xs tracking-[0.22em] text-white/55'>{token}</p>
								{passErrorCode ? (
									<p className={`${typography.scale.label} text-primary`}>
										{message(LOOKUP_ERRORS, passErrorCode, PASS_FALLBACK, zh)}
									</p>
								) : null}
								{/* 一行寫得完：多一行就吃掉 16px，會別已經印在上面那條帶子上 */}
								<p className={`w-full border-t border-white/10 pt-2 text-center ${typography.scale.micro} text-white/60`}>
									{pass?.conference
										? zh
											? `到「${pass.conference}」報到處出示・建議截圖保存`
											: `Show at the “${pass.conference}” desk · screenshot to keep`
										: zh
											? '報到時出示此 QR Code・建議截圖保存'
											: 'Show this at check-in · screenshot to keep'}
								</p>
							</section>

							<section className='p-4 ds-surface-soft sm:px-5 taller:py-5'>
								<p className='ds-section-kicker'>Poster / Demo Vote</p>
								{verified ? (
									windowOpen ? (
										<Link
											to={voteHref}
											className='mt-2 flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-3.5 font-mono text-sm uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25'
										>
											<Vote size={18} />
											{zh ? '進入 Poster / Demo 投票' : 'Enter Poster / Demo voting'}
										</Link>
									) : (
										<button
											type='button'
											disabled
											className='mt-2 w-full border border-white/14 bg-white/6 py-3.5 font-mono text-sm uppercase tracking-[0.18em] text-white/42'
										>
											{voteOpen === null && isSupabaseConfigured
												? zh ? '確認投票狀態中…' : 'Checking vote status…'
												: zh ? '投票將於活動當日開放' : 'Voting opens on the event day'}
										</button>
									)
								) : (
									<form className='flex flex-col gap-2 mt-2' onSubmit={handleVerify}>
										<label className='flex flex-col gap-1.5'>
											<span className='font-mono text-xs uppercase tracking-[0.18em] text-white/55'>
												{secretLabel}
											</span>
											{/* 輸入框與送出併成一列：比上下堆疊省約 50px，是「一屏」能不能成立的關鍵一刀 */}
											<div className='flex gap-2'>
												<input
													type='text'
													value={secret}
													onChange={(e) => setSecret(e.target.value)}
													autoComplete='email'
													required
													placeholder={
														pass?.has_email === false
															? zh ? '請洽工作人員取得通行語' : 'Ask a staff member for the passphrase'
															: zh ? '報名時填寫的 Email' : 'The email you registered with'
													}
													className='min-w-0 flex-1 border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
												/>
												<button
													type='submit'
													disabled={verifyBusy}
													className='flex shrink-0 items-center justify-center gap-2 border border-primary bg-primary/15 px-4 font-mono text-sm uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:border-white/14 disabled:bg-white/6 disabled:text-white/42'
												>
													<Vote size={18} />
													{verifyBusy ? (zh ? '驗證中…' : 'Verifying…') : (zh ? '驗證' : 'Verify')}
												</button>
											</div>
										</label>
										{verifyErrorCode ? (
											<p className={`${typography.scale.micro} text-primary`}>
												{message(VERIFY_ERRORS, verifyErrorCode, VERIFY_FALLBACK, zh)}
											</p>
										) : null}
										<p className={`${typography.scale.micro} text-white/45`}>
											{zh
												? '投票前需確認身分；沒有留 Email 請洽現場工作人員。'
												: 'We confirm your identity before voting. No email on file? Ask a staff member.'}
										</p>
									</form>
								)}
								<p className={`mt-2 ${typography.scale.micro} text-white/50`}>{voteWindowNote}</p>
							</section>
						</>
					) : (
						<>
							<section className='flex flex-col gap-4 p-5 ds-surface-panel sm:p-6'>
								<div>
									<p className='ds-section-kicker'>Find My Pass</p>
									<p className={`mt-1.5 ${typography.scale.label} text-white/72`}>
										{zh
											? '選擇你參加的會議並輸入報名時填寫的姓名，即可查詢報到 QR Code。'
											: 'Pick the conference you are attending and enter the name you registered with to get your check-in QR code.'}
									</p>
								</div>
								<form className='flex flex-col gap-3' onSubmit={handleLookup}>
									<label className='flex flex-col gap-1.5'>
										<span className='font-mono text-xs uppercase tracking-[0.18em] text-white/55'>
											{zh ? '會議 Conference' : 'Conference'}
										</span>
										<select
											value={conference}
											onChange={(e) => setConference(e.target.value)}
											className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-sm text-white focus:border-secondary focus:outline-none'
										>
											{CONFERENCES.map((c) => (
												<option key={c} value={c} className='bg-black'>
													{c}
												</option>
											))}
										</select>
									</label>
									<label className='flex flex-col gap-1.5'>
										<span className='font-mono text-xs uppercase tracking-[0.18em] text-white/55'>
											{zh ? '姓名 Name' : 'Name'}
										</span>
										<input
											type='text'
											value={lookupName}
											onChange={(e) => setLookupName(e.target.value)}
											autoComplete='name'
											required
											placeholder={zh ? '報名時填寫的姓名' : 'The name you registered with'}
											className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
										/>
									</label>
									{needEmailToDisambiguate ? (
										<label className='flex flex-col gap-1.5'>
											<span className='font-mono text-xs uppercase tracking-[0.18em] text-white/55'>Email</span>
											<input
												type='email'
												value={lookupEmail}
												onChange={(e) => setLookupEmail(e.target.value)}
												autoComplete='email'
												required
												placeholder={zh ? '有多位同名者，請輸入 Email' : 'Several attendees share this name — enter your email'}
												className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
											/>
										</label>
									) : null}
									<button
										type='submit'
										disabled={lookupBusy}
										className='flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-3 font-mono text-sm uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:border-white/14 disabled:bg-white/6 disabled:text-white/42'
									>
										<Search size={18} />
										{lookupBusy ? (zh ? '查詢中…' : 'Searching…') : (zh ? '查詢通行證' : 'Find my pass')}
									</button>
									{lookupErrorCode ? (
										<p className={`${typography.scale.label} text-primary`}>
											{message(LOOKUP_ERRORS, lookupErrorCode, LOOKUP_FALLBACK, zh)}
										</p>
									) : null}
								</form>
							</section>

							<section className='flex items-start gap-3 p-4 ds-surface-soft'>
								<AlertTriangle className='mt-0.5 shrink-0 text-white/55' size={20} />
								<p className={`${typography.scale.micro} text-white/72`}>
									{zh
										? '若你收到的報名信 / 報到 QR Code 含完整連結，直接開啟即可顯示通行證，不需查詢。'
										: 'If your registration email or check-in QR code contains a full link, just open it — the pass shows up without a lookup.'}
								</p>
							</section>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default QPage;
