import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { X, Loader2 } from 'lucide-react';
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

const ACCENT_GREEN = '#29B93A';
const POSTER_PLACEHOLDER = '/images/fake poster demo.avif';
const VOTE_STATE_POLL_MS = 10_000;

/** Poster + live tally + resolved image, as consumed by the gallery components. */
type PosterVM = {
	id: string;
	title: string;
	author: string;
	theme: string;
	image: string;
	voteCount: number;
};

type WindowStatus = 'loading' | 'before' | 'open' | 'closed';

type VoteControls = {
	hasToken: boolean;
	windowStatus: WindowStatus;
	remaining: number;
	votedIds: string[];
	casting: boolean;
	errorMessage: string | null;
	onCast: (posterId: string) => void;
};

const formatWindowTime = (iso: string | null): string | null => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};

function PosterCard3D({
	poster,
	index,
	onSelect,
	isSelected,
	showVoteBadge,
}: {
	poster: PosterVM;
	index: number;
	onSelect: (p: PosterVM) => void;
	isSelected: boolean;
	showVoteBadge: boolean;
}) {
	const meshRef = useRef<THREE.Group>(null!);
	const texture = useLoader(THREE.TextureLoader, poster.image);
	const [hovered, setHovered] = useState(false);
	const targetPos = useMemo(() => new THREE.Vector3(), []);
	const targetRot = useMemo(() => new THREE.Euler(), []);

	useFrame(() => {
		if (!meshRef.current) return;

		const cols = 10;
		const spacing = 3;
		const x = (index % cols) * spacing - (cols * spacing) / 2 + spacing / 2;
		const y = -Math.floor(index / cols) * spacing * 1.5 + 5;
		targetPos.set(x, y, 0);
		targetRot.set(0, 0, 0);

		meshRef.current.position.lerp(targetPos, 0.1);

		const targetQuat = new THREE.Quaternion().setFromEuler(targetRot);
		meshRef.current.quaternion.slerp(targetQuat, 0.1);
	});

	return (
		<group
			ref={meshRef}
			onClick={(e) => {
				e.stopPropagation();
				onSelect(poster);
			}}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
		>
			<mesh>
				<planeGeometry args={[2, 3]} />
				<meshBasicMaterial map={texture} />
			</mesh>
			<mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
				<planeGeometry args={[2, 3]} />
				<meshBasicMaterial map={texture} />
			</mesh>
			<mesh position={[0, 0, -0.005]}>
				<planeGeometry args={[2.1, 3.1]} />
				<meshBasicMaterial color={hovered || isSelected ? ACCENT_GREEN : '#222'} />
			</mesh>
			{showVoteBadge ? (
				<Html position={[0.8, 1.3, 0.1]} center>
					<div className='rounded-full border border-primary bg-black/80 px-2 py-0.5 font-mono text-[10px] text-primary'>
						{poster.voteCount}
					</div>
				</Html>
			) : null}
		</group>
	);
}

function DesktopPosterScene({
	posters,
	selectedPosterId,
	onSelect,
}: {
	posters: PosterVM[];
	selectedPosterId: string | null;
	onSelect: (poster: PosterVM) => void;
}) {
	return (
		<>
			<color attach='background' args={['#050505']} />
			<fog attach='fog' args={['#050505', 14, 50]} />
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
			<ambientLight intensity={0.5} />
			<directionalLight position={[6, 12, 8]} intensity={1.2} color='#e8ffd1' />
			<pointLight position={[-10, 6, 8]} intensity={1} color='#76d7ff' />
			<pointLight position={[10, -6, 6]} intensity={0.8} color='#29B93A' />
			<PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
			<OrbitControls makeDefault enablePan={false} enableRotate enableZoom />
			{posters.map((poster, i) => (
				<PosterCard3D
					key={poster.id}
					poster={poster}
					index={i}
					onSelect={onSelect}
					isSelected={selectedPosterId === poster.id}
					showVoteBadge={selectedPosterId === null}
				/>
			))}
			<ContactShadows position={[0, -10, 0]} opacity={0.3} scale={40} blur={2.5} far={14} />
		</>
	);
}

function PosterMetaBar({ poster, language }: { poster: PosterVM; language: 'zh' | 'en' }) {
	return (
		<div className='mt-4 flex flex-wrap items-center gap-3 border-y border-white/10 py-3'>
			<p className='font-mono text-[11px] uppercase tracking-[0.22em] text-primary'>{poster.id.replace('poster-', 'Poster ')}</p>
			{poster.theme ? (
				<span className='rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary'>
					{poster.theme}
				</span>
			) : null}
			<div className='ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55'>
				<span>{language === 'zh' ? '當前票數' : 'Current Votes'}</span>
				<span className='font-pixel text-2xl leading-none text-primary'>{poster.voteCount}</span>
			</div>
		</div>
	);
}

function VoteButton({
	poster,
	voteControls,
	language,
}: {
	poster: PosterVM;
	voteControls: VoteControls;
	language: 'zh' | 'en';
}) {
	const [confirming, setConfirming] = useState(false);
	useEffect(() => setConfirming(false), [poster.id]);

	const zh = language === 'zh';
	const { hasToken, windowStatus, remaining, votedIds, casting, errorMessage, onCast } = voteControls;
	const votedThis = votedIds.includes(poster.id);
	const disabled = votedThis || !hasToken || windowStatus !== 'open' || remaining <= 0 || casting;

	let label: string;
	if (votedThis) label = zh ? '已投這張' : 'Voted';
	else if (!hasToken) label = zh ? '請用報到 QR Code 進入投票' : 'Open your check-in QR link to vote';
	else if (windowStatus === 'loading') label = zh ? '確認投票狀態中…' : 'Checking vote status…';
	else if (windowStatus === 'before') label = zh ? '投票尚未開放' : 'Voting not open yet';
	else if (windowStatus === 'closed') label = zh ? '投票已截止' : 'Voting closed';
	else if (remaining <= 0) label = zh ? `已用完 ${MAX_VOTES} 票` : `All ${MAX_VOTES} votes used`;
	else if (casting) label = zh ? '投票中…' : 'Casting vote…';
	else label = zh ? `投這張（剩 ${remaining} 票）` : `Vote for this (${remaining} left)`;

	return (
		<div>
			{confirming && !disabled ? (
				<div className='flex gap-3'>
					<button
						type='button'
						onClick={() => {
							setConfirming(false);
							onCast(poster.id);
						}}
						className='flex-1 border border-primary bg-primary/20 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/30'
					>
						{zh ? `確認投給 ${poster.id.replace('poster-', 'Poster ')}` : `Confirm vote for ${poster.id}`}
					</button>
					<button
						type='button'
						onClick={() => setConfirming(false)}
						className='border border-white/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/40 hover:text-white'
					>
						{zh ? '取消' : 'Cancel'}
					</button>
				</div>
			) : (
				<button
					type='button'
					disabled={disabled}
					onClick={() => setConfirming(true)}
					className={`w-full py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${votedThis
						? 'border border-primary/60 bg-primary/10 text-primary'
						: disabled
							? 'border border-white/14 bg-white/6 text-white/42'
							: 'border border-primary bg-primary/15 text-primary hover:bg-primary/25'
						}`}
				>
					{label}
				</button>
			)}
			{errorMessage ? (
				<p className={`mt-3 text-center ${typography.scale.micro} text-primary`}>{errorMessage}</p>
			) : null}
		</div>
	);
}

function PosterDetailModal({
	poster,
	onClose,
	onOpenImage,
	language,
	isDesktop,
	voteControls,
}: {
	poster: PosterVM;
	onClose: () => void;
	onOpenImage: (poster: PosterVM) => void;
	language: 'zh' | 'en';
	isDesktop: boolean;
	voteControls: VoteControls;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md md:p-8'
		>
			<motion.div
				initial={{ opacity: 0, y: 24, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 24, scale: 0.98 }}
				transition={{ type: 'spring', damping: 24, stiffness: 240 }}
				className={`relative flex w-full overflow-hidden border border-primary/30 bg-[rgba(5,5,8,0.96)] shadow-[0_0_80px_rgba(0,0,0,0.7)] ${isDesktop ? 'max-w-5xl flex-row' : 'max-h-[92vh] max-w-xl flex-col'
					}`}
			>
				<button
					type='button'
					onClick={onClose}
					className='absolute right-4 top-4 z-10 rounded-full border border-white/12 bg-black/45 p-2 text-white/70 transition-colors hover:border-primary/40 hover:text-white'
				>
					<X size={20} />
				</button>

				<div className={`${isDesktop ? 'w-[46%] border-r border-white/10' : 'border-b border-white/10'}`}>
					<button
						type='button'
						aria-label='Open poster image'
						onClick={() => onOpenImage(poster)}
						className='block w-full cursor-zoom-in bg-black/40 text-left'
					>
						<img
							src={poster.image}
							alt={poster.title}
							className={`w-full object-cover ${isDesktop ? 'h-full min-h-[36rem]' : 'max-h-[56vh] touch-pan-y'}`}
						/>
					</button>
				</div>

				<div className={`flex flex-1 flex-col overflow-y-auto ${isDesktop ? 'max-h-[82vh] p-8' : 'max-h-[36vh] p-5 pb-6'}`}>
					<PosterMetaBar poster={poster} language={language} />
					<h3 className={`mt-5 ${typography.scale.cardTitle} text-white`}>{poster.title}</h3>
					{poster.author ? <p className={`mt-2 ${typography.scale.label} text-white/55`}>{poster.author}</p> : null}

					<div className='mt-auto pt-8'>
						<VoteButton poster={poster} voteControls={voteControls} language={language} />
						<button
							type='button'
							onClick={onClose}
							className='mt-4 w-full border border-white/20 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-all hover:border-primary hover:bg-primary/10 hover:text-primary'
						>
							{language === 'zh' ? '關閉' : 'Close'}
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}

function PosterImageViewer({
	poster,
	onClose,
}: {
	poster: PosterVM;
	onClose: () => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z-[60] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm'
			onClick={onClose}
		>
			<button
				type='button'
				onClick={onClose}
				className='absolute right-4 top-4 z-10 rounded-full border border-white/12 bg-black/45 p-2 text-white/70 transition-colors hover:border-primary/40 hover:text-white'
			>
				<X size={20} />
			</button>
			<img
				src={poster.image}
				alt={poster.title}
				className='max-h-[96vh] w-auto max-w-full object-contain touch-pan-x touch-pan-y'
				onClick={(event) => event.stopPropagation()}
			/>
		</motion.div>
	);
}

function GalleryLoader() {
	return (
		<div className='flex h-full w-full flex-col items-center justify-center gap-4 bg-[#050505]'>
			<Loader2 className='animate-spin text-secondary' size={48} />
			<p className='animate-pulse font-mono text-xs text-secondary'>INITIALIZING POSTER GALAXY...</p>
		</div>
	);
}

function DesktopPosterGallery({
	posters,
	language,
	selectedPoster,
	onSelectPoster,
}: {
	posters: PosterVM[];
	language: 'zh' | 'en';
	selectedPoster: PosterVM | null;
	onSelectPoster: (poster: PosterVM) => void;
}) {
	const galleryRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const galleryElement = galleryRef.current;
		if (!galleryElement) {
			return undefined;
		}

		const blockWheelZoom = (event: WheelEvent) => {
			if (!event.ctrlKey) {
				event.stopPropagation();
			}
		};

		galleryElement.addEventListener('wheel', blockWheelZoom, { capture: true });
		return () => galleryElement.removeEventListener('wheel', blockWheelZoom, { capture: true });
	}, []);

	return (
		<section ref={galleryRef} className='relative h-[100dvh] w-full overflow-hidden'>
			<div className='absolute inset-0'>
				<Suspense fallback={<GalleryLoader />}>
					<Canvas dpr={[1, 1.5]}>
						<Suspense fallback={null}>
							<DesktopPosterScene
								posters={posters}
								selectedPosterId={selectedPoster?.id ?? null}
								onSelect={onSelectPoster}
							/>
						</Suspense>
					</Canvas>
				</Suspense>
			</div>

			<div className='pointer-events-none absolute bottom-6 left-6 z-20'>
				<div className='rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 backdrop-blur-md'>
					{posters.length} {language === 'zh' ? '張海報' : 'Posters'}
				</div>
			</div>

			<div className='pointer-events-none absolute bottom-6 right-6 z-20 rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md'>
				{language === 'zh' ? '一人3票' : '3 votes per person'}
			</div>
		</section>
	);
}

function MobilePosterGallery({
	posters,
	language,
	selectedPoster,
	onSelectPoster,
}: {
	posters: PosterVM[];
	language: 'zh' | 'en';
	selectedPoster: PosterVM | null;
	onSelectPoster: (poster: PosterVM) => void;
}) {
	const mobilePosterRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const scrollToPoster = (posterId: string) => {
		mobilePosterRefs.current[posterId]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
	};

	return (
		<section className='relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(41,185,58,0.1),transparent_38%),#050505] px-4 pb-14 pt-8 md:hidden'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='font-mono text-[10px] uppercase tracking-[0.24em] text-primary'>
							{language === 'zh' ? 'Mobile Poster Gallery' : 'Mobile Poster Gallery'}
						</p>
						<h2 className='mt-2 font-pixel text-[26px] uppercase tracking-[0.12em] text-white'>
							{language === 'zh' ? '海報瀏覽' : 'Poster Browse'}
						</h2>
					</div>
					<div className='rounded border border-white/10 bg-black/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
						{posters.length} {language === 'zh' ? '張海報' : 'Posters'}
					</div>
				</div>

				<p className={`max-w-2xl ${typography.scale.body} text-white/68`}>
					{language === 'zh'
						? '左右滑動瀏覽海報，往下滑可繼續瀏覽頁面。點開海報後再放大閱讀內容。'
						: 'Swipe horizontally to browse posters. Vertical scroll stays with the page, and poster details open in a focused viewer.'}
				</p>

				<div className='-mx-4 overflow-x-auto px-4 [scrollbar-width:none]'>
					<div
						aria-label='Poster Quick Jump'
						className='flex min-w-max gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-3 backdrop-blur-sm'
					>
						{posters.map((poster) => (
							<button
								key={`jump-${poster.id}`}
								type='button'
								onClick={() => scrollToPoster(poster.id)}
								className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.14em] transition-colors ${selectedPoster?.id === poster.id
									? 'border-primary/60 bg-primary/12 text-primary'
									: 'border-white/10 bg-black/45 text-white/58'
									}`}
							>
								{poster.id.replace('poster-', '')}
							</button>
						))}
					</div>
				</div>

				<div className='-mx-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory [scrollbar-width:none]'>
					<div className='flex min-w-max gap-4'>
						{posters.map((poster) => {
							const isSelected = selectedPoster?.id === poster.id;

							return (
								<motion.button
									key={poster.id}
									ref={(element) => {
										mobilePosterRefs.current[poster.id] = element;
									}}
									type='button'
									whileTap={{ scale: 0.98 }}
									onClick={() => onSelectPoster(poster)}
									className={`snap-center overflow-hidden border bg-[rgba(10,10,12,0.96)] text-left shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all ${isSelected
										? 'w-[82vw] max-w-[21rem] -translate-y-1 rotate-0 border-primary/55'
										: 'w-[72vw] max-w-[18rem] rotate-[-2deg] border-white/12'
										}`}
								>
									<div className='relative'>
										<img src={poster.image} alt={poster.title} className='aspect-[2/3] w-full object-cover' />
										<div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/45 to-transparent' />
										<div className='absolute right-3 top-3 rounded-full border border-primary/70 bg-black/75 px-2 py-1 font-mono text-[10px] text-primary'>
											{poster.voteCount}
										</div>
									</div>
									<div className='space-y-3 p-4'>
										<div className='flex items-center justify-between gap-3'>
											<p className='font-mono text-[10px] uppercase tracking-[0.22em] text-primary'>{poster.id.replace('poster-', 'Poster ')}</p>
											{poster.theme ? (
												<span className='rounded border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
													{poster.theme}
												</span>
											) : null}
										</div>
										<h3 className='font-roboto text-[18px] font-bold leading-[1.35] text-white'>{poster.title}</h3>
										{poster.author ? <p className={`text-white/55 ${typography.scale.label}`}>{poster.author}</p> : null}
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

const VotePage: React.FC = () => {
	const { language } = useLanguage();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('t') ?? '';
	// tt=測試旗標：強制 UI 視為投票進行中（cast_vote 伺服器端仍驗時間窗，不構成繞過）
	const testOverride = searchParams.has('tt');

	const [posters, setPosters] = useState<PosterVM[]>([]);
	const [postersLoaded, setPostersLoaded] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [voteState, setVoteState] = useState<VoteState | null>(null);
	const [votedIds, setVotedIds] = useState<string[]>(() => getVotedPosterIds(token));
	const [serverVotesUsed, setServerVotesUsed] = useState<number | null>(null);
	const [casting, setCasting] = useState(false);
	const [voteError, setVoteError] = useState<string | null>(null);
	const [selectedPosterId, setSelectedPosterId] = useState<string | null>(null);
	const [selectedImagePoster, setSelectedImagePoster] = useState<PosterVM | null>(null);
	const [isDesktopGallery, setIsDesktopGallery] = useState(false);

	useSEO(
		language === 'zh' ? '投票' : 'Vote',
		language === 'zh'
			? 'TAICHI 2026 海報公開投票：每人 3 票，票數即時更新。'
			: 'TAICHI 2026 poster voting: 3 votes per attendee with live tallies.',
	);

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

	// 海報清單一次載入（活動期間不常變）
	useEffect(() => {
		let cancelled = false;
		getPosters()
			.then((data) => {
				if (cancelled) return;
				setPosters(
					data.map((p) => ({
						id: p.id,
						title: p.title,
						author: p.author ?? '',
						theme: p.theme ?? '',
						image: p.image_url || POSTER_PLACEHOLDER,
						voteCount: 0,
					})),
				);
			})
			.catch(() => {
				if (!cancelled) setLoadError(true);
			})
			.finally(() => {
				if (!cancelled) setPostersLoaded(true);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	// 即時票數：每 ~10s 輪詢 vote_state（分頁隱藏時略過），投完票會立即再刷
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

	// 換海報時清掉上一次投票的錯誤訊息
	useEffect(() => setVoteError(null), [selectedPosterId]);

	// 已投狀態以伺服器為準（votes 公開可讀）：換裝置時 localStorage 是空的，
	// 若只靠鏡射，第二台裝置會顯示成沒投過
	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		getVotedPosterIdsFromServer(token)
			.then((ids) => {
				if (cancelled) return;
				ids.forEach((id) => addVotedPosterId(token, id)); // 回填本機鏡射
				setVotedIds(getVotedPosterIds(token));
				setServerVotesUsed(ids.length);
			})
			.catch(() => {
				/* 查不到就先信 localStorage，cast_vote 伺服器端仍會擋 */
			});
		return () => {
			cancelled = true;
		};
	}, [token]);

	const tallyMap = useMemo(() => {
		const map = new Map<string, number>();
		voteState?.tallies?.forEach((t) => map.set(t.poster_id, t.votes));
		return map;
	}, [voteState]);

	const postersVM = useMemo(
		() => posters.map((p) => ({ ...p, voteCount: tallyMap.get(p.id) ?? 0 })),
		[posters, tallyMap],
	);

	const selectedPoster = useMemo(
		() => postersVM.find((p) => p.id === selectedPosterId) ?? null,
		[postersVM, selectedPosterId],
	);

	const windowStatus: WindowStatus = useMemo(() => {
		if (testOverride) return 'open';
		if (!voteState) return 'loading';
		if (voteState.open) return 'open';
		if (voteState.closes_at && Date.now() > new Date(voteState.closes_at).getTime()) return 'closed';
		return 'before';
	}, [voteState, testOverride]);

	// server 才是真相：localStorage 僅鏡射；異地投過票時以 server 回報數字為準
	const votesUsed = Math.max(votedIds.length, serverVotesUsed ?? 0);
	const remaining = Math.max(0, MAX_VOTES - votesUsed);

	const refreshVoteState = useCallback(async () => {
		try {
			const state = await getVoteState();
			if (state) setVoteState(state);
		} catch {
			/* 下一輪輪詢會補上 */
		}
	}, []);

	const handleCastVote = useCallback(
		async (posterId: string) => {
			if (!token || casting) return;
			setCasting(true);
			setVoteError(null);
			const result = await castVote(token, posterId);
			// `=== true`（非 truthiness）：本專案未開 strictNullChecks，
			// boolean discriminant 的 truthiness check 在 else 分支不會 narrow union
			if (result.ok === true) {
				setVotedIds(getVotedPosterIds(token));
				setServerVotesUsed(result.votesUsed);
			} else {
				setVoteError(result.message);
				if (result.error === 'max_votes') setServerVotesUsed(MAX_VOTES);
				if (result.error === 'duplicate_poster') {
					setVotedIds((ids) => (ids.includes(posterId) ? ids : [...ids, posterId]));
				}
			}
			await refreshVoteState();
			setCasting(false);
		},
		[token, casting, refreshVoteState],
	);

	const voteControls: VoteControls = {
		hasToken: Boolean(token),
		windowStatus,
		remaining,
		votedIds,
		casting,
		errorMessage: voteError,
		onCast: handleCastVote,
	};

	const handleSelectPoster = (poster: PosterVM) => {
		setSelectedPosterId((currentId) => (currentId === poster.id ? null : poster.id));
	};

	const zh = language === 'zh';
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
								<span>{zh ? `剩 ${remaining} 票` : `${remaining} votes left`}</span>
							</div>
						) : null}
						{testOverride ? (
							<div className='inline-flex items-center gap-3 border border-secondary/40 bg-secondary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-secondary'>
								<span>TEST MODE</span>
							</div>
						) : null}
					</div>
					<p className={`max-w-3xl text-center ${typography.scale.bodyLg} text-white/72`}>
						{zh
							? '每人 3 票、每張海報限投一次，點選海報即可查看並投票，票數即時更新。'
							: 'Every attendee gets 3 votes (one per poster). Tap any poster to view details and cast your vote — tallies update live.'}
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

			{loadError ? (
				<div className='flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 text-center'>
					<p className='font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
						{zh ? '海報資料載入失敗' : 'Failed to load posters'}
					</p>
					<p className={`${typography.scale.label} text-white/60`}>
						{zh ? '請確認網路後重新整理頁面。' : 'Please check your connection and reload the page.'}
					</p>
				</div>
			) : !postersLoaded ? (
				<div className='min-h-[40vh]'>
					<GalleryLoader />
				</div>
			) : postersVM.length === 0 ? (
				<div className='flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 text-center'>
					<p className='font-mono text-[12px] uppercase tracking-[0.2em] text-primary'>
						{zh ? '海報即將上架' : 'Posters coming soon'}
					</p>
				</div>
			) : isDesktopGallery ? (
				<DesktopPosterGallery
					posters={postersVM}
					language={language}
					selectedPoster={selectedPoster}
					onSelectPoster={handleSelectPoster}
				/>
			) : (
				<MobilePosterGallery
					posters={postersVM}
					language={language}
					selectedPoster={selectedPoster}
					onSelectPoster={handleSelectPoster}
				/>
			)}

			<AnimatePresence>
				{selectedPoster ? (
					<PosterDetailModal
						poster={selectedPoster}
						onClose={() => setSelectedPosterId(null)}
						onOpenImage={setSelectedImagePoster}
						language={language}
						isDesktop={isDesktopGallery}
						voteControls={voteControls}
					/>
				) : null}
			</AnimatePresence>

			<AnimatePresence>
				{selectedImagePoster ? <PosterImageViewer poster={selectedImagePoster} onClose={() => setSelectedImagePoster(null)} /> : null}
			</AnimatePresence>
		</div>
	);
};

export default VotePage;
