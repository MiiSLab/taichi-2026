import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3080,
		host: '0.0.0.0',
	},
	// Use environment variable to set base path
	// For custom domain: BASE_PATH=/ npm run build
	// For GitHub Pages subdirectory: BASE_PATH=/ npm run build (default)
	base: process.env.BASE_PATH || '/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '.'),
		},
	},
});
