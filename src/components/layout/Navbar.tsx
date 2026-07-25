import { Menu, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent, useLanguage } from '../../context/LanguageContext';
import { typography } from '../../design-system/typography';

/* ── Scroll-spy hook ──────────────────────────────────────────── */
function useScrollSpy(hashes: string[]) {
	const [activeHash, setActiveHash] = useState('');
	const rafRef = useRef(0);

	const update = useCallback(() => {
		if (hashes.length === 0) return;
		const offset = 160; // navbar height buffer
		let best = '';
		let bestTop = -Infinity;
		for (const hash of hashes) {
			const id = hash.replace('#', '');
			const el = document.getElementById(id);
			if (!el) continue;
			const rect = el.getBoundingClientRect();
			// pick the section whose top is closest to (but above) the offset line
			if (rect.top <= offset && rect.top > bestTop) {
				bestTop = rect.top;
				best = hash;
			}
		}
		setActiveHash(best);
	}, [hashes]);

	useEffect(() => {
		if (hashes.length === 0) { setActiveHash(''); return; }
		const onScroll = () => {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(update);
		};
		onScroll(); // initial
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			cancelAnimationFrame(rafRef.current);
		};
	}, [hashes, update]);

	return activeHash;
}

type DesktopNavItem = {
	label: string;
	to?: string;
	disabled?: boolean;
	isActive?: boolean;
};

type MobileNavItem = {
	key: string;
	label: string;
	to?: string;
	disabled?: boolean;
	isActive?: boolean;
	submenuKey?: 'cfp' | 'venue' | 'orgSponsors';
};

const BracketText: React.FC<{
	label: string;
	active?: boolean;
	compact?: boolean;
	className?: string;
}> = ({ label, active = false, compact = false, className = '' }) => {
	const baseColor = active ? 'ds-nav-link ds-nav-link--active' : 'ds-nav-link';
	const bracketColor = active ? 'text-white/40' : 'text-transparent';
	const textSize = compact ? typography.scale.navBracketCompact : typography.scale.navBracket;
	const bracketSize = compact ? 'w-[7px]' : 'w-[10px]';
	const labelPad = compact ? 'px-1.5 2xl:px-2' : 'px-2';

	return (
		<span className={`inline-flex items-center uppercase ${textSize} ${className}`}>
			<span className={`${bracketColor} ${bracketSize}`}>[</span>
			<span className={`${labelPad} ${baseColor} font-['Source_Code_Pro',monospace]`}>{label}</span>
			<span className={`${bracketColor} ${bracketSize}`}>]</span>
		</span>
	);
};

const DesktopLink: React.FC<DesktopNavItem> = ({ label, to, disabled, isActive }) => {
	const content = <BracketText label={label} active={isActive} compact />;

	if (disabled || !to) {
		return <span className='cursor-not-allowed opacity-40'>{content}</span>;
	}

	return (
		<Link to={to} className='transition-opacity hover:opacity-90'>
			{content}
		</Link>
	);
};

const DesktopSubmenuLink: React.FC<{
	label: string;
	to: string;
	isActive?: boolean;
}> = ({ label, to, isActive }) => (
	<Link
		to={to}
		className={`${typography.scale.navBracketCompact} font-['Source_Code_Pro',monospace] ds-nav-link transition-colors ${isActive ? 'ds-nav-link--active' : 'hover:text-white'}`}
	>
		{label}
	</Link>
);

const getMobileSubmenuLabel = (label: string) => {
	return label === 'Important Date' ? 'Date' : label;
};

const MobilePinnedSubmenuLink: React.FC<{
	label: string;
	to: string;
	isActive?: boolean;
}> = ({ label, to, isActive }) => (
	<Link
		to={to}
		className={`shrink-0 whitespace-nowrap border-b px-1 pb-2 ${typography.scale.navPinned} ds-nav-link transition-colors ${
			isActive ? 'border-lab-lime ds-nav-link--active' : 'border-transparent hover:text-white'
		}`}
	>
		{getMobileSubmenuLabel(label)}
	</Link>
);

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileExpandedMenu, setMobileExpandedMenu] = useState<'cfp' | 'venue' | 'orgSponsors' | null>(null);
	const location = useLocation();
	const content = useContent();
	const { language, setLanguage } = useLanguage();
	const isCFPPage = location.pathname.startsWith('/cfp');
	const isVenuePage = location.pathname.startsWith('/venue');
	const isProgramPage = location.pathname === '/program';
	const isOrgSponsorsPage = location.pathname === '/organization' || location.pathname === '/sponsorship';
	// Submenu items are either same-page anchors (cfp / venue, carry a `hash`),
	// cross-page links (organization & sponsors, carry only `to`), or day tabs
	// (program — hash drives the page's active tab, no scroll target).
	const activeSubmenu: { label: string; to: string; hash?: string }[] = isCFPPage
		? content.nav.cfpSubmenu.map((item) => ({ label: item.label, hash: item.hash, to: `/cfp${item.hash}` }))
		: isVenuePage
			? content.venueV2Section.days.map((day, index) => ({ label: day.tabLabel, hash: `#day${index + 1}`, to: `/venue#day${index + 1}` }))
			: isProgramPage
				? content.programPageSection.dateTabs.map((tab) => ({ label: `${tab.date} ${tab.day}`, hash: `#${tab.key}`, to: `/program#${tab.key}` }))
				: isOrgSponsorsPage
					? [
							{ label: 'Organization', to: '/organization' },
							{ label: 'Sponsors', to: '/sponsorship' },
						]
					: [];

	const submenuHashes = activeSubmenu.map((item) => item.hash).filter((h): h is string => Boolean(h));
	const scrollSpyHash = useScrollSpy(isProgramPage || isVenuePage ? [] : submenuHashes);
	// Active by scroll-spy hash (same-page anchors), by pathname (cross-page links),
	// or by the raw hash (program day tabs — no hash defaults to day1).
	const isSubmenuActive = (item: { hash?: string; to: string }) => {
		if (isProgramPage || isVenuePage) return (location.hash || '#day1') === item.hash;
		return item.hash ? scrollSpyHash === item.hash : location.pathname === item.to;
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleNav = () => {
		setIsMenuOpen(false);
		setMobileExpandedMenu(null);
	};

	const desktopItems: DesktopNavItem[] = [
		{ label: content.nav.news, to: '/news', isActive: location.pathname === '/news' },
		{ label: content.nav.program, to: '/program', isActive: location.pathname === '/program' },
		{ label: content.nav.venue, to: '/venue', isActive: location.pathname === '/venue' },
		{ label: content.nav.cfp, to: '/cfp', isActive: location.pathname.startsWith('/cfp') },
		{ label: content.nav.familyFriendly, to: '/family-friendly', isActive: location.pathname === '/family-friendly' },
		{ label: content.nav.orgSponsors, to: '/organization', isActive: isOrgSponsorsPage },
	];

	const mobileItems: MobileNavItem[] = [
		{ key: 'news', label: content.nav.news, to: '/news', isActive: location.pathname === '/news' },
		{ key: 'program', label: content.nav.program, to: '/program', isActive: location.pathname === '/program' },
		{ key: 'venue', label: content.nav.venue, to: '/venue', isActive: location.pathname === '/venue', submenuKey: 'venue' },
		{ key: 'cfp', label: content.nav.cfp, to: '/cfp', isActive: location.pathname.startsWith('/cfp'), submenuKey: 'cfp' },
		{ key: 'family-friendly', label: content.nav.familyFriendly, to: '/family-friendly', isActive: location.pathname === '/family-friendly' },
		{ key: 'orgSponsors', label: content.nav.orgSponsors, to: '/organization', isActive: isOrgSponsorsPage, submenuKey: 'orgSponsors' },
	];

	const submenuByKey: Record<'cfp' | 'venue' | 'orgSponsors', { label: string; to: string; hash?: string }[]> = {
		cfp: content.nav.cfpSubmenu.map((item) => ({ label: item.label, hash: item.hash, to: `/cfp${item.hash}` })),
		venue: content.venueV2Section.days.map((day, index) => ({ label: day.tabLabel, hash: `#day${index + 1}`, to: `/venue#day${index + 1}` })),
		orgSponsors: [
			{ label: 'Organization', to: '/organization' },
			{ label: 'Sponsors', to: '/sponsorship' },
		],
	};

	return (
		<>
			{/* 1280–1536 (xl–2xl) 桌機橫排放不下原始間距，此區間縮小 padding/gap/字級（見 typography navBracket*），2xl 恢復 */}
			<nav
				className={`ds-nav-shell fixed left-0 right-0 top-0 z-50 border-b border-solid border-white/10 px-4 pt-4 pb-px transition-all duration-300 md:px-[59px] xl:px-8 2xl:px-[59px] ${isScrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.35)]' : ''}`}
			>
				<div className='flex min-h-[45px] items-center justify-between gap-6'>
					<Link to='/' className='transition-opacity shrink-0 hover:opacity-85' onClick={() => { handleNav(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
						{/* Logo: Press Start 2P (font-arcade), orange, no brackets — visual-chair design. Small px because the arcade face is wide. */}
							<span className="font-['Press_Start_2P',_'VT323',monospace] text-primary whitespace-nowrap uppercase leading-none text-[13px] xl:text-[12px] 2xl:text-[14px]">{content.nav.logo}</span>
					</Link>

					<div className='hidden xl:flex items-center gap-2.5 whitespace-nowrap 2xl:gap-6'>
						{desktopItems.map((item) => (
							<DesktopLink key={item.label} {...item} />
						))}
					</div>

					<div className='hidden xl:flex h-[45px] items-center gap-3 2xl:gap-4'>
						{/* h-[25px] matches the registration pill so the two boxes line up;
						    the buttons fill that height (h-full + leading-none) instead of
						    the leading-6 line-box pushing the container taller. */}
						<div className='ds-nav-segmented h-[30px]'>
							<button
								type='button'
								onClick={() => setLanguage('zh')}
								className={`ds-nav-segment h-full min-w-[2.75rem] font-pixel text-[14px] leading-none ${language === 'zh' ? 'ds-nav-segment--active' : ''}`}
							>
								中
							</button>
							<button
								type='button'
								onClick={() => setLanguage('en')}
								className={`ds-nav-segment h-full min-w-[3rem] font-['Source_Code_Pro',monospace] text-[16px] leading-none ${language === 'en' ? 'ds-nav-segment--active' : ''}`}
							>
								EN
							</button>
						</div>

						<Link
							to='/registration'
							className={`ds-nav-pill ds-nav-link flex h-[30px] items-center px-2.5 2xl:px-[17px] ${typography.scale.navBracketCompact} transition-opacity hover:opacity-90`}
						>
							<BracketText label={content.nav.registration} compact />
						</Link>
					</div>

					<button
						className='p-2 text-white transition-colors rounded-md xl:hidden hover:bg-white/5'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label='Toggle menu'
						aria-expanded={isMenuOpen}
					>
						{isMenuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>

				{activeSubmenu.length > 0 ? (
					<div className='justify-center hidden pt-4 pb-3 ds-nav-submenu xl:flex'>
						<div className={`inline-flex items-center whitespace-nowrap ${typography.scale.navBracketCompact}`}>
							<span className='w-[7px] text-white/40'>[</span>
							<div className='flex items-center justify-center gap-12 px-3'>
								{activeSubmenu.map((item) => (
									<DesktopSubmenuLink
										key={item.to}
										label={item.label}
										to={item.to}
										isActive={isSubmenuActive(item)}
									/>
								))}
							</div>
							<span className='w-[7px] text-white/40'>]</span>
						</div>
					</div>
				) : null}

				{activeSubmenu.length > 0 && !isMenuOpen ? (
					<div className='xl:hidden ds-nav-submenu'>
						<div className='overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
							<div className='flex items-center justify-center gap-4 min-w-max'>
								{activeSubmenu.map((item) => (
									<MobilePinnedSubmenuLink
										key={item.to}
										label={item.label}
										to={item.to}
										isActive={isSubmenuActive(item)}
									/>
								))}
							</div>
						</div>
					</div>
				) : null}
			</nav>

			{isMenuOpen && (
				<div className='ds-nav-drawer fixed inset-0 z-[48] overflow-y-auto px-5 pb-8 pt-24 text-white'>
					<div className="mx-auto flex w-full max-w-[28rem] flex-col items-stretch gap-5 font-['Source_Code_Pro',monospace]">
						{mobileItems.map((item) => {
							if (item.disabled || !item.to) {
								return (
									<span key={item.key} className='pb-4 text-2xl text-center border-b cursor-not-allowed border-white/10 opacity-40'>
										{item.label}
									</span>
								);
							}

							if (item.submenuKey) {
								const isExpanded = mobileExpandedMenu === item.submenuKey;
								const submenuItems = submenuByKey[item.submenuKey];

								return (
									<div key={item.key} className='flex flex-col items-stretch w-full pb-4 border-b border-white/10'>
										<button
											type='button'
											onClick={() => setMobileExpandedMenu(isExpanded ? null : item.submenuKey)}
											className={`flex w-full items-center justify-between gap-4 text-left text-2xl ${item.isActive || isExpanded ? 'ds-nav-link ds-nav-link--active' : 'ds-nav-link'}`}
										>
											<span>{item.label}</span>
											<span className='text-lg'>{isExpanded ? '−' : '+'}</span>
										</button>
										{isExpanded ? (
											<div className='flex flex-col w-full gap-3 pl-4 mt-4 text-lg border-l border-lab-lime/60'>
												{submenuItems.map((submenuItem) => (
													<Link
														key={submenuItem.to}
														to={submenuItem.to}
														onClick={handleNav}
														className={`ds-nav-link ${isSubmenuActive(submenuItem) ? 'ds-nav-link--active' : ''}`}
													>
														{getMobileSubmenuLabel(submenuItem.label)}
													</Link>
												))}
											</div>
										) : null}
									</div>
								);
							}

							return (
								<Link
									key={item.key}
									to={item.to}
									onClick={handleNav}
									className={`ds-nav-link border-b border-white/10 pb-4 text-2xl ${item.isActive ? 'ds-nav-link--active' : ''}`}
								>
									{item.label}
								</Link>
							);
						})}
						<div className='w-full mt-2 ds-nav-segmented'>
							<button type='button' onClick={() => setLanguage('zh')} className={`ds-nav-segment flex-1 py-3 text-lg font-pixel ${language === 'zh' ? 'ds-nav-segment--active' : ''}`}>
								中
							</button>
							<button type='button' onClick={() => setLanguage('en')} className={`ds-nav-segment flex-1 py-3 text-lg ${language === 'en' ? 'ds-nav-segment--active' : ''}`}>
								EN
							</button>
						</div>
						<Link
							to='/registration'
							onClick={handleNav}
							className='w-full px-5 py-3 mt-2 text-xl transition-colors ds-nav-pill ds-nav-link hover:text-white'
						>
							{content.nav.registration}
						</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default Navbar;
