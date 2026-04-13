import React, { useState, useMemo, useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line, Billboard, Html, OrbitControls, PerspectiveCamera, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { X, Orbit, LayoutGrid, Sparkles } from 'lucide-react';
import { typography } from '../design-system/typography';

/* ═══════════════════════════════════════════════════════════════════
   Theme Data
   ═══════════════════════════════════════════════════════════════════ */

const THEMES = [
	'Usability and User Experience',
	'Interaction Techniques and Devices',
	'Understanding Users and Human Behavior',
	'Design Methods and Processes',
	'Mobile and Ubiquitous Computing',
	'Virtual, Augmented, Mixed, and Extended Reality',
	'Human-AI Interaction',
	'Social Computing and Collaboration',
	'Specific Application Areas',
	'Ethics, Accessibility, and Inclusive Design',
	'More-than-Human Design',
];

const THEME_CN: Record<string, string> = {
	'Usability and User Experience': '可用性與使用者體驗',
	'Interaction Techniques and Devices': '互動技術與裝置',
	'Understanding Users and Human Behavior': '理解使用者與人類行為',
	'Design Methods and Processes': '設計方法與流程',
	'Mobile and Ubiquitous Computing': '移動與普適計算',
	'Virtual, Augmented, Mixed, and Extended Reality': '虛擬、擴增、混合與擴展實境',
	'Human-AI Interaction': '人工智慧與人類互動',
	'Social Computing and Collaboration': '社群運算與協作',
	'Specific Application Areas': '特定應用領域',
	'Ethics, Accessibility, and Inclusive Design': '倫理、無障礙與包容性設計',
	'More-than-Human Design': '超越人本中心的設計',
};

const THEME_DESCRIPTIONS: Record<string, { en: string[]; cn: string[] }> = {
	'Usability and User Experience': {
		en: ['Design and evaluation of user-friendly interfaces', 'User experience (UX) research and methodologies', 'Usability testing and assessment'],
		cn: ['使用者友好介面的設計與評估', '使用者體驗（UX）研究與方法', '可用性測試與評估'],
	},
	'Interaction Techniques and Devices': {
		en: ['Development of innovative interaction techniques', 'Design and evaluation of new input/output devices', 'Haptic and multimodal interaction'],
		cn: ['創新互動技術', '新型輸入/輸出裝置的設計與評估', '觸覺與多模態互動'],
	},
	'Understanding Users and Human Behavior': {
		en: ['Theoretical models of human behavior', 'User research methods', 'Cultural and social factors in HCI'],
		cn: ['人類行為的理論模型', '使用者研究方法', '文化與社會因素在HCI中的影響'],
	},
	'Design Methods and Processes': {
		en: ['Innovative design methodologies', 'Scalable and inclusive design practices', 'Evolving design processes in industry and academia'],
		cn: ['創新設計方法論', '可擴展且包容性的設計實踐', '產業與學術界設計流程的演進'],
	},
	'Mobile and Ubiquitous Computing': {
		en: ['Mobile user interfaces and applications', 'Context-aware computing', 'Internet of Things (IoT) and pervasive computing'],
		cn: ['移動使用者介面與應用', '情境感知計算', '物聯網（IoT）與普適計算'],
	},
	'Virtual, Augmented, Mixed, and Extended Reality': {
		en: ['Design, development, and application of immersive technologies', 'Perception and cognition in immersive environments', 'User interaction techniques for immersive systems'],
		cn: ['沉浸式技術在娛樂、教育和醫療等領域的設計、開發與應用', '沉浸式環境中的感知與認知', '沉浸式系統的使用者互動技術'],
	},
	'Human-AI Interaction': {
		en: ['Design of interactive AI agents and smart assistants', 'Explainable AI and user trust', 'Ethical implications of AI in user interfaces'],
		cn: ['互動式AI代理人與智能助手的設計', '可解釋的AI與使用者信任', 'AI在使用者介面中的倫理影響'],
	},
	'Social Computing and Collaboration': {
		en: ['Computer-Supported Cooperative Work (CSCW)', 'Social media analysis and design', 'Online communities, digital democracy, and civic engagement'],
		cn: ['電腦支援協同工作（CSCW）', '社交媒體分析與設計', '線上社群、數位民主與公民參與'],
	},
	'Specific Application Areas': {
		en: ['Physical/Mental Well-being', 'Education and Learning Technologies', 'Creativity Support'],
		cn: ['身心健康：促進身心健康的技術、輔助技術、健康信息學與遠程醫療', '教育與學習技術：數位學習工具與平台、教育遊戲設計', '創意支持：增強創意流程的技術、電腦輔助設計'],
	},
	'Ethics, Accessibility, and Inclusive Design': {
		en: ['Designing for accessibility and diverse user groups', 'Ethical considerations in HCI', 'Inclusive digital experiences'],
		cn: ['為無障礙與多元使用者群體設計', 'HCI中的倫理考量', '包容性的數位體驗'],
	},
	'More-than-Human Design': {
		en: ['Speculative and critical design approaches', 'Thing-centered design', 'Sustainable and environmentally conscious design'],
		cn: ['推測性與批判性設計方法', '以物件為中心的設計', '永續與環境友好的設計'],
	},
};

const NEON_GREEN = '#39FF14';
const ACCENT_GREEN = '#A8F020';
const DARK_BG = '#050505';
const INTER_FONT = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';


type ViewMode = 'constellation' | 'radar' | 'grid';

/* ═══════════════════════════════════════════════════════════════════
   Shared Detail Panel (rendered outside Canvas)
   ═══════════════════════════════════════════════════════════════════ */

function ThemeDetailPanel({ theme, language, onClose }: { theme: string; language: 'zh' | 'en'; onClose: () => void }) {
	const title = language === 'zh' ? THEME_CN[theme] : theme;
	const subtitle = language === 'zh' ? theme : THEME_CN[theme];
	const desc = THEME_DESCRIPTIONS[theme];
	const bullets = desc ? (language === 'zh' ? desc.cn : desc.en) : [];

	return (
		<motion.div
			initial={{ opacity: 0, x: 80 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 80 }}
			transition={{ type: 'spring', damping: 26, stiffness: 260 }}
			className='fixed right-4 top-4 z-50 w-[320px] max-h-[calc(100dvh-6rem)] overflow-y-auto border border-[#A8F020]/40 bg-[rgba(5,5,8,0.94)] p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl md:right-8 md:top-1/2 md:w-[360px] md:max-h-[80vh] md:-translate-y-1/2'
		>
			<button type='button' onClick={onClose} className='absolute right-4 top-4 text-white/40 transition-colors hover:text-white'>
				<X size={20} />
			</button>



			<h3 className='font-sans text-[22px] font-bold leading-tight tracking-tight text-white'>{title}</h3>
			<p className={`mt-1 ${typography.scale.label} text-white/45`}>{subtitle}</p>

			<div className='mt-5 h-px w-full bg-gradient-to-r from-[#A8F020]/50 via-[#A8F020]/12 to-transparent' />

			<ul className={`mt-5 space-y-3 ${typography.scale.label} text-white/78`}>
				{bullets.map((b) => (
					<li key={b} className='flex items-start gap-3'>
						<span className='mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#A8F020]' />
						<span>{b}</span>
					</li>
				))}
			</ul>

			<button
				type='button'
				onClick={onClose}
				className='mt-8 w-full border border-white/20 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-all hover:border-[#A8F020] hover:bg-[#A8F020]/10 hover:text-[#A8F020]'
			>
				{language === 'zh' ? '關閉' : 'Close'}
			</button>
		</motion.div>
	);
}

/* ═══════════════════════════════════════════════════════════════════
   VIEW 1 — Constellation (3D Orbit Rings)
   ═══════════════════════════════════════════════════════════════════ */

function OrbitRing({
	theme,
	radius,
	speed,
	index,
	language,
	onSelectTheme,
	isSelected,
}: {
	theme: string;
	radius: number;
	speed: number;
	index: number;
	language: 'zh' | 'en';
	onSelectTheme: () => void;
	isSelected: boolean;
}) {
	const groupRef = useRef<THREE.Group>(null!);

	useFrame((state) => {
		if (groupRef.current) {
			groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
		}
	});

	const orbitPoints = useMemo(() => {
		const pts: THREE.Vector3[] = [];
		for (let i = 0; i <= 64; i++) {
			const a = (i / 64) * Math.PI * 2;
			pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
		}
		return pts;
	}, [radius]);

	const trailArcs = useMemo(() => {
		const count = 2 + (index % 3);
		return Array.from({ length: count }, (_, k) => {
			const startAngle = (k / count) * Math.PI * 2;
			const arcLen = Math.PI * (0.2 + Math.random() * 0.3);
			const pts: THREE.Vector3[] = [];
			for (let j = 0; j <= 16; j++) {
				const a = startAngle - (j / 16) * arcLen;
				pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
			}
			return pts;
		});
	}, [radius, index]);

	const particles = useMemo(() => {
		const count = 3 + (index % 3);
		return Array.from({ length: count }, (_, k) => {
			const a = (k / count) * Math.PI * 2 + index * 0.7;
			return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
		});
	}, [radius, index]);

	const labelAngle = (index * 137.5 * Math.PI) / 180;
	const labelX = Math.cos(labelAngle) * radius;
	const labelZ = Math.sin(labelAngle) * radius;
	const labelY = 2.5 + (index % 3) * 2;
	const labelText = language === 'zh' ? THEME_CN[theme] : theme;

	return (
		<group>
			<Line points={orbitPoints} color='#f36458' lineWidth={0.5} transparent opacity={0.05} dashed dashScale={5} dashSize={0.5} gapSize={0.5} />
			<group ref={groupRef}>
				<Line
					points={[new THREE.Vector3(labelX, 0, labelZ), new THREE.Vector3(labelX, labelY - 0.5, labelZ)]}
					color={isSelected ? NEON_GREEN : '#f36458'}
					lineWidth={1}
					transparent
					opacity={isSelected ? 0.4 : 0.1}
				/>
				{trailArcs.map((pts, k) => (
					<Line key={`arc-${k}`} points={pts} color='#f36458' lineWidth={1.2} transparent opacity={0.15} />
				))}
				<Billboard position={[labelX, labelY, labelZ]}>
					<Html center transform distanceFactor={20}>
						<div
							className={`pointer-events-auto flex cursor-pointer flex-col items-center rounded-sm border px-3.5 py-2 text-center backdrop-blur-md transition-all duration-300 md:px-5 md:py-2.5 ${
								isSelected
									? 'scale-110 border-[#A8F020] bg-[#A8F020]/20 text-[#A8F020] shadow-[0_0_20px_rgba(168,240,32,0.25)]'
									: 'border-[#f36458]/20 bg-black/60 text-[#f36458] hover:border-[#f36458]/50'
							}`}
							style={{ maxWidth: language === 'zh' ? 168 : 232 }}
							onClick={(e) => {
								e.stopPropagation();
								onSelectTheme();
							}}
						>
							<span className='text-sm font-bold leading-tight tracking-tight md:text-lg'>{labelText}</span>
						</div>
					</Html>
				</Billboard>
				{particles.map((pos, k) => (
					<mesh key={`p-${k}`} position={pos}>
						<sphereGeometry args={[0.2, 8, 8]} />
						<meshStandardMaterial color='#f36458' emissive='#f36458' emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
					</mesh>
				))}
			</group>
		</group>
	);
}

/* ── Camera Controller (zoom to selection) ──────────────────────── */

function CameraController({
	selectedThemeIndex,
	controlsRef,
}: {
	selectedThemeIndex: number | null;
	controlsRef: React.RefObject<any>;
}) {
	const defaultPos = useMemo(() => new THREE.Vector3(0, 80, 5), []);
	const defaultTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);
	const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
	const framesLeft = useRef(0);
	const prevIndex = useRef<number | null>(null);

	if (prevIndex.current !== selectedThemeIndex) {
		prevIndex.current = selectedThemeIndex;
		framesLeft.current = 90;
	}

	useFrame(({ camera }) => {
		if (framesLeft.current <= 0) return;
		framesLeft.current--;

		let goalPos = defaultPos;
		let goalTarget = defaultTarget;

		if (selectedThemeIndex !== null) {
			const radius = 15 + selectedThemeIndex * 5;
			const labelAngle = (selectedThemeIndex * 137.5 * Math.PI) / 180;
			const labelX = Math.cos(labelAngle) * radius;
			const labelZ = Math.sin(labelAngle) * radius;
			const labelY = 2.5 + (selectedThemeIndex % 3) * 2;

			const perpX = -Math.sin(labelAngle);
			const perpZ = Math.cos(labelAngle);

			// Position camera to the RIGHT of the label → label appears on LEFT of screen
			const rightShift = Math.min(radius * 0.45, 22);
			const heightAbove = 3; // low angle, near orbital plane
			const pullBack = Math.min(radius * 0.18, 10);

			goalPos = new THREE.Vector3(
				labelX + perpX * rightShift + Math.cos(labelAngle) * pullBack,
				labelY + heightAbove,
				labelZ + perpZ * rightShift + Math.sin(labelAngle) * pullBack
			);
			goalTarget = new THREE.Vector3(labelX, labelY, labelZ);
		}

		camera.position.lerp(goalPos, 0.06);
		currentTarget.current.lerp(goalTarget, 0.06);
		camera.lookAt(currentTarget.current);

		// Sync OrbitControls target so it doesn't snap back after animation
		if (controlsRef.current) {
			controlsRef.current.target.copy(currentTarget.current);
			controlsRef.current.update();
		}
	});

	return null;
}

function ConstellationScene({
	language,
	selectedTheme,
	onSelectTheme,
	controlsRef,
}: {
	language: 'zh' | 'en';
	selectedTheme: string | null;
	onSelectTheme: (t: string | null) => void;
	controlsRef: React.RefObject<any>;
}) {
	const baseSpeed = 0.01;
	const selectedIndex = selectedTheme ? THEMES.indexOf(selectedTheme) : null;

	return (
		<group>
			<CameraController selectedThemeIndex={selectedIndex === -1 ? null : selectedIndex} controlsRef={controlsRef} />
			<group>
				<mesh>
					<sphereGeometry args={[5, 32, 32]} />
					<meshStandardMaterial color='#f36458' emissive='#f36458' emissiveIntensity={1.5} />
				</mesh>
				<Billboard position={[0, 7, 0]}>
					<Html center transform distanceFactor={20}>
						<span className='pointer-events-none font-pixel text-[28px] tracking-[0.12em] text-[#f36458]' style={{ whiteSpace: 'nowrap' }}>
							TAICHI 2026
						</span>
					</Html>
				</Billboard>
				<pointLight intensity={3} distance={150} color='#f36458' />
			</group>
			{THEMES.map((theme, i) => {
				const radius = 15 + i * 5;
				const speed = baseSpeed + (11 - i) * 0.005;
				return (
					<OrbitRing
						key={theme}
						theme={theme}
						radius={radius}
						speed={speed}
						index={i}
						language={language}
						onSelectTheme={() => onSelectTheme(selectedTheme === theme ? null : theme)}
						isSelected={selectedTheme === theme}
					/>
				);
			})}
		</group>
	);
}

/* ═══════════════════════════════════════════════════════════════════
   VIEW 2 — Radar (2D Orbital Top-Down)
   ═══════════════════════════════════════════════════════════════════ */

function RadarGrid() {
	return (
		<group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
			{[3, 6, 9, 12, 15].map((radius, i) => (
				<mesh key={i}>
					<ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
					<meshBasicMaterial color={NEON_GREEN} transparent opacity={0.1} />
				</mesh>
			))}
			{[0, 45, 90, 135].map((deg, i) => (
				<mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
					<planeGeometry args={[30, 0.01]} />
					<meshBasicMaterial color={NEON_GREEN} transparent opacity={0.05} />
				</mesh>
			))}
			<mesh>
				<circleGeometry args={[0.1, 32]} />
				<meshBasicMaterial color={NEON_GREEN} transparent opacity={0.5} />
			</mesh>
		</group>
	);
}

function RadarHUD({ active }: { active: boolean }) {
	const groupRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (!groupRef.current) return;
		const t = state.clock.getElapsedTime();
		if (groupRef.current.children[0]) groupRef.current.children[0].rotation.z = t * 0.1;
		if (groupRef.current.children[1]) groupRef.current.children[1].rotation.z = -t * 0.2;
		if (groupRef.current.children[2]) groupRef.current.children[2].rotation.z = t * 0.05;
		if (groupRef.current.children[4]) groupRef.current.children[4].rotation.z = t * 1.5;
	});

	return (
		<group ref={groupRef}>
			{/* Outer Rotating Ring with Ticks */}
			<group>
				<mesh>
					<ringGeometry args={[5.2, 5.22, 128]} />
					<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.4 : 0.1} />
				</mesh>
				{Array.from({ length: 72 }).map((_, i) => (
					<group key={i} rotation={[0, 0, (i * 5 * Math.PI) / 180]}>
						<mesh position={[0, 5.3, 0]}>
							<planeGeometry args={[0.01, i % 2 === 0 ? 0.2 : 0.1]} />
							<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.5 : 0.1} />
						</mesh>
					</group>
				))}
			</group>
			{/* Pulsing Arcs */}
			<group>
				{[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, i) => (
					<mesh key={i} rotation={[0, 0, rot + Math.PI / 8]}>
						<ringGeometry args={[5.5, 5.6, 64, 1, 0, Math.PI / 4]} />
						<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.3 : 0.05} />
					</mesh>
				))}
			</group>
			{/* Focus Brackets */}
			<group>
				{[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, i) => (
					<group key={i} rotation={[0, 0, rot]}>
						<mesh position={[5.1, 0, 0]}>
							<planeGeometry args={[0.05, 1.2]} />
							<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.8 : 0.2} />
						</mesh>
						<mesh position={[4.95, 0.6, 0]}>
							<planeGeometry args={[0.3, 0.05]} />
							<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.8 : 0.2} />
						</mesh>
						<mesh position={[4.95, -0.6, 0]}>
							<planeGeometry args={[0.3, 0.05]} />
							<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.8 : 0.2} />
						</mesh>
						<mesh position={[4.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
							<coneGeometry args={[0.1, 0.2, 3]} />
							<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 1 : 0.3} />
						</mesh>
					</group>
				))}
			</group>
			{/* Outer glow ring */}
			<mesh>
				<ringGeometry args={[6.2, 6.21, 128]} />
				<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.1 : 0.02} />
			</mesh>
			{/* Scanning Line */}
			<group>
				<mesh>
					<planeGeometry args={[6.5, 0.02]} />
					<meshBasicMaterial color={NEON_GREEN} transparent opacity={active ? 0.2 : 0.05} />
				</mesh>
			</group>
		</group>
	);
}

function RadarThemeTag({
	theme,
	index,
	total,
	onSelect,
	selectedId,
	language,
}: {
	theme: string;
	index: number;
	total: number;
	onSelect: (t: string) => void;
	selectedId: string | null;
	language: 'zh' | 'en';
}) {
	const groupRef = useRef<THREE.Group>(null);
	const [hovered, setHovered] = useState(false);
	const isSelected = selectedId === theme;
	const targetPos = useRef(new THREE.Vector3());
	const currentPos = useRef(new THREE.Vector3());
	const label = language === 'zh' ? THEME_CN[theme] : theme;
	const tagWidth = Math.min(10, label.length * 0.35 + 1.2);

	useFrame((state) => {
		if (!groupRef.current) return;
		const t = state.clock.getElapsedTime() * 0.1;
		const angle = (index / total) * Math.PI * 2 + t;
		const radius = 9;
		targetPos.current.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
		currentPos.current.lerp(targetPos.current, 0.1);
		groupRef.current.position.copy(currentPos.current);
		groupRef.current.rotation.set(-Math.PI / 2, 0, -angle + Math.PI / 2);
	});

	const scale = hovered ? 1.1 : 1;

	return (
		<group ref={groupRef} onClick={() => onSelect(theme)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
			<Float speed={isSelected ? 0 : 2} rotationIntensity={0.1} floatIntensity={0.1}>
				<mesh>
					<planeGeometry args={[tagWidth, 0.8]} />
					<meshBasicMaterial color={isSelected ? NEON_GREEN : DARK_BG} transparent opacity={0.9} />
				</mesh>
				<mesh position={[0, 0, -0.01]}>
					<planeGeometry args={[tagWidth + 0.06, 0.86]} />
					<meshBasicMaterial color={NEON_GREEN} transparent opacity={0.6} />
				</mesh>
				<Text
					position={[0, 0, 0.01]}
					fontSize={0.28}
					maxWidth={tagWidth - 0.4}
					textAlign='center'
					color={isSelected ? DARK_BG : NEON_GREEN}
					font={INTER_FONT}
					anchorX='center'
					anchorY='middle'
					scale={scale}
				>
					{label}
				</Text>
			</Float>
		</group>
	);
}

function StarField() {
	const count = 1000;
	const positions = useMemo(() => {
		const pos = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			pos[i * 3] = (Math.random() - 0.5) * 60;
			pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
			pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
		}
		return pos;
	}, []);

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute attach='attributes-position' count={count} array={positions} itemSize={3} />
			</bufferGeometry>
			<pointsMaterial size={0.03} color={NEON_GREEN} transparent opacity={0.2} sizeAttenuation />
		</points>
	);
}

function RadarScene({
	language,
	selectedTheme,
	onSelectTheme,
}: {
	language: 'zh' | 'en';
	selectedTheme: string | null;
	onSelectTheme: (t: string | null) => void;
}) {
	const selected = selectedTheme ? THEMES.find((t) => t === selectedTheme) : null;
	const title = selected ? (language === 'zh' ? THEME_CN[selected] : selected) : null;
	const desc = selected ? THEME_DESCRIPTIONS[selected] : null;
	const descText = desc ? (language === 'zh' ? desc.cn.join('；') : desc.en.join('; ')) : null;

	return (
		<>
			<StarField />
			<RadarGrid />
			<group>
				{THEMES.map((theme, i) => (
					<RadarThemeTag
						key={theme}
						theme={theme}
						index={i}
						total={THEMES.length}
						onSelect={(t) => onSelectTheme(selectedTheme === t ? null : t)}
						selectedId={selectedTheme}
						language={language}
					/>
				))}
			</group>
			{/* Central HUD & info panel */}
			<group rotation={[-Math.PI / 2, 0, 0]}>
				<mesh>
					<circleGeometry args={[5, 64]} />
					<meshBasicMaterial color='black' transparent opacity={selectedTheme ? 0.95 : 0.05} />
				</mesh>
				<mesh>
					<ringGeometry args={[4.95, 5.05, 64]} />
					<meshBasicMaterial color={NEON_GREEN} transparent opacity={selectedTheme ? 0.5 : 0.1} />
				</mesh>
				<RadarHUD active={!!selectedTheme} />
				<Html center transform distanceFactor={10}>
					<div className='pointer-events-none flex h-[320px] w-[320px] flex-col items-center justify-center p-6 text-center md:h-[400px] md:w-[400px] md:p-12'>
						<AnimatePresence mode='wait'>
							{title ? (
								<motion.div key={title} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className='flex flex-col items-center'>
									<h2 className='mb-4 text-2xl font-bold uppercase leading-none tracking-tighter text-[#39FF14] md:text-4xl'>{title}</h2>
									<p className={`max-w-[280px] ${typography.scale.label} text-white/80 md:max-w-[320px]`}>{descText}</p>
								</motion.div>
							) : (
								<motion.div initial={{ opacity: 0.2 }} animate={{ opacity: 0.4 }} className='flex flex-col items-center'>
									<div className='mb-4 h-16 w-16 animate-spin rounded-full border-2 border-dashed border-[#39FF14]' style={{ animationDuration: '8s' }} />
									<p className='font-mono text-[10px] uppercase tracking-[0.4em] text-[#39FF14]'>Radar Active</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</Html>
			</group>
			<ContactShadows position={[0, -10, 0]} opacity={0.1} scale={40} blur={2} far={10} />
		</>
	);
}

/* ═══════════════════════════════════════════════════════════════════
   VIEW 3 — Grid (2D Card Layout, no Canvas)
   ═══════════════════════════════════════════════════════════════════ */

function GridView({
	language,
	selectedTheme,
	onSelectTheme,
}: {
	language: 'zh' | 'en';
	selectedTheme: string | null;
	onSelectTheme: (t: string | null) => void;
}) {
	return (
		<div className='relative z-10 grid w-full max-w-[1100px] gap-3 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
			{THEMES.map((theme, i) => {
				const isSelected = selectedTheme === theme;
				const titleCn = THEME_CN[theme];
				const titleEn = theme;
				const desc = THEME_DESCRIPTIONS[theme];
				const bullets = desc ? (language === 'zh' ? desc.cn : desc.en) : [];
				const label = language === 'zh' ? titleCn : titleEn;
				const subtitle = language === 'zh' ? titleEn : titleCn;

				return (
					<motion.button
						key={theme}
						type='button'
						onClick={() => onSelectTheme(isSelected ? null : theme)}
						className={`group relative flex flex-col overflow-hidden border p-5 text-left transition-all duration-300 ${
							isSelected
								? 'border-[#A8F020] bg-[#A8F020]/10 shadow-[0_0_30px_rgba(168,240,32,0.15)]'
								: 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
						}`}
						layout
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.04 }}
					>
						{/* Index badge */}
						<span className={`mb-3 font-pixel text-[10px] tracking-[0.2em] ${isSelected ? 'text-[#A8F020]' : 'text-white/25'}`}>
							{String(i + 1).padStart(2, '0')}
						</span>

						{/* Title */}
						<h4 className={`font-roboto text-[15px] font-bold leading-tight tracking-tight ${isSelected ? 'text-[#A8F020]' : 'text-[#f36458]'}`}>{label}</h4>
						<p className='mt-1 font-roboto text-[11px] text-white/35'>{subtitle}</p>

						{/* Expandable bullets */}
						<AnimatePresence>
							{isSelected && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.3 }}
									className='overflow-hidden'
								>
									<div className='mt-4 h-px w-full bg-gradient-to-r from-[#A8F020]/40 to-transparent' />
									<ul className='mt-3 space-y-2 font-roboto text-[12px] leading-[18px] text-white/70'>
										{bullets.map((b) => (
											<li key={b} className='flex items-start gap-2'>
												<span className='mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#A8F020]' />
												<span>{b}</span>
											</li>
										))}
									</ul>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Decorative corner */}
						<div className={`absolute right-0 top-0 h-8 w-8 border-b border-l ${isSelected ? 'border-[#A8F020]/30' : 'border-white/5'} transition-colors`} />
					</motion.button>
				);
			})}
		</div>
	);
}

/* ═══════════════════════════════════════════════════════════════════
   View Mode Toggle
   ═══════════════════════════════════════════════════════════════════ */

function ViewToggle({
	viewMode,
	onChange,
	language,
	isMobile,
}: {
	viewMode: ViewMode;
	onChange: (v: ViewMode) => void;
	language: 'zh' | 'en';
	isMobile: boolean;
}) {
	const desktopModes: { key: ViewMode; icon: React.ReactNode; label: string; labelCn: string }[] = [
		{ key: 'constellation', icon: <Sparkles size={14} />, label: 'Constellation', labelCn: '星座' },
		{ key: 'radar', icon: <Orbit size={14} />, label: 'Radar', labelCn: '雷達' },
		{ key: 'grid', icon: <LayoutGrid size={14} />, label: 'Grid', labelCn: '列表' },
	];
	const modes = isMobile ? [
		{ key: 'radar', icon: <Orbit size={14} />, label: 'Radar', labelCn: '雷達' },
		{ key: 'grid', icon: <LayoutGrid size={14} />, label: 'Grid', labelCn: '列表' },
	] : desktopModes;

	return (
		<div className='relative z-20 mb-8 flex items-center justify-center'>
			<div className='flex rounded-full border border-white/15 bg-black/60 p-1 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl'>
				{modes.map((m) => (
					<button
						key={m.key}
						type='button'
						onClick={() => onChange(m.key)}
						className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-all ${
							viewMode === m.key ? 'bg-[#A8F020] text-black shadow-[0_0_15px_rgba(168,240,32,0.3)]' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
						}`}
					>
						{m.icon}
						{language === 'zh' ? m.labelCn : m.label}
					</button>
				))}
			</div>
		</div>
	);
}

/* ═══════════════════════════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════════════════════════ */

interface ConstellationMapSectionProps {
	language: 'zh' | 'en';
}

export default function ConstellationMapSection({ language }: ConstellationMapSectionProps) {
	const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [viewMode, setViewMode] = useState<ViewMode>('constellation');
	const orbitControlsRef = useRef<any>(null);

	const handleViewChange = (v: ViewMode) => {
		setSelectedTheme(v === 'radar' ? (currentTheme) => currentTheme ?? THEMES[0] : null);
		setViewMode(v);
	};

	useEffect(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
			return undefined;
		}

		const mediaQuery = window.matchMedia('(max-width: 767px)');
		const syncMobileMode = () => {
			setIsMobile(mediaQuery.matches);
			setViewMode(mediaQuery.matches ? 'radar' : 'constellation');
			setSelectedTheme(mediaQuery.matches ? THEMES[0] : null);
		};

		syncMobileMode();
		mediaQuery.addEventListener('change', syncMobileMode);
		return () => mediaQuery.removeEventListener('change', syncMobileMode);
	}, []);

	useEffect(() => {
		if (viewMode !== 'radar') {
			return undefined;
		}

		if (!selectedTheme) {
			setSelectedTheme(THEMES[0]);
			return undefined;
		}

		const autoplayId = window.setInterval(() => {
			setSelectedTheme((currentTheme) => {
				const currentIndex = currentTheme ? THEMES.indexOf(currentTheme) : -1;
				return THEMES[(currentIndex + 1) % THEMES.length];
			});
		}, 2400);

		return () => window.clearInterval(autoplayId);
	}, [selectedTheme, viewMode]);

	// Prevent mouse-wheel from zooming 3D — only pinch (ctrlKey) should zoom
	const canvasRef = useCallback((node: HTMLDivElement | null) => {
		if (!node) return;
		const handler = (e: WheelEvent) => {
			// ctrlKey = trackpad pinch gesture → let OrbitControls handle zoom
			// otherwise = normal scroll → stop propagation so page scrolls instead
			if (!e.ctrlKey) {
				e.stopPropagation();
			}
		};
		node.addEventListener('wheel', handler, { capture: true, passive: true });
		return () => node.removeEventListener('wheel', handler, { capture: true });
	}, []);

	const subtitles: Record<ViewMode, { zh: string; en: string }> = {
		constellation: {
			zh: '以星座圖的方式探索 TAICHI 2026 關注的研究範疇。旋轉、縮放星圖，點選軌道上的標籤查看主題說明。',
			en: 'Explore TAICHI 2026 research areas through a constellation map. Orbit, zoom, and click labels to explore topics.',
		},
		radar: {
			zh: '以雷達軌道視圖呈現研討會主題。標籤環繞中心旋轉，點選可在中央顯示主題詳情。',
			en: 'Conference themes orbit around a radar display. Click any tag to reveal details in the central HUD.',
		},
		grid: {
			zh: '以網格排列瀏覽所有研討會主題，點選展開詳細說明。',
			en: 'Browse all conference topics in a grid layout. Click any card to expand its details.',
		},
	};

	return (
		<div id='themes' className='relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-black px-4 py-24 md:px-20'>
			{/* Background */}
			<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,240,32,0.08),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:auto,100%_28px] opacity-60' />

			{/* Title */}
			<h3 className='relative z-10 mb-4 text-center font-dela text-[28px] tracking-[0.12em] text-[#A8F020] md:text-[40px]'>
				{language === 'zh' ? '研討會主題' : 'Conference Topics'}
			</h3>
			<p className='relative z-10 mb-6 max-w-[760px] text-center font-roboto text-[14px] leading-[22px] text-white/55 md:text-[15px] md:leading-[24px]'>
				{subtitles[viewMode][language]}
			</p>

			{/* View Toggle */}
			<ViewToggle viewMode={viewMode} onChange={handleViewChange} language={language} isMobile={isMobile} />

			{/* ── Constellation View (3D orbit rings) ── */}
			{!isMobile && viewMode === 'constellation' && (
				<div ref={canvasRef} className='relative z-10 w-full' style={{ height: '70vh', minHeight: 500, maxHeight: 800 }}>
					<Canvas camera={{ position: [0, 80, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
						<ambientLight intensity={0.3} />
						<ConstellationScene language={language} selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} controlsRef={orbitControlsRef} />
						<OrbitControls ref={orbitControlsRef} enablePan={false} maxDistance={120} minDistance={25} maxPolarAngle={Math.PI / 2.1} enableZoom={!selectedTheme} />
					</Canvas>
				</div>
			)}

			{/* ── Radar View (2D top-down orbital) ── */}
			{viewMode === 'radar' && (
				<div ref={canvasRef} className='relative z-10 w-full' style={{ height: '70vh', minHeight: 500, maxHeight: 800 }}>
					<Canvas dpr={[1, 2]}>
						<PerspectiveCamera makeDefault position={[0, 22, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={45} />
						<color attach='background' args={[DARK_BG]} />
						<ambientLight intensity={0.5} />
						<Suspense fallback={null}>
							<RadarScene language={language} selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
						</Suspense>
					</Canvas>
					{/* CRT scan-line overlay */}
					<div className="pointer-events-none absolute inset-0 z-20 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
				</div>
			)}

			{/* ── Grid View (2D cards) ── */}
			{viewMode === 'grid' && <GridView language={language} selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />}

			{/* Theme Detail Overlay (Constellation + Radar views) */}
			{viewMode === 'constellation' && (
				<AnimatePresence>{selectedTheme && <ThemeDetailPanel theme={selectedTheme} language={language} onClose={() => setSelectedTheme(null)} />}</AnimatePresence>
			)}
		</div>
	);
}
