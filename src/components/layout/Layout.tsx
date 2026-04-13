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

	return (
		<div className='site-theme ds-app-shell min-h-screen overflow-x-hidden selection:bg-[rgba(243,100,88,0.9)] selection:text-white'>
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
