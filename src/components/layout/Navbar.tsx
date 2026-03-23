import { Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTENT } from '../../content';

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleNav = () => {
		setIsMenuOpen(false);
	};

	return (
		<>
			<nav
				className='fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 px-2 py-1 flex items-center justify-between transition-all duration-300 bg-white text-lab-black shadow-lg rounded-full'
				style={{ borderRadius: '9999px' }}
			>
				{/* Left Logo */}
				<div className='flex-1 flex justify-start'>
					<Link
						to='/'
						className='text-2xl font-pixel tracking-widest uppercase cursor-pointer hover:opacity-80 px-4'
						onClick={handleNav}
					>
						{CONTENT.nav.logo}
					</Link>
				</div>

				{/* Center Links */}
				<div className='hidden xl:flex flex-1 justify-center gap-6 font-pixel text-lg items-center whitespace-nowrap'>
					<Link
						to='/'
						onClick={handleNav}
						className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.4)] ${location.pathname === '/' ? 'underline underline-offset-8' : ''}`}
					>
						{CONTENT.nav.home}
					</Link>
					<Link
						to='/venue'
						onClick={handleNav}
						className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.4)] ${location.pathname === '/venue' ? 'underline underline-offset-8' : ''}`}
					>
						{CONTENT.nav.venue}
					</Link>

					{/* CFP with hover dropdown */}
					<div className='relative group'>
						<Link
							to='/cfp'
							onClick={handleNav}
							className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.4)] ${location.pathname === '/cfp' ? 'underline underline-offset-8' : ''}`}
						>
							{CONTENT.nav.cfp}
						</Link>
						{/* Dropdown */}
						<div className='absolute top-full left-1/2 -translate-x-1/2 pt-6 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50'>
							<div className='bg-[#D9D9D9] rounded-full shadow-lg flex items-center justify-center gap-8 px-8 py-2.5 font-pixel text-sm whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out'>
								{CONTENT.nav.cfpSubmenu.map((item) => (
									<Link
										key={item.hash}
										to={`/cfp${item.hash}`}
										onClick={handleNav}
										className={`uppercase transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.4)] text-lab-black ${
											location.pathname === '/cfp' && location.hash === item.hash
												? 'underline underline-offset-8'
												: ''
										}`}
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>
					</div>

					<Link
						to='/organization'
						onClick={handleNav}
						className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.4)] ${location.pathname === '/organization' ? 'underline underline-offset-8' : ''}`}
					>
						{CONTENT.nav.organization}
					</Link>
					<span onClick={() => {}} className='opacity-50 cursor-default'>
						COMPETITION (TBD)
					</span>
				</div>

				{/* Right Registration & Menu Toggle */}
				<div className='flex-1 flex justify-end items-center'>
					<Link
						to='/venue'
						onClick={handleNav}
						className='hidden xl:block px-6 py-2 font-pixel font-bold rounded-full transition-colors bg-lab-black text-white hover:bg-lab-pink whitespace-nowrap'
					>
						{CONTENT.nav.registration}
					</Link>
					<button className='xl:hidden ml-4 p-2' onClick={() => setIsMenuOpen(!isMenuOpen)}>
						{isMenuOpen ? <X size={32} /> : <Menu size={32} />}
					</button>
				</div>
			</nav>

			{/* Mobile full-screen menu — z-[48] sits above lime overlay (z-40) but below nav (z-50) */}
			{isMenuOpen && (
				<div className='fixed inset-0 bg-lab-pink z-[48] flex flex-col items-center justify-center gap-8 text-white font-pixel text-3xl'>
					<Link
						to='/'
						onClick={handleNav}
						className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] ${location.pathname === '/' ? 'underline underline-offset-8' : ''}`}
					>
						{CONTENT.nav.home}
					</Link>
					<Link
						to='/venue'
						onClick={handleNav}
						className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] ${location.pathname === '/venue' ? 'underline underline-offset-8' : ''}`}
					>
						{CONTENT.nav.venue}
					</Link>
					<Link
						to='/cfp'
						onClick={handleNav}
						className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] ${location.pathname === '/cfp' ? 'underline underline-offset-8' : ''}`}
					>
						{CONTENT.nav.cfp}
					</Link>
					{/* CFP sub-items on mobile */}
					<div className='flex flex-col items-center gap-4 text-xl opacity-80'>
						{CONTENT.nav.cfpSubmenu.map((item) => (
							<Link
								key={item.hash}
								to={`/cfp${item.hash}`}
								onClick={handleNav}
								className={`transition-all duration-200 hover:font-bold hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] uppercase ${location.pathname === '/cfp' && location.hash === item.hash ? 'underline underline-offset-8 opacity-100' : 'hover:opacity-100'}`}
							>
								{item.label}
							</Link>
						))}
					</div>
					<span className='opacity-50 cursor-default text-2xl'>COMPETITION (TBD)</span>
				</div>
			)}
		</>
	);
};

export default Navbar;
