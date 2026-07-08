import React, { useEffect, useRef, useState } from 'react';
import type * as THREE_NS from 'three';
import { degradeTier, detectPerformanceTier, type PerformanceTier } from '../../utils/performanceTier';

const HOLOGRAM_COLOR = '#29b93a';
const LONG_TASK_THRESHOLD_MS = 150;
const LONG_TASK_BUDGET = 4;
const LONG_TASK_OBSERVE_WINDOW_MS = 5000;
const backgroundTextureUrls = [
	'/images/background 1.avif',
	'/images/background 2.avif',
	'/images/background 3.avif',
	'/images/background 4.avif',
];
const LITE_FALLBACK_SRC = backgroundTextureUrls[0];

type SceneConfig = {
	textureCount: number;
	blockCount: number;
	linesCount: number;
	pixelRatio: number;
	useSimpleShader: boolean;
	antialias: boolean;
};

const SCENE_CONFIGS: Record<Exclude<PerformanceTier, 'lite'>, SceneConfig> = {
	full: {
		textureCount: 4,
		blockCount: 20,
		linesCount: 60,
		pixelRatio: 2,
		useSimpleShader: false,
		antialias: true,
	},
	medium: {
		textureCount: 2,
		blockCount: 8,
		linesCount: 24,
		pixelRatio: 1.5,
		useSimpleShader: true,
		antialias: false,
	},
};

const vertexShader = `
	varying vec2 vUv;
	uniform float uTime;

	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

// Full-fat shader: glitch displacement, scanlines, fine pixel grid, flicker.
const fragmentShaderFull = `
	varying vec2 vUv;
	uniform float uTime;
	uniform sampler2D uTexture;
	uniform vec3 uColor;
	uniform float uGlitchIntensity;
	uniform float uOpacity;

	float random(vec2 st) {
		return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
	}

	void main() {
		vec2 uv = vUv;
		float timeStep = floor(uTime * 15.0);
		float blockY = floor(uv.y * 10.0);
		float glitch = step(0.95, random(vec2(timeStep, blockY))) * uGlitchIntensity;
		uv.x += glitch * (random(vec2(timeStep)) - 0.5) * 0.2;

		vec4 texColor = texture2D(uTexture, uv);
		float scanline = sin(uv.y * 800.0 + uTime * 20.0) * 0.15 + 0.85;
		vec2 grid = fract(uv * 120.0);
		float pixel = step(0.05, grid.x) * step(0.05, grid.y);

		vec3 finalColor = (texColor.rgb * 0.8 + 0.2) * uColor;
		float edge = 1.0 - (abs(uv.x - 0.5) * 2.0);
		edge *= 1.0 - (abs(uv.y - 0.5) * 2.0);
		edge = pow(edge, 0.5);

		float alpha = (texColor.a * 0.8 + 0.2) * (scanline * 0.7 + 0.3) * edge * pixel * uOpacity;
		float flicker = random(vec2(floor(uTime * 20.0), 4.0)) > 0.02 ? 1.0 : 0.3;

		gl_FragColor = vec4(finalColor, alpha * flicker);
	}
`;

// Lite shader (for medium tier): drop the per-pixel grid mask, drop per-fragment
// flicker random, halve scanline frequency. Saves the most expensive pixel-fill ops.
const fragmentShaderSimple = `
	varying vec2 vUv;
	uniform float uTime;
	uniform sampler2D uTexture;
	uniform vec3 uColor;
	uniform float uOpacity;

	void main() {
		vec2 uv = vUv;
		vec4 texColor = texture2D(uTexture, uv);
		float scanline = sin(uv.y * 400.0 + uTime * 12.0) * 0.15 + 0.85;
		vec3 finalColor = (texColor.rgb * 0.8 + 0.2) * uColor;
		float edge = 1.0 - (abs(uv.x - 0.5) * 2.0);
		edge *= 1.0 - (abs(uv.y - 0.5) * 2.0);
		edge = pow(edge, 0.5);
		float alpha = (texColor.a * 0.8 + 0.2) * (scanline * 0.7 + 0.3) * edge * uOpacity;
		gl_FragColor = vec4(finalColor, alpha);
	}
`;

type HeroHologramBackgroundProps = {
	openProgress?: number;
	scrollProgress?: number;
	reducedMotion?: boolean;
};

const HeroHologramBackground: React.FC<HeroHologramBackgroundProps> = ({
	openProgress = 1,
	scrollProgress = 0,
	reducedMotion = false,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const openProgressRef = useRef(openProgress);
	const scrollProgressRef = useRef(scrollProgress);
	const [tier] = useState<PerformanceTier>(detectPerformanceTier);

	useEffect(() => {
		openProgressRef.current = openProgress;
	}, [openProgress]);

	useEffect(() => {
		scrollProgressRef.current = scrollProgress;
	}, [scrollProgress]);

	useEffect(() => {
		if (tier === 'lite') return;
		const container = containerRef.current;
		if (!container) return;

		const config = SCENE_CONFIGS[tier];
		const fragmentShader = config.useSimpleShader ? fragmentShaderSimple : fragmentShaderFull;
		const textureUrls = backgroundTextureUrls.slice(0, config.textureCount);

		let cancelled = false;
		let cleanup: (() => void) | null = null;

		const init = async () => {
			const THREE = (await import('three')) as typeof THREE_NS;
			if (cancelled || !containerRef.current) return;

			let width = container.clientWidth || window.innerWidth;
			let height = container.clientHeight || window.innerHeight;
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0x000000);

			const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
			camera.position.z = 8;

			const renderer = new THREE.WebGLRenderer({
				antialias: config.antialias,
				alpha: true,
				powerPreference: 'high-performance',
			});
			renderer.setSize(width, height);
			const targetPixelRatio = reducedMotion ? Math.min(config.pixelRatio, 1.2) : config.pixelRatio;
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, targetPixelRatio));
			renderer.domElement.style.position = 'absolute';
			renderer.domElement.style.top = '0';
			renderer.domElement.style.left = '0';
			renderer.domElement.style.width = '100%';
			renderer.domElement.style.height = '100%';
			container.appendChild(renderer.domElement);

			const textureLoader = new THREE.TextureLoader();
			const hologramGroup = new THREE.Group();
			scene.add(hologramGroup);

			const materials: THREE_NS.ShaderMaterial[] = [];
			textureUrls.forEach((url) => {
				const uniforms: Record<string, { value: unknown }> = {
					uTime: { value: 0 },
					uTexture: { value: new THREE.Texture() },
					uColor: { value: new THREE.Color(HOLOGRAM_COLOR) },
					uOpacity: { value: 0.0 },
				};
				if (!config.useSimpleShader) uniforms.uGlitchIntensity = { value: 1.0 };

				const material = new THREE.ShaderMaterial({
					vertexShader,
					fragmentShader,
					uniforms: uniforms as THREE_NS.ShaderMaterial['uniforms'],
					transparent: true,
					side: THREE.DoubleSide,
					blending: THREE.AdditiveBlending,
				});

				const geometry = new THREE.PlaneGeometry(1, 1);
				const mesh = new THREE.Mesh(geometry, material);
				mesh.scale.set(0, 0, 0);
				hologramGroup.add(mesh);
				materials.push(material);

				textureLoader.load(url, (texture) => {
					if (cancelled) {
						texture.dispose();
						return;
					}
					material.uniforms.uTexture.value = texture;
					const image = texture.image;
					const aspect = image.width / image.height;
					const baseSize = 5;
					if (aspect > 1) {
						mesh.scale.set(baseSize, baseSize / aspect, 1);
					} else {
						mesh.scale.set(baseSize * aspect, baseSize, 1);
					}
					mesh.userData.originalScale = mesh.scale.clone();
				});
			});

			const blocksGroup = new THREE.Group();
			scene.add(blocksGroup);
			const blockCount = reducedMotion ? Math.max(4, Math.floor(config.blockCount / 2)) : config.blockCount;
			const blockMaterials: THREE_NS.MeshBasicMaterial[] = [];

			for (let i = 0; i < blockCount; i += 1) {
				const geometry = new THREE.PlaneGeometry(Math.random() * 3, Math.random() * 0.8);
				const material = new THREE.MeshBasicMaterial({
					color: HOLOGRAM_COLOR,
					transparent: true,
					opacity: 0,
					blending: THREE.AdditiveBlending,
				});
				const block = new THREE.Mesh(geometry, material);
				blocksGroup.add(block);
				blockMaterials.push(material);
			}

			const linesCount = reducedMotion ? Math.max(8, Math.floor(config.linesCount / 2)) : config.linesCount;
			const linesGroup = new THREE.Group();
			scene.add(linesGroup);

			for (let i = 0; i < linesCount; i += 1) {
				const geometry = new THREE.BufferGeometry();
				const y = (Math.random() - 0.5) * 15;
				geometry.setFromPoints([new THREE.Vector3(-20, y, 0), new THREE.Vector3(20, y, 0)]);
				const material = new THREE.LineBasicMaterial({
					color: HOLOGRAM_COLOR,
					transparent: true,
					opacity: Math.random() * 0.3,
					blending: THREE.AdditiveBlending,
				});
				linesGroup.add(new THREE.Line(geometry, material));
			}

			const timer = new THREE.Timer();
			let frameId = 0;
			let isRunning = false;

			const renderFrame = () => {
				timer.update();
				const elapsedTime = timer.getElapsed();
				const vHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
				const vWidth = vHeight * camera.aspect;
				const sceneVisibility = Math.max(0.36, openProgressRef.current) * (1 - scrollProgressRef.current * 0.22);

				materials.forEach((mat, i) => {
					mat.uniforms.uTime.value = elapsedTime;
					const noise = Math.sin(elapsedTime * 3.0 + i * 15.0) * 0.5 + 0.5;
					const threshold = reducedMotion ? 0.92 : 0.85;
					const isVisible = noise > threshold;
					const prevOpacity = mat.uniforms.uOpacity.value;

					if (isVisible) {
						if (prevOpacity < 0.05) {
							hologramGroup.children[i].position.set(0, 0, 0);
							const originalScale = hologramGroup.children[i].userData.originalScale;
							if (originalScale) {
								const imgAspect = originalScale.x / originalScale.y;
								const screenAspect = vWidth / vHeight;
								if (imgAspect > screenAspect) {
									const s = vWidth / originalScale.x;
									hologramGroup.children[i].scale.set(originalScale.x * s, originalScale.y * s, 1);
								} else {
									const s = vHeight / originalScale.y;
									hologramGroup.children[i].scale.set(originalScale.x * s, originalScale.y * s, 1);
								}
							}
						}
						mat.uniforms.uOpacity.value = sceneVisibility * (0.5 + Math.random() * 0.28);
					} else {
						mat.uniforms.uOpacity.value = 0.0;
					}

					if (mat.uniforms.uGlitchIntensity) {
						mat.uniforms.uGlitchIntensity.value = isVisible ? (Math.random() > 0.7 ? 25.0 : 4.0) : 0.0;
					}
				});

				blockMaterials.forEach((mat, i) => {
					const blockNoise = Math.sin(elapsedTime * 8.0 + i * 50.0) * 0.5 + 0.5;
					if (blockNoise > 0.9) {
						mat.opacity = sceneVisibility * 0.9;
						if (Math.random() > 0.95) {
							blocksGroup.children[i].position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6);
						}
					} else {
						mat.opacity = 0;
					}
				});

				linesGroup.children.forEach((child, i) => {
					const line = child as THREE_NS.Line;
					const material = line.material as THREE_NS.LineBasicMaterial;
					line.position.y += Math.sin(elapsedTime * 0.8 + i) * 0.01;
					if (Math.random() > 0.99) {
						material.opacity = sceneVisibility * 0.8;
					} else {
						material.opacity = Math.max(material.opacity - 0.02, 0.08);
					}
				});

				renderer.render(scene, camera);
				frameId = window.requestAnimationFrame(renderFrame);
			};

			const startLoop = () => {
				if (isRunning) return;
				isRunning = true;
				// Reset on resume so the time delta from the pause window doesn't
				// inject a sudden phase jump into the sin/cos-driven shader animations.
				timer.reset();
				frameId = window.requestAnimationFrame(renderFrame);
			};

			const stopLoop = () => {
				if (!isRunning) return;
				isRunning = false;
				window.cancelAnimationFrame(frameId);
			};

			const handleResize = () => {
				if (!containerRef.current) return;
				width = containerRef.current.clientWidth || window.innerWidth;
				height = containerRef.current.clientHeight || window.innerHeight;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height);
			};

			handleResize();
			window.addEventListener('resize', handleResize);

			// Long-task watcher: if the main thread chokes early, demote tier for next visit.
			let longTaskObserver: PerformanceObserver | null = null;
			let longTaskCount = 0;
			const observeStart = performance.now();
			if (typeof PerformanceObserver !== 'undefined') {
				try {
					longTaskObserver = new PerformanceObserver((list) => {
						for (const entry of list.getEntries()) {
							if (entry.duration >= LONG_TASK_THRESHOLD_MS) {
								longTaskCount += 1;
								if (longTaskCount >= LONG_TASK_BUDGET) {
									degradeTier(tier === 'full' ? 'medium' : 'lite', true);
									longTaskObserver?.disconnect();
									longTaskObserver = null;
									break;
								}
							}
						}
						if (performance.now() - observeStart > LONG_TASK_OBSERVE_WINDOW_MS) {
							longTaskObserver?.disconnect();
							longTaskObserver = null;
						}
					});
					longTaskObserver.observe({ entryTypes: ['longtask'] });
				} catch {
					longTaskObserver = null;
				}
			}

			// Viewport gate: only run animation when hero is on screen.
			const intersectionObserver = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) startLoop();
						else stopLoop();
					}
				},
				{ threshold: 0.05 },
			);
			intersectionObserver.observe(container);

			const handleVisibility = () => {
				if (document.hidden) stopLoop();
				else if (container.getBoundingClientRect().bottom > 0) startLoop();
			};
			document.addEventListener('visibilitychange', handleVisibility);

			cleanup = () => {
				stopLoop();
				timer.dispose();
				document.removeEventListener('visibilitychange', handleVisibility);
				intersectionObserver.disconnect();
				longTaskObserver?.disconnect();
				window.removeEventListener('resize', handleResize);
				materials.forEach((mat) => {
					const tex = mat.uniforms.uTexture.value as THREE_NS.Texture | null;
					tex?.dispose();
					mat.dispose();
				});
				blockMaterials.forEach((mat) => mat.dispose());
				linesGroup.children.forEach((child) => {
					const line = child as THREE_NS.Line;
					(line.material as THREE_NS.Material).dispose();
					line.geometry.dispose();
				});
				hologramGroup.children.forEach((child) => {
					(child as THREE_NS.Mesh).geometry.dispose();
				});
				scene.clear();
				renderer.dispose();
				if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
			};
		};

		init();

		return () => {
			cancelled = true;
			cleanup?.();
		};
	}, [reducedMotion, tier]);

	if (tier === 'lite') {
		return (
			<div ref={containerRef} className='hero-hologram-scene hero-hologram-scene--lite' aria-hidden='true'>
				<img src={LITE_FALLBACK_SRC} alt='' className='hero-hologram-scene__lite-image' />
				<div className='hero-hologram-scene__scanlines' />
				<div className='hero-hologram-scene__vignette' />
			</div>
		);
	}

	return (
		<div ref={containerRef} className='hero-hologram-scene' aria-hidden='true'>
			<div className='hero-hologram-scene__scanlines' />
			<div className='hero-hologram-scene__vignette' />
		</div>
	);
};

export default HeroHologramBackground;
