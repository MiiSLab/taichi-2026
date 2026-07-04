import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeroIntroOverlay from '../HeroIntroOverlay';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout: React.FC = () => {
	const { hash, pathname } = useLocation();
	const prefersReducedMotion = useReducedMotion();

	// Palette preview: enabled by visiting /preview (which flips localStorage and
	// fires this event). Adds .palette-preview on the shell so the whole site
	// renders with the candidate brand colours; off by default for the real site.
	const [palettePreview, setPalettePreview] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('palettePreview') === '1');
	// Re-read the flag on every route change. Entering /preview sets the flag then
	// redirects, so reading it here applies reliably without depending on event /
	// effect ordering (which caused the "enter twice" bug).
	useEffect(() => {
		setPalettePreview(window.localStorage.getItem('palettePreview') === '1');
	}, [pathname]);
	// Once the .palette-preview class is committed to the DOM, notify the 3D views
	// (ConstellationMap reads the CSS brand tokens at runtime) to re-sync.
	useEffect(() => {
		window.dispatchEvent(new Event('palette-preview-changed'));
	}, [palettePreview]);
	const disablePalettePreview = () => {
		window.localStorage.setItem('palettePreview', '0');
		setPalettePreview(false);
	};

	useEffect(() => {
		if (hash) {
			const element = document.getElementById(hash.replace('#', ''));
			if (element) {
				const headerOffset = pathname.startsWith('/cfp') ? 156 : 100;
				const elementPosition = element.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth',
				});
			}
		} else {
			window.scrollTo(0, 0);
		}
	}, [pathname, hash]);

	const transitionDuration = prefersReducedMotion ? 0 : 0.22;

	return (
		<div className={`site-theme ds-app-shell min-h-screen overflow-x-hidden selection:bg-[rgba(243,100,88,0.9)] selection:text-white ${palettePreview ? 'palette-preview' : ''}`}>
			{palettePreview && (
				<button
					type='button'
					onClick={disablePalettePreview}
					className='fixed bottom-4 right-4 z-[100] rounded-full border border-primary/60 bg-black/85 px-4 py-2 font-mono text-xs tracking-wide text-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur transition-colors hover:bg-black'
				>
					🎨 配色預覽中 · 點此關閉
				</button>
			)}
			{/* Skip the entry intro while previewing candidate colours — it otherwise
			    replays on every hard reload (module flag resets on F5) and gets in the
			    way of checking the palette. palettePreview is seeded synchronously from
			    localStorage, so a reload-in-preview never flashes the intro. */}
			{!palettePreview && <HeroIntroOverlay />}
			<Navbar />
			<main>
				<AnimatePresence mode='wait' initial={false}>
					<motion.div
						key={pathname}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: transitionDuration, ease: 'easeOut' }}
					>
						<Outlet />
					</motion.div>
				</AnimatePresence>
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
