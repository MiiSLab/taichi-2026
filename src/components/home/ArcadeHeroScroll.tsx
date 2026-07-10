import React, { useEffect, useRef, useState } from 'react';

/**
 * Hero-to-content transition for the arcade hero. Used only by the
 * /lab/arcade-hero-scroll experiment page (see HeroLabPage.tsx) — the live
 * homepage stays on the plain layout (see HomePage.tsx).
 *
 * Two full-height sections, paged with native CSS scroll-snap: a small
 * scroll nudge is enough for the browser to commit to the next section on
 * its own, no JS drives the scroll. The circle-collapse wipe is a plain CSS
 * clip-path transition with a fixed duration — not scrubbed frame-by-frame
 * against scroll position — switched on by a single boolean once the content
 * section starts coming into view (same IntersectionObserver pattern already
 * used by ScrollReveal/WarpBackground elsewhere in this codebase).
 *
 * Earlier versions scrubbed the wipe 1:1 with scroll position (a
 * requestAnimationFrame loop reading window.scrollY every frame) and, before
 * that, also auto-completed the scroll itself via window.scrollTo(). Both
 * fought the browser's own scroll handling and could get stuck. Letting the
 * browser own the paging and the wipe be a fire-once transition removes that
 * whole class of bug — there's no scroll position math left to get wrong.
 */

const COLLAPSE_MS = 700;

type Props = {
	/** Hero rendered inside the collapsing circle (first snap target). */
	hero: React.ReactNode;
	/** Rendered immediately after the hero, as the second snap target. */
	content: React.ReactNode;
};

const ArcadeHeroScroll: React.FC<Props> = ({ hero, content }) => {
	const contentSectionRef = useRef<HTMLDivElement>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [heroMounted, setHeroMounted] = useState(true);

	useEffect(() => {
		// Scoped to this page only: on while mounted, restored on unmount so it
		// never leaks into other routes.
		const root = document.documentElement;
		const previous = root.style.scrollSnapType;
		root.style.scrollSnapType = 'y mandatory';
		return () => {
			root.style.scrollSnapType = previous;
		};
	}, []);

	useEffect(() => {
		const contentSection = contentSectionRef.current;
		if (!contentSection) return;
		const observer = new IntersectionObserver(([entry]) => setCollapsed(entry.isIntersecting), { threshold: 0.15 });
		observer.observe(contentSection);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		// Unmount the (interactive, animated) hero only after its own fade-out
		// finishes, so scrolling back up before then just re-shows it as-is.
		if (!collapsed) {
			setHeroMounted(true);
			return;
		}
		const timeout = window.setTimeout(() => setHeroMounted(false), COLLAPSE_MS);
		return () => window.clearTimeout(timeout);
	}, [collapsed]);

	return (
		<>
			<div style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>
				{heroMounted && (
					<div
						style={{
							position: 'fixed',
							inset: 0,
							zIndex: 40,
							background: '#0d0e12',
							overflow: 'hidden',
							clipPath: collapsed ? 'circle(0% at 50% 50%)' : 'circle(100% at 50% 50%)',
							transition: `clip-path ${COLLAPSE_MS}ms cubic-bezier(0.6, 0, 0.4, 1)`,
							pointerEvents: collapsed ? 'none' : 'auto',
						}}
					>
						<div style={{ width: '100%', height: '100%', opacity: collapsed ? 0 : 1, transition: 'opacity 450ms ease-out' }}>{hero}</div>
					</div>
				)}
			</div>
			<div ref={contentSectionRef} style={{ scrollSnapAlign: 'start' }}>
				{content}
			</div>
		</>
	);
};

export default ArcadeHeroScroll;
