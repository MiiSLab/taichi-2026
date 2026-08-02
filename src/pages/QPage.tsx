import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { AlertTriangle, Cookie, Search, Vote } from 'lucide-react';

import { typography } from '../design-system/typography';
import { useLanguage } from '../context/LanguageContext';
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
 * /q — 參與者數位通行證（Layout 內，含站點 Navbar / Footer）。
 *
 * 兩階段（見 Taichi_check_in/docs/adr/0004）：
 *   1. 選會別（四選一）+ 姓名 → 通行 QR 與餅乾資格綠標。
 *      沒有留 email 的人也查得到，同名多筆時才追問 email。
 *   2. 補上正確 email（沒有 email 的人用萬能通行語）→ 才解鎖投票入口。
 *      驗證是伺服器狀態，直接開 /vote 也繞不過去。
 *
 * 通行證就是網址：查到後把 token 寫回網址參數，可收藏或截圖。
 */

const formatWindowTime = (iso: string | null): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};

const LOOKUP_ERRORS: Record<string, string> = {
	not_found: '查無符合的報名資料，請確認會別與姓名和報名時填寫的一致。',
	ambiguous: '有多位同名的與會者，請一併輸入報名時填寫的 Email。',
	missing_input: '請選擇會別並輸入姓名。',
	not_configured: '查詢服務尚未設定完成，請稍後再試。',
};

const VERIFY_ERRORS: Record<string, string> = {
	email_mismatch: 'Email 與報名資料不符，請再確認一次。',
	no_email: '你的報名資料沒有留 Email，請洽現場工作人員協助。',
	not_eligible: '此通行碼沒有投票資格。',
	invalid_token: '通行碼無效，請重新查詢。',
	not_configured: '投票驗證尚未設定完成，請稍後再試。',
};

const message = (table: Record<string, string>, code: string, fallback: string) => table[code] ?? fallback;

const QPage: React.FC = () => {
	const { language } = useLanguage();
	useSEO(language === 'zh' ? '數位通行證' : 'Digital Pass', 'TAICHI 2026 參與者數位通行證：報到與投票入口。');

	const [searchParams, setSearchParams] = useSearchParams();
	const token = searchParams.get('t') ?? '';
	// tt=測試旗標：只解 UI 的時間鎖（voteHref 會把 tt 一起帶去 /vote）；
	// 伺服器端 cast_vote 仍照回合時間窗驗證，不構成繞過
	const forceVoteOpen = searchParams.has('tt');

	const [pass, setPass] = useState<PassInfo | null>(null);
	const [passError, setPassError] = useState<string | null>(null);
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
	const [lookupError, setLookupError] = useState<string | null>(null);

	// 第二階段：驗證身分才解鎖投票
	const [verified, setVerified] = useState(false);
	const [secret, setSecret] = useState('');
	const [verifyBusy, setVerifyBusy] = useState(false);
	const [verifyError, setVerifyError] = useState<string | null>(null);

	useEffect(() => {
		setVerified(isVoteVerified(token));
	}, [token]);

	const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (lookupBusy) return;
		setLookupBusy(true);
		setLookupError(null);
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
		setLookupError(message(LOOKUP_ERRORS, result.error, '查詢失敗，請確認網路後再試。'));
	};

	const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (verifyBusy || !token) return;
		setVerifyBusy(true);
		setVerifyError(null);
		const result = await verifyVoteAccess(token, secret);
		setVerifyBusy(false);
		if (result.ok === true) {
			rememberVoteVerified(token);
			setVerified(true);
			return;
		}
		setVerifyError(message(VERIFY_ERRORS, result.error, '驗證失敗，請確認網路後再試。'));
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
				else setPassError(message(LOOKUP_ERRORS, result.error, '無法取得通行證資料。'));
			})
			.catch(() => {
				if (!cancelled) setPassError('無法取得通行證資料。');
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
	const opensLabel = formatWindowTime(opensAt);
	const closesLabel = formatWindowTime(closesAt);
	const windowOpen = voteOpen || forceVoteOpen;
	const secretLabel = useMemo(
		() => (pass?.has_email === false ? '通行語 Passphrase' : 'Email'),
		[pass],
	);

	return (
		<div className='relative isolate'>
			{/* pt-32 clears the fixed site navbar */}
			<div className='mx-auto w-full max-w-[640px] px-5 pb-16 pt-32 sm:px-8'>
				<div className='flex w-full flex-col gap-6'>
					<header className='space-y-3'>
						<p className='ds-page-note'>TAICHI 2026 DIGITAL PASS</p>
						<div className='flex items-start justify-between gap-3'>
							<h1 className={`ds-page-title ${typography.scale.sectionTitle}`}>數位通行證</h1>
							{pass?.cookie_eligible ? (
								<span className='inline-flex shrink-0 items-center gap-1.5 border border-secondary/50 bg-secondary/15 px-3 py-1.5 font-mono text-[12px] text-secondary'>
									<Cookie size={16} />
									可領餅乾
								</span>
							) : null}
						</div>
						{pass?.name ? (
							<p className={`${typography.scale.bodyLg} text-white/85`}>{pass.name}，你好！</p>
						) : null}
						{pass?.ticket_type ? (
							<span className='inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
								{pass.ticket_type}
							</span>
						) : null}
					</header>

					{token ? (
						<>
							<section className='ds-surface-panel flex flex-col items-center gap-4 p-5 sm:p-6'>
								<p className='ds-section-kicker'>Check-in Pass</p>
								{qrDataUrl ? (
									<div className='w-full max-w-[248px] bg-white p-3'>
										<img src={qrDataUrl} alt='通行證 QR Code' className='h-auto w-full [image-rendering:pixelated]' />
									</div>
								) : (
									<div className='flex aspect-square w-full max-w-[248px] items-center justify-center border border-white/10 bg-black/40'>
										<p className='animate-pulse font-mono text-[11px] uppercase tracking-[0.2em] text-secondary'>Generating QR…</p>
									</div>
								)}
								<p className='font-mono text-[12px] tracking-[0.22em] text-white/55'>{token}</p>
								{passError ? <p className={`${typography.scale.label} text-primary`}>{passError}</p> : null}
								<p className={`w-full border-t border-white/10 pt-3 text-center ${typography.scale.micro} text-white/60`}>
									報到時出示此 QR Code・建議加入書籤或截圖保存
								</p>
							</section>

							<section className='ds-surface-soft p-5'>
								<p className='ds-section-kicker'>Poster / Demo Vote</p>
								{verified ? (
									windowOpen ? (
										<Link
											to={voteHref}
											className='mt-3 flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-3.5 font-mono text-[13px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25'
										>
											<Vote size={18} />
											進入 Poster / Demo 投票
										</Link>
									) : (
										<button
											type='button'
											disabled
											className='mt-3 w-full border border-white/14 bg-white/6 py-3.5 font-mono text-[13px] uppercase tracking-[0.18em] text-white/42'
										>
											{voteOpen === null && isSupabaseConfigured ? '確認投票狀態中…' : '投票將於活動當日開放'}
										</button>
									)
								) : (
									<form className='mt-3 flex flex-col gap-2' onSubmit={handleVerify}>
										<label className='flex flex-col gap-1.5'>
											<span className='font-mono text-[11px] uppercase tracking-[0.18em] text-white/55'>
												{secretLabel}
											</span>
											<input
												type='text'
												value={secret}
												onChange={(e) => setSecret(e.target.value)}
												autoComplete='email'
												required
												placeholder={pass?.has_email === false ? '請洽工作人員取得通行語' : '報名時填寫的 Email'}
												className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-[14px] text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
											/>
										</label>
										<button
											type='submit'
											disabled={verifyBusy}
											className='flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-3 font-mono text-[13px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:border-white/14 disabled:bg-white/6 disabled:text-white/42'
										>
											<Vote size={18} />
											{verifyBusy ? '驗證中…' : '驗證身分以投票'}
										</button>
										{verifyError ? <p className={`${typography.scale.micro} text-primary`}>{verifyError}</p> : null}
										<p className={`${typography.scale.micro} text-white/45`}>
											為了投票公平，投票前需確認是本人。沒有留 Email 的人請洽現場工作人員。
										</p>
									</form>
								)}
								<p className={`mt-2 ${typography.scale.micro} text-white/50`}>
									{forceVoteOpen && !voteOpen
										? '測試模式（tt）：僅解除介面時間鎖，實際投票仍以伺服器時間窗為準。'
										: voteOpen
											? closesLabel ? `投票進行中，${closesLabel} 截止。` : '投票進行中。'
											: opensLabel
												? `投票將於 ${opensLabel} 開放，屆時回到本頁即可進入。`
												: '投票尚未開放，活動當日回到本頁即可進入。'}
								</p>
							</section>
						</>
					) : (
						<>
							<section className='ds-surface-panel flex flex-col gap-4 p-5 sm:p-6'>
								<div>
									<p className='ds-section-kicker'>Find My Pass</p>
									<p className={`mt-1.5 ${typography.scale.label} text-white/72`}>
										選擇你參加的會議並輸入報名時填寫的姓名，即可查詢報到 QR Code。
									</p>
								</div>
								<form className='flex flex-col gap-3' onSubmit={handleLookup}>
									<label className='flex flex-col gap-1.5'>
										<span className='font-mono text-[11px] uppercase tracking-[0.18em] text-white/55'>會議 Conference</span>
										<select
											value={conference}
											onChange={(e) => setConference(e.target.value)}
											className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-[14px] text-white focus:border-secondary focus:outline-none'
										>
											{CONFERENCES.map((c) => (
												<option key={c} value={c} className='bg-black'>
													{c}
												</option>
											))}
										</select>
									</label>
									<label className='flex flex-col gap-1.5'>
										<span className='font-mono text-[11px] uppercase tracking-[0.18em] text-white/55'>姓名 Name</span>
										<input
											type='text'
											value={lookupName}
											onChange={(e) => setLookupName(e.target.value)}
											autoComplete='name'
											required
											placeholder='報名時填寫的姓名'
											className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-[14px] text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
										/>
									</label>
									{needEmailToDisambiguate ? (
										<label className='flex flex-col gap-1.5'>
											<span className='font-mono text-[11px] uppercase tracking-[0.18em] text-white/55'>Email</span>
											<input
												type='email'
												value={lookupEmail}
												onChange={(e) => setLookupEmail(e.target.value)}
												autoComplete='email'
												required
												placeholder='有多位同名者，請輸入 Email'
												className='border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-[14px] text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
											/>
										</label>
									) : null}
									<button
										type='submit'
										disabled={lookupBusy}
										className='flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-3 font-mono text-[13px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:border-white/14 disabled:bg-white/6 disabled:text-white/42'
									>
										<Search size={18} />
										{lookupBusy ? '查詢中…' : '查詢通行證'}
									</button>
									{lookupError ? <p className={`${typography.scale.label} text-primary`}>{lookupError}</p> : null}
								</form>
							</section>

							<section className='ds-surface-soft flex items-start gap-3 p-4'>
								<AlertTriangle className='mt-0.5 shrink-0 text-white/55' size={20} />
								<p className={`${typography.scale.micro} text-white/72`}>
									若你收到的報名信 / 報到 QR Code 含完整連結，直接開啟即可顯示通行證，不需查詢。
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
