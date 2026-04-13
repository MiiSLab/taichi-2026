import React, { useEffect, useRef, useState } from 'react';

type ScrollRevealProps = {
	children: React.ReactNode;
	className?: string;
	delay?: number;
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', delay = 0 }) => {
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const node = elementRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.18,
				rootMargin: '0px 0px -8% 0px',
			},
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={elementRef}
			className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
};

export default ScrollReveal;
