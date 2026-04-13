import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { X, Loader2 } from 'lucide-react';

import ScrollReveal from '../components/ScrollReveal';
import WarpBackground from '../components/WarpBackground';
import { typography } from '../design-system/typography';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import { mockPosters, posterImageUrl, type MockPoster } from '../data/mockPosters';

const ACCENT_GREEN = '#A8F020';
const POSTER_IMAGE = '/images/fake poster demo.jpg';



function PosterCard3D({
	poster,
	index,
	total,
	onSelect,
	isSelected,
	showVoteBadge,
}: {
	poster: MockPoster;
	index: number;
	total: number;
	onSelect: (p: MockPoster) => void;
	isSelected: boolean;
	showVoteBadge: boolean;
}) {
	const meshRef = useRef<THREE.Group>(null!);
	const texture = useLoader(THREE.TextureLoader, POSTER_IMAGE);
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
					<div className='rounded-full border border-[#A8F020] bg-black/80 px-2 py-0.5 font-mono text-[10px] text-[#A8F020]'>
						{poster.voteCount}
					</div>
				</Html>
			) : null}
		</group>
	);
}

function DesktopPosterScene({
	selectedPosterId,
	onSelect,
}: {
	selectedPosterId: string | null;
	onSelect: (poster: MockPoster) => void;
}) {
	return (
		<>
			<color attach='background' args={['#050505']} />
			<fog attach='fog' args={['#050505', 14, 50]} />
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
			<ambientLight intensity={0.5} />
			<directionalLight position={[6, 12, 8]} intensity={1.2} color='#e8ffd1' />
			<pointLight position={[-10, 6, 8]} intensity={1} color='#76d7ff' />
			<pointLight position={[10, -6, 6]} intensity={0.8} color='#A8F020' />
			<PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
			<OrbitControls makeDefault enablePan={false} enableRotate enableZoom />
			{mockPosters.map((poster, i) => (
				<PosterCard3D
					key={poster.id}
					poster={poster}
					index={i}
					total={mockPosters.length}
					onSelect={onSelect}
					isSelected={selectedPosterId === poster.id}
					showVoteBadge={selectedPosterId === null}
				/>
			))}
			<ContactShadows position={[0, -10, 0]} opacity={0.3} scale={40} blur={2.5} far={14} />
		</>
	);
}

function PosterMetaBar({ poster, language }: { poster: MockPoster; language: 'zh' | 'en' }) {
	return (
		<div className='mt-4 flex flex-wrap items-center gap-3 border-y border-white/10 py-3'>
			<p className='font-mono text-[11px] uppercase tracking-[0.22em] text-[#A8F020]'>{poster.id.replace('poster-', 'Poster ')}</p>
			<span className='rounded border border-[#A8F020]/30 bg-[#A8F020]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A8F020]'>
				{poster.theme}
			</span>
			<div className='ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55'>
				<span>{language === 'zh' ? '當前票數' : 'Current Votes'}</span>
				<span className='font-pixel text-2xl leading-none text-[#A8F020]'>{poster.voteCount}</span>
			</div>
		</div>
	);
}

function PosterDetailModal({
	poster,
	onClose,
	onOpenImage,
	language,
	isDesktop,
}: {
	poster: MockPoster;
	onClose: () => void;
	onOpenImage: (poster: MockPoster) => void;
	language: 'zh' | 'en';
	isDesktop: boolean;
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
				className={`relative flex w-full overflow-hidden border border-[#A8F020]/30 bg-[rgba(5,5,8,0.96)] shadow-[0_0_80px_rgba(0,0,0,0.7)] ${isDesktop ? 'max-w-5xl flex-row' : 'max-h-[92vh] max-w-xl flex-col'
					}`}
			>
				<button
					type='button'
					onClick={onClose}
					className='absolute right-4 top-4 z-10 rounded-full border border-white/12 bg-black/45 p-2 text-white/70 transition-colors hover:border-[#A8F020]/40 hover:text-white'
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
							src={posterImageUrl}
							alt={poster.title}
							className={`w-full object-cover ${isDesktop ? 'h-full min-h-[36rem]' : 'max-h-[56vh] touch-pan-y'}`}
						/>
					</button>
				</div>

				<div className={`flex flex-1 flex-col overflow-y-auto ${isDesktop ? 'max-h-[82vh] p-8' : 'max-h-[36vh] p-5 pb-6'}`}>
					<PosterMetaBar poster={poster} language={language} />
					<h3 className={`mt-5 ${typography.scale.cardTitle} text-white`}>{poster.title}</h3>
					<p className={`mt-2 ${typography.scale.label} text-white/55`}>{poster.author}</p>
					<p className={`mt-6 ${typography.scale.body} text-white/82`}>{poster.abstract}</p>

					<div className='mt-auto pt-8'>
						<button
							type='button'
							disabled
							className='w-full border border-white/14 bg-white/6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/42'
						>
							{language === 'zh' ? '投票即將開放' : 'Vote Coming Soon'}
						</button>
						<button
							type='button'
							onClick={onClose}
							className='mt-4 w-full border border-white/20 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-all hover:border-[#A8F020] hover:bg-[#A8F020]/10 hover:text-[#A8F020]'
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
	poster: MockPoster;
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
				className='absolute right-4 top-4 z-10 rounded-full border border-white/12 bg-black/45 p-2 text-white/70 transition-colors hover:border-[#A8F020]/40 hover:text-white'
			>
				<X size={20} />
			</button>
			<img
				src={posterImageUrl}
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
			<Loader2 className='animate-spin text-[#A8F020]' size={48} />
			<p className='animate-pulse font-mono text-xs text-[#A8F020]'>INITIALIZING POSTER GALAXY...</p>
		</div>
	);
}

function DesktopPosterGallery({
	language,
	selectedPoster,
	onSelectPoster,
}: {
	language: 'zh' | 'en';
	selectedPoster: MockPoster | null;
	onSelectPoster: (poster: MockPoster) => void;
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
								selectedPosterId={selectedPoster?.id ?? null}
								onSelect={onSelectPoster}
							/>
						</Suspense>
					</Canvas>
				</Suspense>
			</div>

			<div className='pointer-events-none absolute bottom-6 left-6 z-20'>
				<div className='rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 backdrop-blur-md'>
					{mockPosters.length} {language === 'zh' ? '張海報' : 'Posters'}
				</div>
			</div>

			<div className='pointer-events-none absolute bottom-6 right-6 z-20 rounded border border-white/10 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md'>
				{language === 'zh' ? '一人3票' : '3 votes per person'}
			</div>
		</section>
	);
}

function MobilePosterGallery({
	language,
	selectedPoster,
	onSelectPoster,
}: {
	language: 'zh' | 'en';
	selectedPoster: MockPoster | null;
	onSelectPoster: (poster: MockPoster) => void;
}) {
	const mobilePosterRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const scrollToPoster = (posterId: string) => {
		mobilePosterRefs.current[posterId]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
	};

	return (
		<section className='relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.1),transparent_38%),#050505] px-4 pb-14 pt-8 md:hidden'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='font-mono text-[10px] uppercase tracking-[0.24em] text-[#A8F020]'>
							{language === 'zh' ? 'Mobile Poster Gallery' : 'Mobile Poster Gallery'}
						</p>
						<h2 className='mt-2 font-pixel text-[26px] uppercase tracking-[0.12em] text-white'>
							{language === 'zh' ? '海報瀏覽' : 'Poster Browse'}
						</h2>
					</div>
					<div className='rounded border border-white/10 bg-black/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
						{mockPosters.length} {language === 'zh' ? '張海報' : 'Posters'}
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
						{mockPosters.map((poster) => (
							<button
								key={`jump-${poster.id}`}
								type='button'
								onClick={() => scrollToPoster(poster.id)}
								className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.14em] transition-colors ${selectedPoster?.id === poster.id
									? 'border-[#A8F020]/60 bg-[#A8F020]/12 text-[#A8F020]'
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
						{mockPosters.map((poster) => {
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
										? 'w-[82vw] max-w-[21rem] -translate-y-1 rotate-0 border-[#A8F020]/55'
										: 'w-[72vw] max-w-[18rem] rotate-[-2deg] border-white/12'
										}`}
								>
									<div className='relative'>
										<img src={posterImageUrl} alt={poster.title} className='aspect-[2/3] w-full object-cover' />
										<div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/45 to-transparent' />
										<div className='absolute right-3 top-3 rounded-full border border-[#A8F020]/70 bg-black/75 px-2 py-1 font-mono text-[10px] text-[#A8F020]'>
											{poster.voteCount}
										</div>
									</div>
									<div className='space-y-3 p-4'>
										<div className='flex items-center justify-between gap-3'>
											<p className='font-mono text-[10px] uppercase tracking-[0.22em] text-[#A8F020]'>{poster.id.replace('poster-', 'Poster ')}</p>
											<span className='rounded border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55'>
												{poster.theme}
											</span>
										</div>
										<h3 className='font-roboto text-[18px] font-bold leading-[1.35] text-white'>{poster.title}</h3>
										<p className={`text-white/55 ${typography.scale.label}`}>{poster.author}</p>
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
	const [selectedPoster, setSelectedPoster] = useState<MockPoster | null>(null);
	const [selectedImagePoster, setSelectedImagePoster] = useState<MockPoster | null>(null);
	const [isDesktopGallery, setIsDesktopGallery] = useState(false);

	useSEO(
		language === 'zh' ? '投票' : 'Vote',
		language === 'zh'
			? 'TAICHI 2026 海報投票頁面即將開放。'
			: 'TAICHI 2026 poster voting system will be launched in August!',
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

	const handleSelectPoster = (poster: MockPoster) => {
		setSelectedPoster((currentPoster) => (currentPoster?.id === poster.id ? null : poster));
	};

	return (
		<div className='min-h-screen w-full bg-[#050505] text-white'>
			<div className='relative overflow-hidden border-b border-white/10 px-6 pb-16 pt-48 md:px-20'>
				<WarpBackground />
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(118,215,255,0.14),transparent_26%)]' />
				<ScrollReveal className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>
					<h1 className={`text-center ${typography.scale.pageTitle} text-[#A8F020] drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]`}>Vote</h1>
					<div className='inline-flex items-center gap-3 border border-[#A8F020]/30 bg-[#A8F020]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#A8F020]'>
						<span>COMING SOON</span>
					</div>
					<p className={`max-w-3xl text-center ${typography.scale.bodyLg} text-white/72`}>
						{language === 'zh'
							? 'TAICHI 2026 海報公開投票系統，即將於八月啟動！'
							: 'TAICHI 2026 poster voting system will be launched in August!'}
					</p>
				</ScrollReveal>
			</div>

			{isDesktopGallery ? (
				<DesktopPosterGallery
					language={language}
					selectedPoster={selectedPoster}
					onSelectPoster={handleSelectPoster}
				/>
			) : (
				<MobilePosterGallery language={language} selectedPoster={selectedPoster} onSelectPoster={handleSelectPoster} />
			)}

			<AnimatePresence>
				{selectedPoster ? (
					<PosterDetailModal
						poster={selectedPoster}
						onClose={() => setSelectedPoster(null)}
						onOpenImage={setSelectedImagePoster}
						language={language}
						isDesktop={isDesktopGallery}
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
