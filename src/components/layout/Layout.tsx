import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout: React.FC = () => {
	const { hash, pathname } = useLocation();

	useEffect(() => {
		if (hash) {
			const element = document.getElementById(hash.replace('#', ''));
			if (element) {
				const headerOffset = 100;
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

	return (
		<div className='min-h-screen bg-lab-white text-lab-dark font-sans selection:bg-lab-orange selection:text-white overflow-x-hidden'>
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
