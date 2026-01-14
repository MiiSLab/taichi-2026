import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3000,
		host: '0.0.0.0',
	},
	base: '/taichi-2026/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '.'),
		},
	},
});
