import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import NewHeroPage from './NewHeroPage';
import BigBangSvg from './BigBangSvg';
import frameImg from './assets/frame.png';
import frameTopImg from './assets/frame-s-line-top.png';
import frameBottomImg from './assets/frame-s-line-bottom.png';

/**
 * Visual-chair delivered arcade hero (BIG BANG! FUTURES!), ported from the
 * futurethingslab0314/newHeroPage_TAICHI repo as a self-contained component.
 *
 * New brand palette: ORANGE-RED (#FB4105) is the primary, GREEN (#29B93A) is the
 * accent. They are wired to the site's CSS-var brand tokens:
 *   - orange  → --brand-primary
 *   - green   → --brand-secondary
 * The hero refers to colours by their design role (`orange` / `green`) via a
 * single mapping point (readPalette), so the token wiring can't drift.
 *
 * How the design's hardcoded hex are recoloured:
 *   - SVG fills/strokes (orange #FB4105 / green #A8F020, ~550 in the Figma art)
 *     are recoloured via scoped CSS attribute-selector overrides below — the
 *     source hex literals are left untouched (see the <style> in the root).
 *   - Green text (Tailwind `text-[#a8f020]`) was swapped to `text-secondary`.
 *   - JS-driven colours (canvas grid, pixel blocks, inline styles) resolve the
 *     brand tokens at runtime via getComputedStyle (once on mount).
 */

const DESIGN_W = 1920;
const DESIGN_H = 1080;
const MOBILE_BP = 1024; // px — below this renders mobile layout

// ─── Runtime brand palette (reads the --brand-* CSS-var tokens) ───────────────
// Design roles: orange = primary token, green = secondary token.
type Palette = { orange: string; green: string; orangeCh: string; greenCh: string };

const toComma = (channels: string) => channels.trim().replace(/\s+/g, ', ');

function readPalette(el: HTMLElement | null): Palette {
  const cs = el ? getComputedStyle(el) : null;
  const read = (name: string, fallback: string) => {
    const v = cs?.getPropertyValue(name).trim();
    return v && v.length ? v : fallback;
  };
  const orangeCh = toComma(read('--brand-primary', '251 65 5')); // #fb4105
  const greenCh = toComma(read('--brand-secondary', '41 185 58')); // #29b93a
  return { orangeCh, greenCh, orange: `rgb(${orangeCh})`, green: `rgb(${greenCh})` };
}

const PaletteCtx = createContext<Palette>(readPalette(null));
const usePalette = () => useContext(PaletteCtx);

function useResolvedPalette(rootRef: React.RefObject<HTMLElement>): Palette {
  const [pal, setPal] = useState<Palette>(() => readPalette(null));
  useEffect(() => {
    // Resolve the brand tokens once the root is mounted (they cascade from .site-theme).
    setPal(readPalette(rootRef.current));
  }, [rootRef]);
  return pal;
}

// ─── Animated BigBang title (BIG BANG! → FUTURES! sequential entrance) ────────
function BigBangAnimated() {
  const { orangeCh } = usePalette();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow1(true), 300);
    const t2 = setTimeout(() => setShow2(true), 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const tx = 'opacity 0.45s ease-out, transform 0.45s ease-out';

  return (
    <div style={{
      position: 'relative',
      width: 'min(90vw, 520px)',
      filter: `drop-shadow(0 0 18px rgba(${orangeCh}, 0.45))`,
    }}>
      {/* BIG BANG! — top half of SVG, revealed first */}
      <div style={{ clipPath: 'inset(0 0 50% 0)' }}>
        <div style={{ opacity: show1 ? 1 : 0, transform: show1 ? 'none' : 'translateY(18px)', transition: tx }}>
          <BigBangSvg />
        </div>
      </div>

      {/* FUTURES! — bottom half of SVG, absolutely overlaid, revealed second */}
      <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(50% 0 0 0)' }}>
        <div style={{ opacity: show2 ? 1 : 0, transform: show2 ? 'none' : 'translateY(18px)', transition: tx }}>
          <BigBangSvg />
        </div>
      </div>
    </div>
  );
}

// ─── Corner-bracket selector ──────────────────────────────────────────────────
function Bracket({ w, h }: { w: number; h: number }) {
  const { orange } = usePalette();
  const arm = 20;
  const sw = 5;
  const p = sw / 2;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <path d={`M${arm},${p} L${p},${p} L${p},${arm}`}              stroke={orange} strokeWidth={sw} fill='none' strokeLinecap='square' />
      <path d={`M${w - arm},${p} L${w - p},${p} L${w - p},${arm}`}        stroke={orange} strokeWidth={sw} fill='none' strokeLinecap='square' />
      <path d={`M${arm},${h - p} L${p},${h - p} L${p},${h - arm}`}        stroke={orange} strokeWidth={sw} fill='none' strokeLinecap='square' />
      <path d={`M${w - arm},${h - p} L${w - p},${h - p} L${w - p},${h - arm}`} stroke={orange} strokeWidth={sw} fill='none' strokeLinecap='square' />
    </svg>
  );
}

// ─── Characters (pixel sprites; the label always matches the shown image) ─────
const CHARACTERS = [
  { img: '/newhome/explorer.png', name: 'EXPLORER' },
  { img: '/newhome/navigator.png', name: 'NAVIGATOR' },
  { img: '/newhome/observer.png', name: 'OBSERVER' },
  { img: '/newhome/maker.png', name: 'MAKER' },
  { img: '/newhome/designer.png', name: 'DESIGNER' },
  { img: '/newhome/engineer.png', name: 'ENGINEER' },
];

type CharVariant = { img: string; name: string };

// Each slot cycles starting from its own role, so at rest slot i shows CHARACTERS[i]
// (EXPLORER…ENGINEER, left→right) and the label always matches the current sprite.
const ZONE_VARIANTS: CharVariant[][] = CHARACTERS.map((_, i) => [
  CHARACTERS[i],
  CHARACTERS[(i + 1) % CHARACTERS.length],
  CHARACTERS[(i + 2) % CHARACTERS.length],
]);

// Three slots shown on mobile — spread-out roles (Explorer / Navigator / Maker)
const MOBILE_SLOTS = [ZONE_VARIANTS[0], ZONE_VARIANTS[1], ZONE_VARIANTS[3]];

// ─── Web Audio ────────────────────────────────────────────────────────────────
function getCtx(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) ref.current = new AudioContext();
  return ref.current;
}
async function unlockAudio(ref: React.MutableRefObject<AudioContext | null>) {
  const ctx = getCtx(ref);
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}
function beep(ctx: AudioContext, freq: number, delay = 0, dur = 0.07, vol = 0.1) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + dur);
}
function playMove(ctx: AudioContext)  { beep(ctx, 880, 0, 0.05); beep(ctx, 1047, 0.05, 0.06); }
function playCycle(ctx: AudioContext) { beep(ctx, 660, 0, 0.055); }

// ─── Desktop: hover character strip ──────────────────────────────────────────
const CHAR_SLOTS = [
  { cx: 215,  cy: 775, w: 103, h: 110 },
  { cx: 379,  cy: 775, w: 125, h: 110 },
  { cx: 525,  cy: 775, w: 103, h: 110 },
  { cx: 1396, cy: 775, w: 103, h: 110 },
  { cx: 1544, cy: 775, w: 117, h: 110 },
  { cx: 1693, cy: 775, w: 103, h: 110 },
];
const STRIP_L = 130, STRIP_T = 688, STRIP_R = 1780, STRIP_B = 880;

function DesktopCharacterStrip({ scale }: { scale: number }) {
  const { green, greenCh } = usePalette();
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [varIdx, setVarIdx] = useState(0);
  const activeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const startCycle = useCallback((zi: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setVarIdx(v => {
        const next = (v + 1) % ZONE_VARIANTS[zi].length;
        try { playCycle(getCtx(audioRef)); } catch { /**/ }
        return next;
      });
    }, 1400);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / scale + STRIP_L;
    let nearest = 0, minD = Infinity;
    CHAR_SLOTS.forEach((s, i) => { const d = Math.abs(dx - s.cx); if (d < minD) { minD = d; nearest = i; } });
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActiveZone(nearest);
      setVarIdx(0);
      startCycle(nearest);
      void unlockAudio(audioRef).then(ctx => {
        try { playMove(ctx); } catch { /**/ }
      });
    }
  }, [scale, startCycle]);

  const handleMouseLeave = useCallback(() => {
    setActiveZone(null);
    activeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const hovering = activeZone !== null;

  return (
    <div
      style={{ position: 'absolute', left: STRIP_L, top: STRIP_T, width: STRIP_R - STRIP_L, height: STRIP_B - STRIP_T, zIndex: 20, cursor: 'crosshair' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDownCapture={() => { void unlockAudio(audioRef); }}
    >
      {CHAR_SLOTS.map((slot, i) => {
        if (!hovering) return null;
        const isActive = i === activeZone;
        const { img, name } = ZONE_VARIANTS[i][isActive ? varIdx : 0];
        const sl = slot.cx - STRIP_L - slot.w / 2;
        const st = slot.cy - STRIP_T  - slot.h / 2;
        return (
          <div key={i}>
            <div style={{ position: 'absolute', left: sl, top: st, width: slot.w, height: slot.h, background: '#000', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: sl, top: st, width: slot.w, height: slot.h, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isActive ? 1 : 0.35, transition: 'opacity 0.15s', pointerEvents: 'none' }}>
              <img src={img} alt={name} style={{ width: slot.w, height: slot.h, objectFit: 'contain', imageRendering: 'pixelated' }} />
              {isActive && (
                <div style={{ position: 'absolute', inset: -24, pointerEvents: 'none' }}>
                  <Bracket w={slot.w + 48} h={slot.h + 48} />
                </div>
              )}
            </div>
            {isActive && (
              <div style={{ position: 'absolute', left: slot.cx - STRIP_L, top: st + slot.h + 48, transform: 'translateX(-50%)', color: green, fontFamily: "'Source Code Pro', monospace", fontWeight: 400, fontSize: 22, letterSpacing: '0.08em', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: `0 0 14px rgba(${greenCh}, 0.5)` }}>
                {name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared: perspective grid canvas (draws on any size canvas) ───────────────
type GridDensity = { vRails?: number; hRails?: number; numRings?: number; vyFactor?: number };

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, gridCh: string, density: GridDensity = {}) {
  // Rail counts are fixed numbers spread across W/H, so a tall/narrow phone viewport
  // crams the same lines into far less width. Callers pass fewer rails on mobile.
  const { vRails = 11, hRails = 7, numRings = 16, vyFactor = 0.46 } = density;
  const vx = W / 2, vy = H * vyFactor;
  const G = gridCh;
  const CYCLE = 10;

  ctx.clearRect(0, 0, W, H);
  ctx.lineWidth = 0.7;

  function rail(x1: number, y1: number, x2: number, y2: number, op: number) {
    ctx.strokeStyle = `rgba(${G}, ${op})`;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  for (let i = 0; i <= vRails; i++) {
    const ex = (i / vRails) * W;
    rail(vx, vy, ex, 0, 0.045);
    rail(vx, vy, ex, H, 0.045);
  }
  for (let i = 0; i <= hRails; i++) {
    const ey = (i / hRails) * H;
    rail(vx, vy, 0, ey, 0.045);
    rail(vx, vy, W, ey, 0.045);
  }

  for (let i = 0; i < numRings; i++) {
    const d  = ((i / numRings) + t / CYCLE) % 1;
    const de = 1 - Math.pow(1 - d, 2.2);
    const op = Math.pow(de, 1.4) * 0.22;
    const lw = de * 1.4 + 0.4;
    const x1 = vx - de * vx, y1 = vy - de * vy;
    const x2 = vx + de * (W - vx), y2 = vy + de * (H - vy);

    ctx.lineWidth = lw * 2.5;
    ctx.strokeStyle = `rgba(${G}, ${op * 0.3})`;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.lineWidth = lw;
    ctx.strokeStyle = `rgba(${G}, ${op})`;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }
}

// ─── Desktop: fixed-size grid (1920×1080) ─────────────────────────────────────
function DesktopGrid() {
  const { greenCh } = usePalette();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let t = 0, prev = performance.now();
    function frame(now: number) {
      t += (now - prev) / 1000; prev = now;
      drawGrid(ctx, 1920, 1080, t, greenCh);
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [greenCh]);

  return (
    <canvas ref={canvasRef} width={1920} height={1080}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 8, mixBlendMode: 'screen' }} />
  );
}

// ─── Mobile: full-viewport grid ───────────────────────────────────────────────
function MobileGrid() {
  const { greenCh } = usePalette();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0, prev = performance.now();
    function frame(now: number) {
      t += (now - prev) / 1000; prev = now;
      // Fewer rails/rings so the tall phone viewport reads roomy like desktop. The
      // rings' left/right edges pile up against the narrow sides, so keep the ring
      // count low; vertical rails also fan across the narrow width, so keep them few.
      drawGrid(ctx, canvas.width, canvas.height, t, greenCh, { vRails: 3, hRails: 4, numRings: 6, vyFactor: 0.4 });
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [greenCh]);

  return (
    <canvas ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: 'screen' }} />
  );
}

// ─── Mobile: 3-slot auto-rotating character carousel ─────────────────────────
function MobileCarousel() {
  const { green, greenCh } = usePalette();
  const [varIdxs, setVarIdxs] = useState([0, 0, 0]);
  const [selected, setSelected] = useState(1); // centre slot default
  const audioRef = useRef<AudioContext | null>(null);

  // Each slot cycles its own variants independently (staggered timing)
  useEffect(() => {
    const timers = MOBILE_SLOTS.map((variants, i) =>
      setInterval(() => {
        setVarIdxs(prev => {
          const next = [...prev];
          next[i] = (next[i] + 1) % variants.length;
          return next;
        });
      }, 1400 + i * 320)
    );
    return () => timers.forEach(clearInterval);
  }, []);

  // Bracket auto-moves left → centre → right → left every 3 s
  useEffect(() => {
    const timer = setInterval(() => {
      setSelected(s => {
        const next = (s + 1) % 3;
        try { playCycle(getCtx(audioRef)); } catch { /**/ }
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const SZ   = Math.min(Math.round(window.innerWidth * 0.22), 120); // char size
  const BPAD = 18;

  return (
    <div
      style={{ width: '100%', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
      onPointerDownCapture={() => { void unlockAudio(audioRef); }}
    >
      <div style={{ display: 'flex', gap: 'clamp(1.5rem, 6vw, 3rem)', alignItems: 'flex-end' }}>
        {MOBILE_SLOTS.map((variants, i) => {
          const { img, name } = variants[varIdxs[i]];
          const isSelected = i === selected;
          return (
            <div key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', cursor: 'pointer' }}
              onClick={() => {
                setSelected(i);
                void unlockAudio(audioRef).then(ctx => {
                  try { playMove(ctx); } catch { /**/ }
                });
              }}
            >
              <div style={{ position: 'relative', width: SZ, height: SZ, opacity: isSelected ? 1 : 0.35, transition: 'opacity 0.2s' }}>
                <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }} />
                {isSelected && (
                  <div style={{ position: 'absolute', inset: -BPAD, pointerEvents: 'none' }}>
                    <Bracket w={SZ + BPAD * 2} h={SZ + BPAD * 2} />
                  </div>
                )}
              </div>
              <div style={{
                color: isSelected ? green : 'transparent',
                fontFamily: "'Source Code Pro', monospace",
                fontSize: 'clamp(0.65rem, 3vw, 0.875rem)',
                letterSpacing: '0.1em',
                textShadow: isSelected ? `0 0 10px rgba(${greenCh}, 0.5)` : 'none',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
                minHeight: '1.2em',
                marginTop: BPAD + 8,
              }}>
                {name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile layout ────────────────────────────────────────────────────────────
function MobileView({ navH }: { navH: number }) {
  const { green, greenCh } = usePalette();
  return (
    <div style={{ width: '100%', minHeight: '100dvh', paddingTop: navH, boxSizing: 'border-box', background: '#000', overflowX: 'hidden', overflowY: 'auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Animated grid — behind everything */}
      <MobileGrid />

      {/* Top frame strip — pinned just below the fixed navbar */}
      <img
        src={frameTopImg}
        alt=''
        style={{ position: 'absolute', top: navH, left: 0, width: '100%', height: 'auto', pointerEvents: 'none', zIndex: 30 }}
      />

      {/* Bottom frame strip — pinned to bottom of viewport */}
      <img
        src={frameBottomImg}
        alt=''
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'auto', pointerEvents: 'none', zIndex: 30 }}
      />

      {/* Content block */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6% 5%' }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Title — animated entrance */}
          <BigBangAnimated />

          {/* Event info */}
          <div style={{ marginTop: 'clamp(1.5rem, 5vw, 3rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              color: green,
              fontFamily: "'Source Code Pro', monospace",
              fontWeight: 600,
              fontSize: 'clamp(1rem, 5vw, 2rem)',
              letterSpacing: '0.12em',
              textShadow: `0 0 16px rgba(${greenCh}, 0.4)`,
            }}>
              TAICHI26
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: green, fontFamily: "'Source Code Pro', monospace" }}>
              <span style={{ fontSize: 'clamp(0.7rem, 3vw, 1rem)', opacity: 0.7 }}>2026</span>
              <span style={{ fontSize: 'clamp(1.4rem, 6vw, 2.4rem)', fontWeight: 600 }}>8.05</span>
              <svg width='32' height='14' viewBox='0 0 58 16' fill='none'>
                <path d='M2 14H56L44 2' stroke={green} strokeWidth='4' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              <span style={{ fontSize: 'clamp(1.4rem, 6vw, 2.4rem)', fontWeight: 600 }}>8.06</span>
            </div>
          </div>

          {/* Character carousel — directly below date info */}
          <div style={{ marginTop: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            <MobileCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Animated pixel blocks ───────────────────────────────────────────────────
// Pool of candidate slots on each side — x/y in design coordinates (1920×1080).
// Columns align with the original Figma green squares (64 px each).
const BLOCK_SZ = 51; // 64 × 0.8
const LEFT_POOL = [
  { x: 90,  y: 289 }, { x: 90,  y: 417 }, { x: 90,  y: 545 },
  { x: 154, y: 353 }, { x: 154, y: 481 }, { x: 154, y: 609 },
  { x: 218, y: 289 }, { x: 218, y: 417 }, { x: 218, y: 545 },
];
const RIGHT_POOL = [
  { x: 1666, y: 289 }, { x: 1666, y: 417 }, { x: 1666, y: 545 },
  { x: 1739, y: 353 }, { x: 1739, y: 481 }, { x: 1739, y: 609 },
  { x: 1803, y: 289 }, { x: 1803, y: 417 }, { x: 1803, y: 545 },
];
const ALL_SLOTS = [...LEFT_POOL, ...RIGHT_POOL];

// colorIdx 0 = green, 1 = orange (matches the original design's two block colours)
type BlockState = { active: boolean; colorIdx: 0 | 1 };

function randomBlocks(): BlockState[] {
  return ALL_SLOTS.map(() => ({
    active: Math.random() < 0.45,
    colorIdx: (Math.random() < 0.5 ? 0 : 1) as 0 | 1,
  }));
}

function PixelBlocks() {
  const { orange, green } = usePalette();
  const palette = [green, orange] as const; // [0]=green, [1]=orange
  const [blocks, setBlocks] = useState<BlockState[]>(() => randomBlocks());

  useEffect(() => {
    const id = setInterval(() => setBlocks(randomBlocks()), 3_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
      {ALL_SLOTS.map((slot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: slot.x,
            top: slot.y,
            width: BLOCK_SZ,
            height: BLOCK_SZ,
            background: palette[blocks[i].colorIdx],
            opacity: blocks[i].active ? 1 : 0,
            transition: 'opacity 0.6s ease, background 0.6s ease',
          }}
        />
      ))}
    </div>
  );
}

// ─── Desktop layout (scaled Figma design) ───────────────────────────────────
function DesktopView({ scale, navH }: { scale: number; navH: number }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '100dvh', overflowX: 'hidden', overflowY: 'auto', background: '#000' }}>
      <div style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}>
        {/* Everything sits in the region below the fixed navbar so the cabinet isn't clipped. */}
        <div style={{ position: 'absolute', top: navH, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          <img
            src={frameImg}
            alt=''
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', zIndex: 30 }}
          />
          <div style={{
            position: 'absolute',
            width: DESIGN_W,
            height: DESIGN_H,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center',
          }}>
            <NewHeroPage />
            <DesktopGrid />
            <PixelBlocks />
            <DesktopCharacterStrip scale={scale} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NewArcadeHero — detects breakpoint and routes layouts ────────────────────
export default function NewArcadeHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const palette = useResolvedPalette(rootRef);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BP);
  const [navH, setNavH] = useState(0);
  const [scale, setScale] = useState(() => Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H));

  useEffect(() => {
    const update = () => {
      // The site navbar is position:fixed and overlays the top; reserve its height
      // so the full arcade cabinet sits below it instead of being clipped.
      const el = document.querySelector('.ds-nav-shell') as HTMLElement | null;
      const nav = el ? el.getBoundingClientRect().height : 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      setNavH(nav);
      setIsMobile(w < MOBILE_BP);
      setScale(Math.min(w / DESIGN_W, (h - nav) / DESIGN_H));
    };
    update();
    window.addEventListener('resize', update);
    // Nav height can settle after fonts / submenu render — re-measure shortly after mount.
    const t = window.setTimeout(update, 300);
    return () => { window.removeEventListener('resize', update); window.clearTimeout(t); };
  }, []);

  return (
    <div ref={rootRef} className='nh2-root' style={{ width: '100%', height: '100%', minHeight: '100dvh' }}>
      {/* Recolour the design's hardcoded SVG paints to the site brand tokens.
          orange (#FB4105) → --brand-primary; green (#A8F020) → --brand-secondary.
          Presentation attributes are overridden by these author rules (var() is
          valid here because it's a CSS rule, not an SVG attribute). */}
      <style>{`
        .nh2-root [fill="#FB4105"],
        .nh2-root [fill="var(--fill-0, #FB4105)"] { fill: rgb(var(--brand-primary)); }
        .nh2-root [stroke="var(--stroke-0, #A8F020)"] { stroke: rgb(var(--brand-secondary)); }
      `}</style>
      <PaletteCtx.Provider value={palette}>
        {isMobile ? <MobileView navH={navH} /> : <DesktopView scale={scale} navH={navH} />}
      </PaletteCtx.Provider>
    </div>
  );
}
