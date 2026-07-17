import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { AlertTriangle, Search, Vote } from 'lucide-react';

import { typography } from '../design-system/typography';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import { getVoteState, isSupabaseConfigured, lookupPass } from '../services/votingService';

/**
 * /q — 參與者數位通行證（Layout 內，含站點 Navbar / Footer）。
 *
 * 報到端發出的 QR 指向 /q?t=<token>&name=<name>&type=<type>：
 *   - 顯示可出示給工作人員掃描的通行 QR（編碼當前 URL，掃了就能報到）
 *   - 投票入口時間鎖：vote_window 未開 → 鎖住；開了 → 帶 token 導向 /vote
 *
 * 沒帶 t 參數時提供自助查詢：輸入報名時的姓名 + Email 或手機（lookup_pass RPC，
 * 兩者皆須符合；手機經 norm_phone 正規化比對，吃 +886/81-/括號等格式），
 * 查到後把 token/name/type 寫回網址參數走同一條通行證流程（URL 即通行證，可收藏或截圖）。
 */

const formatWindowTime = (iso: string | null): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};

const QPage: React.FC = () => {
	const { language } = useLanguage();
	useSEO(language === 'zh' ? '數位通行證' : 'Digital Pass', 'TAICHI 2026 參與者數位通行證：報到與海報投票入口。');

	const [searchParams, setSearchParams] = useSearchParams();
	const token = searchParams.get('t') ?? '';
	const name = searchParams.get('name') ?? '';
	const ticketType = searchParams.get('type') ?? '';
	// tt=測試旗標：只解 UI 的時間鎖（voteHref 會把 tt 一起帶去 /vote）；
	// 伺服器端 cast_vote 仍照 vote_window 驗證，不構成繞過
	const forceVoteOpen = searchParams.has('tt');

	const [qrDataUrl, setQrDataUrl] = useState('');
	const [voteOpen, setVoteOpen] = useState<boolean | null>(null); // null = 載入中/未知
	const [opensAt, setOpensAt] = useState<string | null>(null);
	const [closesAt, setClosesAt] = useState<string | null>(null);

	// 自助查詢（無 t 參數時）：聯絡方式一欄吃 Email 或手機（判斷交給伺服器）
	const [lookupName, setLookupName] = useState('');
	const [lookupContact, setLookupContact] = useState('');
	const [lookupBusy, setLookupBusy] = useState(false);
	const [lookupError, setLookupError] = useState<string | null>(null);

	const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (lookupBusy) return;
		setLookupBusy(true);
		setLookupError(null);
		const result = await lookupPass(lookupName, lookupContact);
		setLookupBusy(false);
		// 無 strict mode，boolean discriminant 需 === true 才能收窄
		if (result.ok === true) {
			// 查到 → 寫回網址參數走原本 token 流程（保留 tt 等既有參數）
			const next = new URLSearchParams(searchParams);
			next.set('t', result.token);
			if (result.name) next.set('name', result.name);
			if (result.ticket_type) next.set('type', result.ticket_type);
			setSearchParams(next);
		} else {
			setLookupError(
				result.error === 'not_found'
					? '查無符合的報名資料，請確認姓名與 Email／手機和報名時填寫的一致。'
					: result.error === 'not_configured'
						? '查詢服務尚未設定完成，請稍後再試。'
						: '查詢失敗，請確認網路後再試。',
			);
		}
	};

	// 通行 QR：編碼當前完整 URL（含 token），工作人員掃描即可報到
	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		QRCode.toDataURL(window.location.href, { width: 560, margin: 2 })
			.then((url) => { if (!cancelled) setQrDataUrl(url); })
			.catch(() => { /* QR 產生失敗時保留文字 token 供人工查驗 */ });
		return () => { cancelled = true; };
	}, [token]);

	// 投票入口時間鎖
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

	return (
		<div className='relative isolate'>
			{/* pt-32 clears the fixed site navbar */}
			<div className='mx-auto w-full max-w-[640px] px-5 pb-16 pt-32 sm:px-8'>
				<div className='flex min-h-[60vh] w-full flex-col gap-6'>
					<header className='space-y-4'>
						<p className='ds-page-note'>TAICHI 2026 DIGITAL PASS</p>
						<h1 className={`ds-page-title ${typography.scale.sectionTitle}`}>數位通行證</h1>
						{name ? (
							<p className={`${typography.scale.bodyLg} text-white/85`}>
								{name}，你好！
							</p>
						) : null}
						{ticketType ? (
							<span className='inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
								{ticketType}
							</span>
						) : null}
					</header>

					{token ? (
						<>
							<section className='ds-surface-panel flex flex-col items-center gap-5 p-6 sm:p-8'>
								<p className='ds-section-kicker'>Check-in Pass</p>
								{qrDataUrl ? (
									<div className='w-full max-w-[320px] bg-white p-3'>
										<img src={qrDataUrl} alt='通行證 QR Code' className='h-auto w-full [image-rendering:pixelated]' />
									</div>
								) : (
									<div className='flex aspect-square w-full max-w-[320px] items-center justify-center border border-white/10 bg-black/40'>
										<p className='animate-pulse font-mono text-[11px] uppercase tracking-[0.2em] text-secondary'>Generating QR…</p>
									</div>
								)}
								<p className='font-mono text-[12px] tracking-[0.22em] text-white/55'>{token}</p>
								<ul className={`w-full space-y-2 border-t border-white/10 pt-4 ${typography.scale.label} text-white/72`}>
									<li>・報到時出示此 QR Code 給工作人員掃描</li>
									<li>・活動當日可用此 QR Code 進入 Poster / Demo 投票</li>
									<li>・建議將此頁加入書籤或截圖保存</li>
								</ul>
							</section>

							<section className='ds-surface-soft p-6'>
								<p className='ds-section-kicker'>Poster Vote</p>
								{voteOpen || forceVoteOpen ? (
									<Link
										to={voteHref}
										className='mt-4 flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-4 font-mono text-[13px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25'
									>
										<Vote size={18} />
										進入 Poster / Demo 投票
									</Link>
								) : (
									<button
										type='button'
										disabled
										className='mt-4 w-full border border-white/14 bg-white/6 py-4 font-mono text-[13px] uppercase tracking-[0.18em] text-white/42'
									>
										{voteOpen === null && isSupabaseConfigured ? '確認投票狀態中…' : '投票將於活動當日開放'}
									</button>
								)}
								<p className={`mt-3 ${typography.scale.micro} text-white/50`}>
									{forceVoteOpen && !voteOpen
										? '測試模式（tt）：僅解除介面時間鎖，實際投票仍以伺服器時間窗為準。'
										: voteOpen
											? closesLabel
												? `投票進行中，${closesLabel} 截止。`
												: '投票進行中。'
											: opensLabel
												? `投票將於 ${opensLabel} 開放，屆時回到本頁即可進入。`
												: '投票尚未開放，活動當日回到本頁即可進入。'}
								</p>
							</section>
						</>
					) : (
						<>
							<section className='ds-surface-panel flex flex-col gap-5 p-6 sm:p-8'>
								<div>
									<p className='ds-section-kicker'>Find My Pass</p>
									<p className={`mt-2 ${typography.scale.label} text-white/72`}>
										輸入報名時填寫的姓名，加上 Email 或手機號碼，查詢你的數位通行證 QR Code。
									</p>
								</div>
								<form className='flex flex-col gap-4' onSubmit={handleLookup}>
									<label className='flex flex-col gap-2'>
										<span className='font-mono text-[12px] uppercase tracking-[0.18em] text-white/55'>姓名 Name</span>
										<input
											type='text'
											value={lookupName}
											onChange={(e) => setLookupName(e.target.value)}
											autoComplete='name'
											required
											placeholder='報名時填寫的姓名'
											className='border border-white/15 bg-black/40 px-4 py-3 font-mono text-[15px] text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
										/>
									</label>
									<label className='flex flex-col gap-2'>
										<span className='font-mono text-[12px] uppercase tracking-[0.18em] text-white/55'>Email / 手機 Mobile</span>
										{/* 一欄吃兩種：含 @ 當 Email，其餘當手機（格式寬鬆，+886/81-/括號都可，伺服器正規化比對） */}
										<input
											type='text'
											value={lookupContact}
											onChange={(e) => setLookupContact(e.target.value)}
											autoComplete='email'
											inputMode='email'
											required
											placeholder='報名時填寫的 Email 或手機號碼'
											className='border border-white/15 bg-black/40 px-4 py-3 font-mono text-[15px] text-white placeholder:text-white/25 focus:border-secondary focus:outline-none'
										/>
									</label>
									<button
										type='submit'
										disabled={lookupBusy}
										className='flex w-full items-center justify-center gap-3 border border-primary bg-primary/15 py-4 font-mono text-[13px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:border-white/14 disabled:bg-white/6 disabled:text-white/42'
									>
										<Search size={18} />
										{lookupBusy ? '查詢中…' : '查詢通行證'}
									</button>
									{lookupError ? <p className={`${typography.scale.label} text-primary`}>{lookupError}</p> : null}
								</form>
							</section>

							<section className='ds-surface-soft flex items-start gap-4 p-6'>
								<AlertTriangle className='mt-1 shrink-0 text-white/55' size={22} />
								<p className={`${typography.scale.label} text-white/72`}>
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
