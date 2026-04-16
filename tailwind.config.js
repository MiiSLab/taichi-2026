/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	// Preflight kept ON to mirror the previous CDN behaviour (the whole codebase
	// was authored assuming preflight resets — disabling it would change visuals).
	theme: {
		extend: {
			colors: {
				'lab-orange': '#FE5945',
				'lab-white': '#F0F0F0',
				'lab-dark': '#222222',
				'lab-lime': '#a8f020',
				'lab-pink': '#ff0033',
				'lab-black': '#050505',
			},
			boxShadow: {
				'pili-glow': '0 0 10px rgba(255, 192, 0, 0.7), 0 0 20px rgba(255, 192, 0, 0.5)',
			},
			fontFamily: {
				sans: ['"IBM Plex Sans"', '"Noto Sans TC"', 'sans-serif'],
				mono: ['"Reddit Mono"', '"Roboto Mono"', 'monospace'],
				pixel: ['"VT323"', 'monospace'],
				reddit: ['"Reddit Mono"', 'monospace'],
				roboto: ['"IBM Plex Sans"', '"Noto Sans TC"', 'sans-serif'],
				dot: ['"DotGothic16"', 'sans-serif'],
				dela: ['"Dela Gothic One"', '"DotGothic16"', 'sans-serif'],
			},
			animation: {
				'spin-slow': 'spin 10s linear infinite',
				float: 'float 6s ease-in-out infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				},
			},
		},
	},
	plugins: [],
};
