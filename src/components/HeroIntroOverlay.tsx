import React, { useEffect, useState } from 'react';
import HomeHeroIntro from './home/HomeHeroIntro';

const REVEAL_DURATION_MS = 2000;
const HOLD_AFTER_REVEAL_MS = 300;
const FADE_OUT_MS = 500;
const TOTAL_DURATION_MS = REVEAL_DURATION_MS + HOLD_AFTER_REVEAL_MS + FADE_OUT_MS;

// Module-level flag: lives only as long as the current JS runtime.
// → Reset on hard reload (F5), new tab, or incognito (so intro plays again).
// → Preserved across SPA route changes (so navigating between pages does NOT replay).
let hasPlayedIntroThisRuntime = false;

const HeroIntroOverlay: React.FC = () => {
	const [phase, setPhase] = useState<'playing' | 'fading' | 'done'>(
		hasPlayedIntroThisRuntime ? 'done' : 'playing',
	);

	useEffect(() => {
		if (phase !== 'playing') return;
		hasPlayedIntroThisRuntime = true;

		const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
		const prevPaddingRight = document.body.style.paddingRight;
		const prevOverflow = document.body.style.overflow;
		if (scrollBarWidth > 0 && !document.body.style.paddingRight) {
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		}
		document.body.style.overflow = 'hidden';

		const startFade = window.setTimeout(
			() => setPhase('fading'),
			REVEAL_DURATION_MS + HOLD_AFTER_REVEAL_MS,
		);
		const finish = window.setTimeout(() => setPhase('done'), TOTAL_DURATION_MS);

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setPhase('fading');
		};
		window.addEventListener('keydown', onKey);

		return () => {
			window.clearTimeout(startFade);
			window.clearTimeout(finish);
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
			document.body.style.paddingRight = prevPaddingRight;
		};
	}, [phase]);

	useEffect(() => {
		if (phase !== 'fading') return;
		const finish = window.setTimeout(() => setPhase('done'), FADE_OUT_MS);
		return () => window.clearTimeout(finish);
	}, [phase]);

	if (phase === 'done') return null;

	const isFading = phase === 'fading';

	return (
		<div
			aria-hidden={isFading}
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 9999,
				background: '#050505',
				opacity: isFading ? 0 : 1,
				transition: `opacity ${FADE_OUT_MS}ms ease-out`,
				pointerEvents: isFading ? 'none' : 'auto',
				overflow: 'hidden',
			}}
		>
			<HomeHeroIntro layout='embedded' scrollProgressOverride={0} />
			<button
				type='button'
				onClick={() => setPhase('fading')}
				style={{
					position: 'absolute',
					top: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)',
					right: 'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
					padding: '0.45rem 0.95rem',
					background: 'rgba(0,0,0,0.45)',
					border: '1px solid rgba(168,240,32,0.55)',
					color: '#a8f020',
					fontFamily: 'monospace',
					fontSize: '0.78rem',
					letterSpacing: '0.22em',
					cursor: 'pointer',
					backdropFilter: 'blur(6px)',
					WebkitBackdropFilter: 'blur(6px)',
				}}
			>
				SKIP →
			</button>
		</div>
	);
};

export default HeroIntroOverlay;
