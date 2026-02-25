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
				className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${
					isScrolled ? 'bg-lab-dark/90 backdrop-blur-md text-white shadow-md' : 'bg-transparent text-lab-dark'
				}`}
			>
				<Link to='/' className='text-2xl font-pixel tracking-widest uppercase cursor-pointer hover:opacity-80' onClick={handleNav}>
					{CONTENT.nav.logo}
				</Link>

				<div className='hidden xl:flex gap-6 font-pixel text-lg items-center'>
					<Link to='/' onClick={handleNav} className='hover:underline'>
						{CONTENT.nav.home}
					</Link>
					<Link to='/news' onClick={handleNav} className='hover:underline'>
						{CONTENT.nav.news}
					</Link>

					{/* <Link to='/agenda' onClick={handleNav} className='hover:underline'> */}
					<span onClick={() => {}} className='opacity-50 cursor-default'>
						{CONTENT.nav.program}(TBD)
					</span>
					{/* <Link to='/agenda#keynotes' onClick={handleNav} className='hover:underline'> */}
					{/* <span onClick={() => {}} className='opacity-50 cursor-default'>
						{CONTENT.nav.keynotes}(TBD)
					</span> */}
					<Link to='/cfp' onClick={handleNav} className='hover:underline'>
						{CONTENT.nav.cfp}
					</Link>
					<Link to='/venue' onClick={handleNav} className='hover:underline'>
						{CONTENT.nav.venue}
					</Link>
					<Link to='/organization' onClick={handleNav} className='hover:underline'>
						{CONTENT.nav.organization}
					</Link>
					<Link
						to='/venue'
						onClick={handleNav}
						className={`px-4 py-2 font-bold rounded-sm border transition-colors ${
							isScrolled
								? 'bg-white text-lab-dark border-white hover:bg-transparent hover:text-white'
								: 'bg-lab-dark text-white border-lab-dark hover:bg-transparent hover:text-lab-dark'
						}`}
					>
						{CONTENT.nav.registration}
					</Link>
				</div>

				<button className='xl:hidden' onClick={() => setIsMenuOpen(!isMenuOpen)}>
					{isMenuOpen ? <X size={32} /> : <Menu size={32} />}
				</button>
			</nav>

			{isMenuOpen && (
				<div className='fixed inset-0 bg-lab-orange z-40 flex flex-col items-center justify-center gap-8 text-white font-pixel text-3xl'>
					<Link to='/' onClick={handleNav}>
						{CONTENT.nav.home}
					</Link>
					<Link to='/news' onClick={handleNav}>
						{CONTENT.nav.news}
					</Link>
					<Link to='/agenda' onClick={handleNav}>
						{CONTENT.nav.program}
					</Link>
					<Link to='/agenda#keynotes' onClick={handleNav}>
						{CONTENT.nav.keynotes}
					</Link>
					<Link to='/cfp' onClick={handleNav}>
						{CONTENT.nav.cfp}
					</Link>
					<Link to='/venue' onClick={handleNav}>
						{CONTENT.nav.venue}
					</Link>
					<Link to='/organization' onClick={handleNav}>
						{CONTENT.nav.organization}
					</Link>
				</div>
			)}
		</>
	);
};

export default Navbar;
