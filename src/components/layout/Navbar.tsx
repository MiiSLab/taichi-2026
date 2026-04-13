import { Menu, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { typography } from '../../design-system/typography';
import { useContent, useLanguage } from '../../context/LanguageContext';

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

	return (
		<span className={`inline-flex items-center uppercase ${textSize} ${className}`}>
			<span className={`${bracketColor} ${bracketSize}`}>[</span>
			<span className={`px-2 ${baseColor}`}>{label}</span>
			<span className={`${bracketColor} ${bracketSize}`}>]</span>
		</span>
	);
};

const DesktopLink: React.FC<DesktopNavItem> = ({ label, to, disabled, isActive }) => {
	const content = <BracketText label={label} active={isActive} compact />;

	if (disabled || !to) {
		return <span className='cursor-default opacity-70'>{content}</span>;
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
		className={`${typography.scale.navBracketCompact} ds-nav-link transition-colors ${isActive ? 'ds-nav-link--active' : 'hover:text-white'}`}
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
	const [mobileExpandedMenu, setMobileExpandedMenu] = useState<'cfp' | 'venue' | null>(null);
	const location = useLocation();
	const content = useContent();
	const { language, setLanguage } = useLanguage();
	const isCFPPage = location.pathname.startsWith('/cfp');
	const isVenuePage = location.pathname.startsWith('/venue');
	const activeSubmenu = isCFPPage
		? content.nav.cfpSubmenu.map((item) => ({ ...item, to: `/cfp${item.hash}` }))
		: isVenuePage
			? content.venueSection.submenuItems.map((item) => ({ label: item.label, hash: `#${item.target}`, to: `/venue#${item.target}` }))
			: [];

	const submenuHashes = activeSubmenu.map((item) => item.hash);
	const scrollSpyHash = useScrollSpy(submenuHashes);

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

	const desktopItems = [
		{ label: content.nav.venue, to: '/venue', isActive: location.pathname === '/venue' },
		{ label: content.nav.cfp, to: '/cfp', isActive: location.pathname.startsWith('/cfp') },
		{ label: content.nav.organization, to: '/organization', isActive: location.pathname === '/organization' },
		{ label: 'COMPETITION', to: '/competition', isActive: location.pathname === '/competition' },
		{ label: 'VOTE', to: '/vote', isActive: location.pathname === '/vote' },
	];

	const mobileItems = [
		{ key: 'venue', label: content.nav.venue, to: '/venue', isActive: location.pathname === '/venue', submenuKey: 'venue' as const },
		{ key: 'cfp', label: content.nav.cfp, to: '/cfp', isActive: location.pathname.startsWith('/cfp'), submenuKey: 'cfp' as const },
		{ key: 'organization', label: content.nav.organization, to: '/organization', isActive: location.pathname === '/organization' },
		{ key: 'competition', label: 'COMPETITION', to: '/competition', isActive: location.pathname === '/competition' },
		{ key: 'vote', label: 'VOTE', to: '/vote', isActive: location.pathname === '/vote' },
	];

	const submenuByKey = {
		cfp: content.nav.cfpSubmenu.map((item) => ({ ...item, to: `/cfp${item.hash}` })),
		venue: content.venueSection.submenuItems.map((item) => ({
			label: item.label,
			hash: `#${item.target}`,
			to: `/venue#${item.target}`,
		})),
	} as const;

	return (
		<>
			<nav
				className={`ds-nav-shell fixed left-0 right-0 top-0 z-50 border-b border-solid border-white/10 px-4 pt-4 pb-px transition-all duration-300 md:px-[59px] ${isScrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.35)]' : ''}`}
			>
				<div className='flex min-h-[45px] items-center justify-between gap-6'>
					<Link to='/' className='shrink-0 transition-opacity hover:opacity-85' onClick={() => { handleNav(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
						<BracketText label={content.nav.logo} active className='whitespace-nowrap' />
					</Link>

					<div className='hidden xl:flex items-center gap-6 whitespace-nowrap'>
						{desktopItems.map((item) => (
							<DesktopLink key={item.label} {...item} />
						))}
					</div>

					<div className='hidden xl:flex h-[45px] items-center gap-4'>
						<div className='ds-nav-segmented'>
							<button
								type='button'
								onClick={() => setLanguage('zh')}
								className={`ds-nav-segment min-w-[2.75rem] font-pixel text-[14px] leading-6 ${language === 'zh' ? 'ds-nav-segment--active' : ''}`}
							>
								中
							</button>
							<button
								type='button'
								onClick={() => setLanguage('en')}
								className={`ds-nav-segment min-w-[3rem] font-pixel text-[16px] leading-6 ${language === 'en' ? 'ds-nav-segment--active' : ''}`}
							>
								EN
							</button>
						</div>

						<button
							type='button'
							className={`ds-nav-pill ds-nav-link flex h-[25px] items-center px-[17px] ${typography.scale.navBracketCompact} transition-opacity hover:opacity-90`}
						>
							<BracketText label={content.nav.registration} compact />
						</button>
					</div>

					<button
						className='xl:hidden rounded-md p-2 text-white transition-colors hover:bg-white/5'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label='Toggle menu'
						aria-expanded={isMenuOpen}
					>
						{isMenuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>

				{activeSubmenu.length > 0 ? (
					<div className='ds-nav-submenu hidden xl:flex justify-center pt-4 pb-3'>
						<div className={`inline-flex items-center whitespace-nowrap ${typography.scale.navBracketCompact}`}>
							<span className='w-[7px] text-white/40'>[</span>
							<div className='flex items-center justify-center gap-12 px-3'>
								{activeSubmenu.map((item) => (
									<DesktopSubmenuLink
										key={item.hash}
										label={item.label}
										to={item.to}
										isActive={scrollSpyHash === item.hash}
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
							<div className='flex min-w-max items-center justify-center gap-4'>
								{activeSubmenu.map((item) => (
									<MobilePinnedSubmenuLink
										key={item.hash}
										label={item.label}
										to={item.to}
										isActive={scrollSpyHash === item.hash}
									/>
								))}
							</div>
						</div>
					</div>
				) : null}
			</nav>

			{isMenuOpen && (
				<div className='ds-nav-drawer fixed inset-0 z-[48] overflow-y-auto px-5 pb-8 pt-24 text-white'>
					<div className='mx-auto flex w-full max-w-[28rem] flex-col items-stretch gap-5 font-pixel'>
						{mobileItems.map((item) => {
							if (item.disabled || !item.to) {
								return (
									<span key={item.key} className='border-b border-white/10 pb-4 text-center text-2xl opacity-60'>
										{item.label}
									</span>
								);
							}

							if (item.submenuKey) {
								const isExpanded = mobileExpandedMenu === item.submenuKey;
								const submenuItems = submenuByKey[item.submenuKey];

								return (
									<div key={item.key} className='flex w-full flex-col items-stretch border-b border-white/10 pb-4'>
										<button
											type='button'
											onClick={() => setMobileExpandedMenu(isExpanded ? null : item.submenuKey)}
											className={`flex w-full items-center justify-between gap-4 text-left text-2xl ${item.isActive || isExpanded ? 'ds-nav-link ds-nav-link--active' : 'ds-nav-link'}`}
										>
											<span>{item.label}</span>
											<span className='text-lg'>{isExpanded ? '−' : '+'}</span>
										</button>
										{isExpanded ? (
											<div className='mt-4 flex w-full flex-col gap-3 border-l border-lab-lime/60 pl-4 text-lg'>
												{submenuItems.map((submenuItem) => (
													<Link
														key={submenuItem.hash}
														to={submenuItem.to}
														onClick={handleNav}
														className={`ds-nav-link ${scrollSpyHash === submenuItem.hash ? 'ds-nav-link--active' : ''}`}
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
						<div className='ds-nav-segmented mt-2 w-full'>
							<button type='button' onClick={() => setLanguage('zh')} className={`ds-nav-segment flex-1 py-3 text-lg ${language === 'zh' ? 'ds-nav-segment--active' : ''}`}>
								中
							</button>
							<button type='button' onClick={() => setLanguage('en')} className={`ds-nav-segment flex-1 py-3 text-lg ${language === 'en' ? 'ds-nav-segment--active' : ''}`}>
								EN
							</button>
						</div>
						<button type='button' className='ds-nav-pill ds-nav-link mt-2 w-full px-5 py-3 text-xl transition-colors hover:text-white'>
							{content.nav.registration}
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Navbar;
