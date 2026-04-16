/**
 * Performance tier detection.
 *
 * Three-level system so the hero animations gracefully degrade on weaker
 * hardware without nuking the visual on capable machines.
 *
 *   full   — desktop / fast laptop with discrete or modern integrated GPU.
 *   medium — older laptop, mid-range mobile, software-suspected GPU.
 *            ⇒ Three.js scene scaled down, simpler fragment shader,
 *              lower pixel grid resolution for the hero reveal.
 *   lite   — software renderer (SwiftShader / llvmpipe), 2-core box,
 *            Save-Data on, or user override.
 *            ⇒ Three.js skipped entirely, static AVIF fallback.
 */

export type PerformanceTier = 'full' | 'medium' | 'lite';

const LITE_KEY = 'taichi:low_perf_mode';
const MEDIUM_KEY = 'taichi:medium_perf_mode';

let cachedTier: PerformanceTier | null = null;
const tierListeners = new Set<(tier: PerformanceTier) => void>();

const TIER_RANK: Record<PerformanceTier, number> = { full: 0, medium: 1, lite: 2 };

/** Returns the cached tier or computes it once on first call. */
export const detectPerformanceTier = (): PerformanceTier => {
	if (cachedTier) return cachedTier;
	cachedTier = computeTier();
	return cachedTier;
};

/** Subscribe to tier changes (e.g. runtime auto-degrade). Returns unsubscribe. */
export const onTierChange = (listener: (tier: PerformanceTier) => void) => {
	tierListeners.add(listener);
	return () => tierListeners.delete(listener);
};

/** Force-degrade tier at runtime if a worse tier than current is requested. */
export const degradeTier = (target: PerformanceTier, persist: boolean = true) => {
	const current = detectPerformanceTier();
	if (TIER_RANK[target] <= TIER_RANK[current]) return;
	cachedTier = target;
	if (persist) {
		try {
			if (target === 'lite') window.localStorage?.setItem(LITE_KEY, '1');
			else if (target === 'medium') window.localStorage?.setItem(MEDIUM_KEY, '1');
		} catch {
			// ignore storage errors
		}
	}
	tierListeners.forEach((fn) => fn(target));
};

const computeTier = (): PerformanceTier => {
	if (typeof window === 'undefined') return 'full';

	// 1) explicit overrides (URL flag / localStorage)
	try {
		const params = new URLSearchParams(window.location.search);
		const perfFlag = params.get('perf');
		if (perfFlag === 'lite' || perfFlag === 'medium' || perfFlag === 'full') return perfFlag;
		if (params.get('lite') === '1') return 'lite';
		if (window.localStorage?.getItem(LITE_KEY) === '1') return 'lite';
		if (window.localStorage?.getItem(MEDIUM_KEY) === '1') return 'medium';
	} catch {
		// ignore storage errors
	}

	// 2) network / data-saver hints → lite
	const connection = (navigator as Navigator & {
		connection?: { saveData?: boolean; effectiveType?: string };
	}).connection;
	if (connection?.saveData) return 'lite';
	if (connection?.effectiveType && /^(slow-2g|2g)$/i.test(connection.effectiveType)) return 'lite';
	if (window.matchMedia?.('(prefers-reduced-data: reduce)').matches) return 'lite';

	// 3) GPU renderer sniff — software renderers cannot drive the shader
	try {
		const probeCanvas = document.createElement('canvas');
		const gl = (probeCanvas.getContext('webgl') ||
			probeCanvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
		if (!gl) return 'lite';
		const ext = gl.getExtension('WEBGL_debug_renderer_info');
		const renderer: string = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
		// software renderers
		if (/SwiftShader|llvmpipe|Software|Microsoft Basic|Mesa Offscreen/i.test(renderer)) return 'lite';
		// very old Intel iGPUs – treat as medium
		if (/Intel.*HD Graphics (3000|4000|2500|2000|1000)/i.test(renderer)) return 'medium';
		// Adreno < 5xx, Mali-T6/T7 generation – treat as medium
		if (/Adreno \(TM\) [1-4]\d{2}\b|Mali-T[67]\d{2}/i.test(renderer)) return 'medium';
	} catch {
		// ignore probe errors
	}

	// 4) coarse hardware capacity
	const cores = navigator.hardwareConcurrency || 4;
	const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
	const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

	if (cores <= 2 || memory <= 2) return 'lite';
	if (cores <= 4 || memory <= 4) return 'medium';
	if (isMobile && cores <= 6) return 'medium';

	return 'full';
};

/**
 * Watch the main thread for sustained long tasks during the first few seconds.
 * If we blow the budget the user gets demoted one tier and we persist the
 * choice for next visit so they don't have to suffer the same hiccup twice.
 *
 * Call this once on app start.
 */
export const installLongTaskAutoDemote = (
	options: { windowMs?: number; longTaskMs?: number; budget?: number } = {},
) => {
	if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;
	const { windowMs = 5000, longTaskMs = 150, budget = 4 } = options;
	const start = performance.now();
	let count = 0;
	let observer: PerformanceObserver | null = null;
	try {
		observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.duration >= longTaskMs) count += 1;
				if (count >= budget) {
					const current = detectPerformanceTier();
					const next: PerformanceTier =
						current === 'full' ? 'medium' : current === 'medium' ? 'lite' : 'lite';
					degradeTier(next, true);
					observer?.disconnect();
					observer = null;
					break;
				}
			}
			if (performance.now() - start > windowMs) {
				observer?.disconnect();
				observer = null;
			}
		});
		observer.observe({ entryTypes: ['longtask'] });
	} catch {
		observer = null;
	}
};

/** Reset (used by tests or QA tooling). */
export const __resetTierForTest = () => {
	cachedTier = null;
	tierListeners.clear();
};
