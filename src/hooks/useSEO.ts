import { useEffect } from 'react';

export function useSEO(title: string, description?: string) {
	useEffect(() => {
		document.title = title ? `${title} | TAICHI 2026` : 'TAICHI 2026 | Big Bang! Futures!';

		if (description) {
			let metaDescription = document.querySelector('meta[name="description"]');
			if (metaDescription) {
				metaDescription.setAttribute('content', description);
			} else {
				metaDescription = document.createElement('meta');
				metaDescription.setAttribute('name', 'description');
				metaDescription.setAttribute('content', description);
				document.head.appendChild(metaDescription);
			}
		}
	}, [title, description]);
}
