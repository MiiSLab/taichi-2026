import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import viteCompression from 'vite-plugin-compression';

// Note: image compression is done up-front via sharp-cli (AVIFs already in /public/images),
// so ViteImageOptimizer is intentionally NOT enabled — it would pull in sharp at build time
// and slow down GitHub Actions for no benefit (assets are pre-optimized).

// SPA routes that need a physical <route>/index.html so GitHub Pages serves
// HTTP 200 (instead of 404.html) when the URL is requested directly. Without
// these copies, search engines and link previews see a 404 status even though
// the SPA would render the correct page in a browser.
const SPA_ROUTES = ['newhome', 'preview', 'news', 'agenda', 'cfp', 'family-friendly', 'venue', 'organization', 'sponsorship', 'vote', 'poster-upload'];

const spaRoutesPlugin = (): Plugin => ({
	name: 'spa-routes-html',
	apply: 'build',
	closeBundle() {
		const distDir = path.resolve(__dirname, 'dist');
		const indexPath = path.join(distDir, 'index.html');
		if (!fs.existsSync(indexPath)) return;
		const indexHtml = fs.readFileSync(indexPath, 'utf-8');
		for (const route of SPA_ROUTES) {
			const dir = path.join(distDir, route);
			fs.mkdirSync(dir, { recursive: true });
			fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
		}
	},
});

export default defineConfig({
	server: {
		port: 3080,
		host: '0.0.0.0',
	},
	// Use environment variable to set base path
	// For custom domain: BASE_PATH=/ npm run build
	// For GitHub Pages subdirectory: BASE_PATH=/ npm run build (default)
	base: process.env.BASE_PATH || '/',
	plugins: [
		react(),
		spaRoutesPlugin(),
		viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
		viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '.'),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					three: ['three'],
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],
					motion: ['motion'],
				},
			},
		},
	},
});
