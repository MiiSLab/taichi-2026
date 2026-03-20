import React, { useEffect, useRef } from 'react';

const WarpBackground: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let width = 0;
		let height = 0;
		const count = 500;
		const stars: Star[] = [];
		let animationFrameId: number;

		function resize() {
			if (!canvas) return;
			// Match canvas internal resolution to its actual display dimension
			width = canvas.width = canvas.offsetWidth;
			height = canvas.height = canvas.offsetHeight;
		}

		class Star {
			x: number = 0;
			y: number = 0;
			z: number = 0;
			pz: number = 0;
			speed: number = 0;
			color: string = '';
			lineWidth: number = 0;

			constructor() {
				this.reset();
				this.z = Math.random() * width;
				this.pz = this.z;
			}

			reset() {
				this.x = (Math.random() - 0.5) * width * 2;
				this.y = (Math.random() - 0.5) * height * 2;
				this.z = width;
				this.pz = this.z;
				this.speed = Math.random() * 15 + 5;
				this.color = Math.random() > 0.7 ? '#FFB800' : '#FFFFFF';
				this.lineWidth = Math.random() * 2 + 1;
			}

			update() {
				this.pz = this.z;
				this.z -= this.speed;
				if (this.z < 1) {
					this.reset();
				}
			}

			draw() {
				if (!ctx) return;
				const perspective = width / 2;
				const sx = (this.x / this.z) * perspective + width / 2;
				const sy = (this.y / this.z) * perspective + height / 2;
				const px = (this.x / this.pz) * perspective + width / 2;
				const py = (this.y / this.pz) * perspective + height / 2;

				ctx.beginPath();
				ctx.strokeStyle = this.color;
				ctx.lineWidth = Math.max(0, (1 - this.z / width) * this.lineWidth);
				ctx.lineCap = 'round';

				ctx.moveTo(px, py);
				ctx.lineTo(sx, sy);
				ctx.stroke();
			}
		}

		// Initial setup
		resize();
		for (let i = 0; i < count; i++) {
			stars.push(new Star());
		}

		window.addEventListener('resize', resize);

		function animate() {
			if (!ctx || !canvas) return;

			// Fade out previous frame to create motion blur trails
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
			ctx.fillRect(0, 0, width, height);

			ctx.globalCompositeOperation = 'lighter';
			stars.forEach((s) => {
				s.update();
				s.draw();
			});
			ctx.globalCompositeOperation = 'source-over';

			animationFrameId = requestAnimationFrame(animate);
		}
		animate();

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className='absolute inset-0 w-full h-full object-cover pointer-events-none' style={{ display: 'block' }} />;
};

export default WarpBackground;
