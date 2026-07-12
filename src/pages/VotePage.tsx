import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, X } from 'lucide-react';
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
 * /vote — Poster 與 Demo 兩類投票，每類各 3 票。
 *
 * 呈現分流（沿用舊版 pointer/hover 判斷）：
 * - 桌機（pointer: fine + hover）→ 卡片牆 grid：資訊全露出、卡上直接投票，
 *   取代舊 3D 星系（得一張張點開才看得到資訊）
 * - 手機/平板 → 保留原本的橫滑 snap carousel + 快速跳轉 pills，
 *   點卡片開視窗投票（視窗已無大圖，資訊不再被擋）
 *
 * 設計決策：
 * - 不收作品封面圖（蒐集上傳成本高）→ 卡片頂部以「裝飾標頭」補視覺重量：
 *   大 pixel 字序號 + 類別色漸層（poster 橘 / demo 綠）+ CSS 網格紋理
 * - 投票者看不到即時票數（避免從眾灌票）；議程人員帶 ?ct 旗標可看
 *   （純 UI 開關——votes 表本來就公開可讀，這裡防的是引導不是資安）
 * - tt=測試旗標：強制 UI 視為投票進行中（cast_vote 伺服器端仍驗時間窗）
 * - 備案版本（全卡片牆、無 carousel）凍結在 VotePageCardWall.tsx（未接 route）
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

type VoteControls = {
	hasToken: boolean;
	windowStatus: WindowStatus;
	casting: boolean;
	votedIds: string[];
	remainingIn: (category: Category) => number;
	voteError: string | null;
	errorEntryId: string | null;
	onCast: (entryId: string) => void;
};

const formatWindowTime = (iso: string | null): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};

// 類別色調：poster 主色（橘）、demo 副色（綠），與站上雙色編碼一致
const CATEGORY_TONES: Record<Category, { text: string; gradient: string }> = {
	poster: { text: 'text-primary', gradient: 'linear-gradient(135deg, rgba(251,65,5,0.30), rgba(251,65,5,0.08) 55%, rgba(0,0,0,0))' },
	demo: { text: 'text-secondary', gradient: 'linear-gradient(135deg, rgba(41,185,58,0.30), rgba(41,185,58,0.08) 55%, rgba(0,0,0,0))' },
};

// 純 CSS 網格紋理（免圖檔），墊在類別色漸層底下
const GRID_TEXTURE =
	'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 24px)';

/** 裝飾標頭：無封面圖後補視覺重量，手機卡 / 桌機卡 / 投票視窗共用 */
function EntryCardHeader({
	entry,
	tally,
	showTallies,
	compact,
}: {
	entry: EntryVM;
	tally: number;
	showTallies: boolean;
	compact?: boolean;
}) {
	const tone = CATEGORY_TONES[entry.category];
	return (
		<div
			className={`relative flex w-full items-center justify-center border-b border-white/10 bg-[#0a0a0c] ${compact ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}
			style={{ backgroundImage: `${tone.gradient}, ${GRID_TEXTURE}` }}
		>
			<span className={`font-pixel tracking-[0.1em] ${tone.text} ${compact ? 'text-[30px]' : 'text-[34px] sm:text-[40px]'}`}>{entry.id}</span>
			<span className='absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/35'>
				{entry.category === 'demo' ? 'DEMO' : 'POSTER'}
			</span>
			{showTallies ? (
				<span className='absolute right-3 top-3 border border-secondary/40 bg-black/70 px-2 py-0.5 font-mono text-[11px] text-secondary'>{tally}</span>
			) : null}
		</div>
	);
}

function VoteButton({
	entry,
	voteControls,
	zh,
}: {
	entry: EntryVM;
	voteControls: VoteControls;
	zh: boolean;
}) {
	const [confirming, setConfirming] = useState(false);
	const { hasToken, windowStatus, casting, votedIds, remainingIn, onCast } = voteControls;
	const votedThis = votedIds.includes(entry.id);
	const remaining = remainingIn(entry.category);
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

	return (
		<div>
			{confirming && !disabled ? (
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
			) : (
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
			)}
			{voteControls.voteError && voteControls.errorEntryId === entry.id ? (
				<p className={`mt-2 text-center ${typography.scale.micro} text-primary`}>{voteControls.voteError}</p>
			) : null}
		</div>
	);
}

/** 桌機卡片牆：資訊全露出、卡上直接投票（取代舊 3D 星系） */
function DesktopCardWall({
	entries,
	tallyMap,
	showTallies,
	voteControls,
	zh,
}: {
	entries: EntryVM[];
	tallyMap: Map<string, number>;
	showTallies: boolean;
	voteControls: VoteControls;
	zh: boolean;
}) {
	return (
		<div className='mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
			{entries.map((entry, index) => {
				const votedThis = voteControls.votedIds.includes(entry.id);
				return (
					<article
						key={entry.id}
						className={`flex flex-col overflow-hidden border bg-[rgba(10,10,12,0.96)] shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-1 hover:rotate-0 ${index % 2 === 0 ? 'rotate-[1.2deg]' : 'rotate-[-1.2deg]'
							} ${votedThis ? 'border-primary/60' : 'border-white/12 hover:border-primary/50'}`}
					>
						<EntryCardHeader entry={entry} tally={tallyMap.get(entry.id) ?? 0} showTallies={showTallies} />
						<div className='flex flex-1 flex-col gap-3 p-5'>
							<div className='flex items-center justify-between gap-3'>
								<p className='font-mono text-[10px] uppercase tracking-[0.22em] text-primary'>{entry.id}</p>
								<span className='inline-flex items-center gap-2'>
									{entry.theme ? (
										<span className='border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
											{entry.theme}
										</span>
									) : null}
									{votedThis ? <Check className='text-primary' size={16} /> : null}
								</span>
							</div>
							<h3 className='font-roboto text-[18px] font-bold leading-[1.35] text-white'>{entry.title}</h3>
							{entry.author ? <p className={`text-white/55 ${typography.scale.label}`}>{entry.author}</p> : null}
							<div className='mt-auto pt-3'>
								<VoteButton entry={entry} voteControls={voteControls} zh={zh} />
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
}

/** 手機/平板：原版橫滑 snap carousel + 快速跳轉 pills（封面圖換成裝飾標頭） */
function MobileEntryCarousel({
	entries,
	categoryLabel,
	tallyMap,
	showTallies,
	votedIds,
	selectedEntry,
	onSelectEntry,
	zh,
}: {
	entries: EntryVM[];
	categoryLabel: string;
	tallyMap: Map<string, number>;
	showTallies: boolean;
	votedIds: string[];
	selectedEntry: EntryVM | null;
	onSelectEntry: (entry: EntryVM) => void;
	zh: boolean;
}) {
	const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const scrollToEntry = (entryId: string) => {
		cardRefs.current[entryId]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
	};

	return (
		<section className='relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(41,185,58,0.1),transparent_38%),#050505] px-4 pb-14 pt-8'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='font-mono text-[10px] uppercase tracking-[0.24em] text-primary'>{categoryLabel} Gallery</p>
						<h2 className='mt-2 font-pixel text-[26px] uppercase tracking-[0.12em] text-white'>
							{zh ? `${categoryLabel} 瀏覽` : `${categoryLabel} Browse`}
						</h2>
					</div>
					<div className='rounded border border-white/10 bg-black/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
						{entries.length} {zh ? '件作品' : 'Entries'}
					</div>
				</div>

				<p className={`max-w-2xl ${typography.scale.body} text-white/68`}>
					{zh
						? '左右滑動瀏覽作品，往下滑可繼續瀏覽頁面。點開卡片即可查看並投票。'
						: 'Swipe horizontally to browse entries. Vertical scroll stays with the page — tap a card to view and vote.'}
				</p>

				<div className='-mx-4 overflow-x-auto px-4 [scrollbar-width:none]'>
					<div
						aria-label='Entry Quick Jump'
						className='flex min-w-max gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-3 backdrop-blur-sm'
					>
						{entries.map((entry) => (
							<button
								key={`jump-${entry.id}`}
								type='button'
								onClick={() => scrollToEntry(entry.id)}
								className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.14em] transition-colors ${selectedEntry?.id === entry.id
									? 'border-primary/60 bg-primary/12 text-primary'
									: 'border-white/10 bg-black/45 text-white/58'
									}`}
							>
								{entry.id}
							</button>
						))}
					</div>
				</div>

				<div className='-mx-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory [scrollbar-width:none]'>
					<div className='flex min-w-max gap-4'>
						{entries.map((entry) => {
							const isSelected = selectedEntry?.id === entry.id;
							const votedThis = votedIds.includes(entry.id);

							return (
								<motion.button
									key={entry.id}
									ref={(element) => {
										cardRefs.current[entry.id] = element;
									}}
									type='button'
									whileTap={{ scale: 0.98 }}
									onClick={() => onSelectEntry(entry)}
									className={`snap-center overflow-hidden border bg-[rgba(10,10,12,0.96)] text-left shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all ${isSelected
										? 'w-[82vw] max-w-[21rem] -translate-y-1 rotate-0 border-primary/55'
										: 'w-[72vw] max-w-[18rem] rotate-[-2deg] border-white/12'
										}`}
								>
									<EntryCardHeader entry={entry} tally={tallyMap.get(entry.id) ?? 0} showTallies={showTallies} />
									<div className='space-y-3 p-4'>
										<div className='flex items-center justify-between gap-3'>
											<p className='font-mono text-[10px] uppercase tracking-[0.22em] text-primary'>{entry.id}</p>
											<span className='inline-flex items-center gap-2'>
												{entry.theme ? (
													<span className='rounded border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
														{entry.theme}
													</span>
												) : null}
												{votedThis ? <Check className='text-primary' size={14} /> : null}
											</span>
										</div>
										<h3 className='font-roboto text-[18px] font-bold leading-[1.35] text-white'>{entry.title}</h3>
										{entry.author ? <p className={`text-white/55 ${typography.scale.label}`}>{entry.author}</p> : null}
									</div>
								</motion.button>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

/** 手機投票視窗：原 PosterDetailModal 拿掉整個圖片欄後的輕量版 */
function EntryDetailModal({
	entry,
	onClose,
	tally,
	showTallies,
	voteControls,
	zh,
}: {
	entry: EntryVM;
	onClose: () => void;
	tally: number;
	showTallies: boolean;
	voteControls: VoteControls;
	zh: boolean;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md'
		>
			<motion.div
				initial={{ opacity: 0, y: 24, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 24, scale: 0.98 }}
				transition={{ type: 'spring', damping: 24, stiffness: 240 }}
				className='relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden border border-primary/30 bg-[rgba(5,5,8,0.96)] shadow-[0_0_80px_rgba(0,0,0,0.7)]'
			>
				<button
					type='button'
					onClick={onClose}
					className='absolute right-3 top-3 z-10 rounded-full border border-white/12 bg-black/45 p-2 text-white/70 transition-colors hover:border-primary/40 hover:text-white'
				>
					<X size={18} />
				</button>

				<EntryCardHeader entry={entry} tally={tally} showTallies={showTallies} compact />

				<div className='flex flex-col gap-3 overflow-y-auto p-5'>
					<div className='flex flex-wrap items-center gap-2'>
						<p className='font-mono text-[11px] uppercase tracking-[0.22em] text-primary'>{entry.id}</p>
						{entry.theme ? (
							<span className='rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary'>
								{entry.theme}
							</span>
						) : null}
					</div>
					<h3 className={`${typography.scale.cardTitle} text-white`}>{entry.title}</h3>
					{entry.author ? <p className={`${typography.scale.label} text-white/55`}>{entry.author}</p> : null}

					<div className='pt-4'>
						<VoteButton entry={entry} voteControls={voteControls} zh={zh} />
						<button
							type='button'
							onClick={onClose}
							className='mt-3 w-full border border-white/20 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-all hover:border-primary hover:bg-primary/10 hover:text-primary'
						>
							{zh ? '關閉' : 'Close'}
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}

const VotePage: React.FC = () => {
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
	const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
	const [isDesktopGallery, setIsDesktopGallery] = useState(false);

	const zh = language === 'zh';

	useSEO(
		zh ? '投票' : 'Vote',
		zh
			? 'TAICHI 2026 Poster 與 Demo 投票：兩類各 3 票。'
			: 'TAICHI 2026 poster & demo voting: 3 votes per category.',
	);

	// 桌機（滑鼠 + hover）走卡片牆；手機/平板/觸控筆電走 carousel（與舊版判斷一致）
	useEffect(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
			return undefined;
		}
		const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
		const syncIsDesktopGallery = () => setIsDesktopGallery(mediaQuery.matches);
		syncIsDesktopGallery();
		mediaQuery.addEventListener('change', syncIsDesktopGallery);
		return () => mediaQuery.removeEventListener('change', syncIsDesktopGallery);
	}, []);

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

	// 切換 Poster/Demo 分頁時收起投票視窗與錯誤訊息
	useEffect(() => {
		setSelectedEntryId(null);
		setVoteError(null);
		setErrorEntryId(null);
	}, [activeCategory]);

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

	const selectedEntry = useMemo(
		() => visibleEntries.find((e) => e.id === selectedEntryId) ?? null,
		[visibleEntries, selectedEntryId],
	);

	const voteControls: VoteControls = {
		hasToken: Boolean(token),
		windowStatus,
		casting,
		votedIds,
		remainingIn,
		voteError,
		errorEntryId,
		onCast: handleCastVote,
	};

	const activeCategoryLabel = activeCategory === 'demo' ? 'Demo' : 'Poster';

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

			<div className='pb-24 pt-10'>
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
						<div className='mx-auto w-full max-w-6xl px-4 sm:px-8'>
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
						</div>

						{visibleEntries.length === 0 ? (
							<div className='flex min-h-[30vh] flex-col items-center justify-center gap-4 px-6 text-center'>
								<p className='font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
									{zh ? '作品即將上架' : 'Entries coming soon'}
								</p>
							</div>
						) : isDesktopGallery ? (
							<div className='mx-auto w-full max-w-6xl px-4 sm:px-8'>
								<DesktopCardWall
									entries={visibleEntries}
									tallyMap={tallyMap}
									showTallies={showTallies}
									voteControls={voteControls}
									zh={zh}
								/>
							</div>
						) : (
							<div className='mt-10'>
								<MobileEntryCarousel
									entries={visibleEntries}
									categoryLabel={activeCategoryLabel}
									tallyMap={tallyMap}
									showTallies={showTallies}
									votedIds={votedIds}
									selectedEntry={selectedEntry}
									onSelectEntry={(entry) => setSelectedEntryId((currentId) => (currentId === entry.id ? null : entry.id))}
									zh={zh}
								/>
							</div>
						)}
					</>
				)}
			</div>

			{/* 投票視窗只掛在 carousel 分支（桌機卡片牆卡上直接投） */}
			<AnimatePresence>
				{selectedEntry && !isDesktopGallery ? (
					<EntryDetailModal
						entry={selectedEntry}
						onClose={() => setSelectedEntryId(null)}
						tally={tallyMap.get(selectedEntry.id) ?? 0}
						showTallies={showTallies}
						voteControls={voteControls}
						zh={zh}
					/>
				) : null}
			</AnimatePresence>
		</div>
	);
};

export default VotePage;
