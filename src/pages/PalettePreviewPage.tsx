import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * /preview — flips on the site-wide palette preview (candidate brand colours
 * defined in .palette-preview in styles.css), then sends you to the new arcade
 * hero (/newhome-v2-boom) so you can browse every page recoloured. Layout re-reads
 * the flag on route change and applies the .palette-preview class; a floating
 * "關閉" button turns it back off. The real site default is untouched.
 */
const PalettePreviewPage: React.FC = () => {
	const navigate = useNavigate();
	useEffect(() => {
		window.localStorage.setItem('palettePreview', '1');
		navigate('/newhome-v2-boom', { replace: true });
	}, [navigate]);

	return <div style={{ minHeight: '60vh' }} />;
};

export default PalettePreviewPage;
