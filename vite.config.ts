import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

// Note: image compression is done up-front via sharp-cli (AVIFs already in /public/images),
// so ViteImageOptimizer is intentionally NOT enabled — it would pull in sharp at build time
// and slow down GitHub Actions for no benefit (assets are pre-optimized).

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
