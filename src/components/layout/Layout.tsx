import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout: React.FC = () => {
	const { hash, pathname } = useLocation();
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (hash) {
			const element = document.getElementById(hash.replace('#', ''));
			if (element) {
				const headerOffset = pathname.startsWith('/cfp') || pathname.startsWith('/family-friendly') ? 156 : 100;
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

	// 數位通行證要求報到 QR 與投票入口同屏；站尾比一屏還高，掛上去等於保證要捲動，
	// 所以 /q 只留 Navbar（站內連結走漢堡選單）。
	// 比對前先去掉尾斜線：build 產出的是 q/index.html，GitHub Pages 會把 /q 301 到 /q/，
	// 正式站拿到的 pathname 是 '/q/'，直接比 '/q' 只有本機會過。
	const showFooter = pathname.replace(/\/+$/, '') !== '/q';

	// 100dvh 而非 100vh：手機瀏覽器的 100vh 含收合中的網址列，短頁面會多出一段
	// 捲不到東西的空白（/q 這種一屏頁最明顯）。
	return (
		<div className='site-theme ds-app-shell min-h-[100dvh] overflow-x-hidden selection:bg-[rgba(251,65,5,0.9)] selection:text-white'>
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
			{showFooter ? <Footer /> : null}
		</div>
	);
};

export default Layout;
