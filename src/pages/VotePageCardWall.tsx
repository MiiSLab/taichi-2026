import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import {
	MAX_VOTES,
	castVote,
	getPosters,
	getVoteState,
	getVotedPosterIds,
	getVotedPosterIdsFromServer,
	addVotedPosterId,
	type VoteState,
} from '../services/votingService';

/**
 * ⚠ 備案版本（未接 route）：純卡片牆呈現，桌機/手機同一套 grid。
 *
 * 正式版 VotePage.tsx 採混合呈現（桌機卡片牆 + 手機/平板橫滑 carousel）。
 * 此檔為重構前的凍結快照，保留以便快速切換回「全卡片牆」方案：
 * 把 App.tsx 的 lazy import 指到本檔即可。不隨後續改動維護。
 *
 * /vote — Poster 與 Demo 兩類投票，每類各 3 票。
 * - 不收作品封面圖，卡片直接呈現序號/標題/作者/主題，免點開
 * - 投票者看不到即時票數；議程人員帶 ?ct 旗標可看票數
 * - tt=測試旗標：強制 UI 視為投票進行中（cast_vote 伺服器端仍驗時間窗）
 */

const VOTE_STATE_POLL_MS = 10_000;

type Category = 'poster' | 'demo';
const CATEGORIES: { key: Category; label: string }[] = [
	{ key: 'poster', label: 'POSTER' },
	{ key: 'demo', label: 'DEMO' },
];

/** 舊資料的 category 可能為 null → 視為 poster */
const categoryOf = (raw: string | null): Category => (raw === 'demo' ? 'demo' : 'poster');

type EntryVM = {
	id: string;
	title: string;
	author: string;
	theme: string;
	category: Category;
};

type WindowStatus = 'loading' | 'before' | 'open' | 'closed';

const formatWindowTime = (iso: string | null): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};

function VoteButton({
	entry,
	votedThis,
	remaining,
	hasToken,
	windowStatus,
	casting,
	zh,
	onCast,
}: {
	entry: EntryVM;
	votedThis: boolean;
	remaining: number;
	hasToken: boolean;
	windowStatus: WindowStatus;
	casting: boolean;
	zh: boolean;
	onCast: (entryId: string) => void;
}) {
	const [confirming, setConfirming] = useState(false);
	const disabled = votedThis || !hasToken || windowStatus !== 'open' || remaining <= 0 || casting;

	let label: string;
	if (votedThis) label = zh ? '已投這件' : 'Voted';
	else if (!hasToken) label = zh ? '請用報到 QR Code 進入投票' : 'Open your check-in QR link to vote';
	else if (windowStatus === 'loading') label = zh ? '確認投票狀態中…' : 'Checking vote status…';
	else if (windowStatus === 'before') label = zh ? '投票尚未開放' : 'Voting not open yet';
	else if (windowStatus === 'closed') label = zh ? '投票已截止' : 'Voting closed';
	else if (remaining <= 0) label = zh ? `${entry.category === 'demo' ? 'Demo' : 'Poster'} 的 ${MAX_VOTES} 票已用完` : `All ${MAX_VOTES} ${entry.category} votes used`;
	else if (casting) label = zh ? '投票中…' : 'Casting vote…';
	else label = zh ? `投這件（剩 ${remaining} 票）` : `Vote for this (${remaining} left)`;

	if (confirming && !disabled) {
		return (
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => {
						setConfirming(false);
						onCast(entry.id);
					}}
					className='flex-1 border border-primary bg-primary/20 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/30'
				>
					{zh ? `確認投給 ${entry.id}` : `Confirm vote for ${entry.id}`}
				</button>
				<button
					type='button'
					onClick={() => setConfirming(false)}
					className='border border-white/20 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/40 hover:text-white'
				>
					{zh ? '取消' : 'Cancel'}
				</button>
			</div>
		);
	}

	return (
		<button
			type='button'
			disabled={disabled}
			onClick={() => setConfirming(true)}
			className={`w-full py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${votedThis
				? 'border border-primary/60 bg-primary/10 text-primary'
				: disabled
					? 'border border-white/14 bg-white/6 text-white/42'
					: 'border border-primary bg-primary/15 text-primary hover:bg-primary/25'
				}`}
		>
			{label}
		</button>
	);
}

const VotePageCardWall: React.FC = () => {
	const { language } = useLanguage();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('t') ?? '';
	// tt=測試旗標：強制 UI 視為投票進行中（cast_vote 伺服器端仍驗時間窗，不構成繞過）
	const testOverride = searchParams.has('tt');
	// ct=議程人員旗標：顯示各作品即時票數（投票者預設看不到）
	const showTallies = searchParams.has('ct');

	const [entries, setEntries] = useState<EntryVM[]>([]);
	const [entriesLoaded, setEntriesLoaded] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [voteState, setVoteState] = useState<VoteState | null>(null);
	const [votedIds, setVotedIds] = useState<string[]>(() => getVotedPosterIds(token));
	const [casting, setCasting] = useState(false);
	const [voteError, setVoteError] = useState<string | null>(null);
	const [errorEntryId, setErrorEntryId] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState<Category>('poster');

	const zh = language === 'zh';

	useSEO(
		zh ? '投票' : 'Vote',
		zh
			? 'TAICHI 2026 Poster 與 Demo 投票：兩類各 3 票。'
			: 'TAICHI 2026 poster & demo voting: 3 votes per category.',
	);

	// 作品清單一次載入（活動期間不常變）
	useEffect(() => {
		let cancelled = false;
		getPosters()
			.then((data) => {
				if (cancelled) return;
				setEntries(
					data.map((p) => ({
						id: p.id,
						title: p.title,
						author: p.author ?? '',
						theme: p.theme ?? '',
						category: categoryOf(p.category),
					})),
				);
			})
			.catch(() => {
				if (!cancelled) setLoadError(true);
			})
			.finally(() => {
				if (!cancelled) setEntriesLoaded(true);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	// 輪詢 vote_state：拿時間窗狀態（票數只有 ?ct 才會顯示）
	useEffect(() => {
		let cancelled = false;
		const refresh = () => {
			if (document.hidden) return;
			getVoteState()
				.then((state) => {
					if (!cancelled && state) setVoteState(state);
				})
				.catch(() => {
					/* 保留上一筆狀態，下一輪再試 */
				});
		};
		refresh();
		const id = window.setInterval(refresh, VOTE_STATE_POLL_MS);
		return () => {
			cancelled = true;
			window.clearInterval(id);
		};
	}, []);

	// 已投狀態以伺服器為準（votes 公開可讀）：換裝置時 localStorage 是空的，
	// 若只靠鏡射，第二台裝置會顯示成沒投過
	const syncVotedFromServer = useCallback(async () => {
		if (!token) return;
		try {
			const ids = await getVotedPosterIdsFromServer(token);
			ids.forEach((id) => addVotedPosterId(token, id)); // 回填本機鏡射
			setVotedIds(getVotedPosterIds(token));
		} catch {
			/* 查不到就先信 localStorage，cast_vote 伺服器端仍會擋 */
		}
	}, [token]);

	useEffect(() => {
		void syncVotedFromServer();
	}, [syncVotedFromServer]);

	const tallyMap = useMemo(() => {
		const map = new Map<string, number>();
		voteState?.tallies?.forEach((t) => map.set(t.poster_id, t.votes));
		return map;
	}, [voteState]);

	const windowStatus: WindowStatus = useMemo(() => {
		if (testOverride) return 'open';
		if (!voteState) return 'loading';
		if (voteState.open) return 'open';
		if (voteState.closes_at && Date.now() > new Date(voteState.closes_at).getTime()) return 'closed';
		return 'before';
	}, [voteState, testOverride]);

	// 每類各 3 票：以已投作品的類別分開計數
	const categoryEntryMap = useMemo(() => new Map(entries.map((e) => [e.id, e.category])), [entries]);
	const remainingIn = useCallback(
		(category: Category) => {
			const used = votedIds.filter((id) => categoryEntryMap.get(id) === category).length;
			return Math.max(0, MAX_VOTES - used);
		},
		[votedIds, categoryEntryMap],
	);

	const handleCastVote = useCallback(
		async (entryId: string) => {
			if (!token || casting) return;
			setCasting(true);
			setVoteError(null);
			setErrorEntryId(null);
			const result = await castVote(token, entryId);
			// `=== true`（非 truthiness）：本專案未開 strictNullChecks，
			// boolean discriminant 的 truthiness check 在 else 分支不會 narrow union
			if (result.ok === true) {
				setVotedIds(getVotedPosterIds(token));
			} else {
				setVoteError(result.message);
				setErrorEntryId(entryId);
				if (result.error === 'duplicate_poster') {
					setVotedIds((ids) => (ids.includes(entryId) ? ids : [...ids, entryId]));
				}
				// 異地投過票（本機鏡射過期）→ 重抓伺服器已投清單，餘票數才會對
				if (result.error === 'max_votes' || result.error === 'duplicate_poster') {
					await syncVotedFromServer();
				}
			}
			setCasting(false);
		},
		[token, casting, syncVotedFromServer],
	);

	const visibleEntries = useMemo(
		() => entries.filter((e) => e.category === activeCategory),
		[entries, activeCategory],
	);

	const statusChip =
		windowStatus === 'open'
			? zh ? '投票進行中' : 'VOTING OPEN'
			: windowStatus === 'closed'
				? zh ? '投票已截止' : 'VOTING CLOSED'
				: windowStatus === 'before'
					? zh ? '投票尚未開放' : 'VOTING OPENS SOON'
					: 'LOADING…';
	const opensLabel = formatWindowTime(voteState?.opens_at ?? null);
	const closesLabel = formatWindowTime(voteState?.closes_at ?? null);

	return (
		<div className='min-h-screen w-full bg-[#050505] text-white'>
			<div className='relative overflow-hidden border-b border-white/10 px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>
					<h1 className={`text-center ${typography.scale.pageTitle} text-primary drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]`}>Vote</h1>
					<div className='flex flex-wrap items-center justify-center gap-3'>
						<div className='inline-flex items-center gap-3 border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary'>
							<span>{statusChip}</span>
						</div>
						{token && windowStatus === 'open' ? (
							<div className='inline-flex items-center gap-3 border border-white/15 bg-black/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75'>
								<span>{zh ? `Poster 剩 ${remainingIn('poster')} 票` : `Poster: ${remainingIn('poster')} left`}</span>
								<span className='text-white/30'>|</span>
								<span>{zh ? `Demo 剩 ${remainingIn('demo')} 票` : `Demo: ${remainingIn('demo')} left`}</span>
							</div>
						) : null}
						{testOverride ? (
							<div className='inline-flex items-center gap-3 border border-secondary/40 bg-secondary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-secondary'>
								<span>TEST MODE</span>
							</div>
						) : null}
						{showTallies ? (
							<div className='inline-flex items-center gap-3 border border-secondary/40 bg-secondary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-secondary'>
								<span>{zh ? '票數顯示中（議程人員）' : 'TALLIES VISIBLE (STAFF)'}</span>
							</div>
						) : null}
					</div>
					<p className={`max-w-3xl text-center ${typography.scale.bodyLg} text-white/72`}>
						{zh
							? `Poster 與 Demo 兩類各 ${MAX_VOTES} 票，每件作品限投一次。`
							: `${MAX_VOTES} votes for posters and ${MAX_VOTES} for demos — one vote per entry.`}
					</p>
					{!token ? (
						<p className={`max-w-3xl text-center ${typography.scale.label} text-white/55`}>
							{zh
								? '目前為瀏覽模式：請由報到 QR Code 的連結進入即可投票。'
								: 'Browse mode: open the link from your check-in QR code to vote.'}
						</p>
					) : null}
					{windowStatus === 'before' && opensLabel ? (
						<p className={`max-w-3xl text-center ${typography.scale.label} text-white/55`}>
							{zh ? `投票將於 ${opensLabel} 開放。` : `Voting opens at ${opensLabel}.`}
						</p>
					) : null}
					{windowStatus === 'open' && closesLabel ? (
						<p className={`max-w-3xl text-center ${typography.scale.label} text-white/55`}>
							{zh ? `投票於 ${closesLabel} 截止。` : `Voting closes at ${closesLabel}.`}
						</p>
					) : null}
				</ScrollReveal>
			</div>

			<section className='mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-8'>
				{loadError ? (
					<div className='flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 text-center'>
						<p className='font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
							{zh ? '作品資料載入失敗' : 'Failed to load entries'}
						</p>
						<p className={`${typography.scale.label} text-white/60`}>
							{zh ? '請確認網路後重新整理頁面。' : 'Please check your connection and reload the page.'}
						</p>
					</div>
				) : !entriesLoaded ? (
					<div className='flex min-h-[40vh] flex-col items-center justify-center gap-4'>
						<Loader2 className='animate-spin text-secondary' size={40} />
						<p className='animate-pulse font-mono text-xs text-secondary'>LOADING ENTRIES…</p>
					</div>
				) : (
					<>
						{/* Poster / Demo 分頁（樣式對齊 /program 的日期分頁） */}
						<div className='mx-auto flex w-full max-w-2xl'>
							{CATEGORIES.map((category) => (
								<button
									key={category.key}
									type='button'
									onClick={() => setActiveCategory(category.key)}
									className={`flex-1 border-2 py-3 font-mono text-lg font-bold transition-colors sm:text-xl ${activeCategory === category.key
										? 'border-primary bg-primary text-black'
										: 'border-primary/40 text-white/60 hover:text-white/80'
										}`}
								>
									{category.label}
									{token && windowStatus === 'open' ? (
										<span className='ms-2 font-mono text-[12px] font-normal tracking-[0.08em]'>
											{zh ? `剩 ${remainingIn(category.key)}` : `${remainingIn(category.key)} left`}
										</span>
									) : null}
								</button>
							))}
						</div>

						{visibleEntries.length === 0 ? (
							<div className='flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center'>
								<p className='font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
									{zh ? '作品即將上架' : 'Entries coming soon'}
								</p>
							</div>
						) : (
							<div className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
								{visibleEntries.map((entry) => {
									const votedThis = votedIds.includes(entry.id);
									return (
										<article
											key={entry.id}
											className={`flex flex-col gap-3 border p-5 transition-colors ${votedThis ? 'border-primary/60 bg-primary/[0.07]' : 'border-white/12 bg-zinc-950/70'
												}`}
										>
											<div className='flex flex-wrap items-center gap-2'>
												<span className='border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[11px] tracking-[0.18em] text-primary'>
													{entry.id}
												</span>
												{entry.theme ? (
													<span className='border border-white/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55'>
														{entry.theme}
													</span>
												) : null}
												<span className='ms-auto inline-flex items-center gap-2'>
													{showTallies ? (
														<span className='border border-secondary/40 bg-secondary/10 px-2 py-0.5 font-mono text-[11px] text-secondary'>
															{tallyMap.get(entry.id) ?? 0} {zh ? '票' : 'votes'}
														</span>
													) : null}
													{votedThis ? <Check className='text-primary' size={16} /> : null}
												</span>
											</div>
											<h3 className='font-sans text-[17px] font-semibold leading-snug text-white'>{entry.title}</h3>
											{entry.author ? <p className={`${typography.scale.label} text-white/55`}>{entry.author}</p> : null}
											<div className='mt-auto pt-2'>
												<VoteButton
													entry={entry}
													votedThis={votedThis}
													remaining={remainingIn(entry.category)}
													hasToken={Boolean(token)}
													windowStatus={windowStatus}
													casting={casting}
													zh={zh}
													onCast={handleCastVote}
												/>
												{voteError && errorEntryId === entry.id ? (
													<p className={`mt-2 text-center ${typography.scale.micro} text-primary`}>{voteError}</p>
												) : null}
											</div>
										</article>
									);
								})}
							</div>
						)}
					</>
				)}
			</section>
		</div>
	);
};

export default VotePageCardWall;
