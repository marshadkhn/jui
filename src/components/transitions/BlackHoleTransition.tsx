'use client';

import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

// 🛑 GLOBAL MASTER TOGGLE: Set to false to disable all transitions for testing, true to enable
export const ENABLE_BLACKHOLE_TRANSITIONS = false;

export interface BlackHoleTransitionRef {
  trigger: (onMidpoint?: () => void) => Promise<void>;
  triggerEntry: () => void;
  triggerExit: () => void;
  setProgress: (suctionProgress: number, blackoutProgress: number) => void;
}

interface BlackHoleTransitionProps {
  onComplete?: () => void;
}

// ----------------------------------------------------------------------
// High-Definition Texture Sprites Generator
// ----------------------------------------------------------------------

const createBarcodeTexture = (
  width: number,
  height: number,
  customNum?: string,
  denseBars = false
): HTMLCanvasElement => {
  const dpr = 2;
  const off = document.createElement('canvas');
  off.width = width * dpr;
  off.height = height * dpr;
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  ctx.scale(dpr, dpr);

  ctx.fillStyle = 'rgba(0, 155, 255, 0.95)';
  ctx.shadowColor = '#00d4ff';
  ctx.shadowBlur = 10;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000814';
  let x = 6;
  const barPattern = denseBars
    ? [2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 1, 2, 3, 1, 2]
    : [3, 1, 4, 2, 5, 2, 1, 3, 2, 4, 1, 5, 3, 2, 4, 2, 1, 4, 3, 2, 5, 1, 3, 4];
  let pIdx = 0;
  while (x < width - 8) {
    const w = barPattern[pIdx % barPattern.length];
    pIdx++;
    ctx.fillRect(x, 3, w, height - 15);
    x += w + ((pIdx % 3) + (denseBars ? 1 : 2));
  }

  ctx.fillStyle = 'rgba(0, 235, 255, 0.98)';
  ctx.font = '700 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(customNum || '* 1 2 3 4 5 6 7 8 9 0 *', width / 2, height - 2);

  return off;
};

const createAlphabetBlockTexture = (lines: string[], fontSize = 20, width = 230): HTMLCanvasElement => {
  const dpr = 2;
  const off = document.createElement('canvas');
  const height = lines.length * (fontSize * 1.35) + 12;
  off.width = width * dpr;
  off.height = height * dpr;
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  ctx.scale(dpr, dpr);
  ctx.font = `700 ${fontSize}px "Courier New", monospace, sans-serif`;
  ctx.fillStyle = '#00d4ff';
  ctx.shadowColor = '#00bfff';
  ctx.shadowBlur = 14;
  ctx.textBaseline = 'top';
  ctx.letterSpacing = '3px';

  lines.forEach((line, i) => {
    ctx.fillText(line, 4, i * (fontSize * 1.35) + 4);
  });

  return off;
};

const createDevanagariBlockTexture = (rows: string[], fontSize = 22, width = 280): HTMLCanvasElement => {
  const dpr = 2;
  const off = document.createElement('canvas');
  const height = rows.length * (fontSize * 1.42) + 12;
  off.width = width * dpr;
  off.height = height * dpr;
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  ctx.scale(dpr, dpr);
  ctx.font = `700 ${fontSize}px "Noto Sans Devanagari", "Courier New", monospace, sans-serif`;
  ctx.fillStyle = '#00d4ff';
  ctx.shadowColor = '#00a2ff';
  ctx.shadowBlur = 14;
  ctx.textBaseline = 'top';

  rows.forEach((row, i) => {
    ctx.fillText(row, 4, i * (fontSize * 1.42) + 4);
  });

  return off;
};

const createNumberStackTexture = (lines: string[], width = 210, fontSize = 15): HTMLCanvasElement => {
  const dpr = 2;
  const off = document.createElement('canvas');
  const height = lines.length * (fontSize * 1.35) + 10;
  off.width = width * dpr;
  off.height = height * dpr;
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  ctx.scale(dpr, dpr);
  ctx.font = `700 ${fontSize}px monospace`;
  ctx.fillStyle = '#00d4ff';
  ctx.shadowColor = '#0088ff';
  ctx.shadowBlur = 10;
  ctx.textBaseline = 'top';

  lines.forEach((l, i) => {
    ctx.fillText(l, 2, i * (fontSize * 1.35) + 2);
  });

  return off;
};

// ----------------------------------------------------------------------
// 3D Helical Cylinder Vortex Particle Definition (Zero-Overlap Inward Stream)
// ----------------------------------------------------------------------
// Helper: Pre-Render Glowing Text Sprite for Zero-Lag GPU Blitting
const createTextSprite = (text: string, font: string, color: string): HTMLCanvasElement => {
  const off = document.createElement('canvas');
  const dpr = 2; // High-DPI crispness
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width) + 20;
  const fontSize = parseInt(font.match(/\d+/) ? font.match(/\d+/)![0] : '36', 10);
  const textHeight = Math.ceil(fontSize * 1.5) + 20;

  off.width = textWidth * dpr;
  off.height = textHeight * dpr;

  ctx.scale(dpr, dpr);
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow layer
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillText(text, textWidth / 2, textHeight / 2);

  // Bright core layer
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.85;
  ctx.fillText(text, textWidth / 2, textHeight / 2);

  return off;
};

interface CyberHelicalElement {
  id: number;
  lane: number;
  texture: HTMLCanvasElement;
  baseAngle: number;
  u: number;
  speed: number;
  cylinderRadius: number;
  baseScale: number;
  opacity: number;
}

interface StarStreakHelical {
  baseAngle: number;
  u: number;
  speed: number;
  cylinderRadius: number;
  size: number;
  length: number;
  color: string;
}

export const BlackHoleTransition = forwardRef<BlackHoleTransitionRef, BlackHoleTransitionProps>(
  ({ onComplete }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animSuction = useRef(0);
    const animBlackout = useRef(0);
    const targetSuction = useRef(0);
    const targetBlackout = useRef(0);
    const reqIdRef = useRef<number | null>(null);

    const textureCache = useRef<Record<string, HTMLCanvasElement>>({});
    const cyberElementsRef = useRef<CyberHelicalElement[]>([]);
    const starStreaksRef = useRef<StarStreakHelical[]>([]);

    const initHelicalVortexField = useCallback((w: number, h: number) => {
      // 1. Build Pre-Rendered High-Def Barcode and Text Sprites
      if (Object.keys(textureCache.current).length === 0) {
        const cache: Record<string, HTMLCanvasElement> = {
          barcode_1: createBarcodeTexture(260, 85, '45687214564578'),
          barcode_2: createBarcodeTexture(220, 75, '0325918671539'),
          barcode_3: createBarcodeTexture(240, 80, '6198752130467'),
          barcode_4: createBarcodeTexture(280, 95, '8745120032166', true),
          barcode_5: createBarcodeTexture(200, 70, '1256897420136'),
          barcode_6: createBarcodeTexture(160, 58, '34B2EE579'),
          barcode_7: createBarcodeTexture(130, 48, '3A4D8F19B')
        };

        const allStrings = [
          '3A4D8F19B', '7C0B2E5F3', '3A7D8F19B', '34B2EE579', '0325918671539',
          '6198752130467', '8745120032166', '1256897420136', '45687214564578',
          'AX 9', 'QY 4', 'R 7 G', 'H 8', 'D4 58', 'B 83', '0123456789',
          '698765432105', '01225566899', '82933556668H', '235666631', '33831131315',
          '2.58919000', '1233566799', 'ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ',
          '7', '9', '3', '8', '6', '4', '5', '2', '0', '1', 'P', 'C', 'A', 'B', 'F', 'H', 'Z', 'E',
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
          '8.3', 'F3', 'B2', 'S', 'R3', '13', '42', 'E3', '55', '99', '88', '73', '01'
        ];

        allStrings.forEach((str) => {
          const isBig = str.length > 5 || ['7', '9', '3', '8', '6'].includes(str);
          const font = isBig ? '900 52px monospace' : '800 32px monospace';
          cache[`txt_${str}`] = createTextSprite(str, font, '#00f0ff');
        });

        textureCache.current = cache;
      }

      const rayCodeKeys = ['3A4D8F19B', '7C0B2E5F3', '3A7D8F19B', '34B2EE579', '0325918671539', '6198752130467', '8745120032166', '1256897420136'];
      const interRayKeys = ['3A4D8F19B', '7C0B2E5F3', '34B2EE579', '0325918671539', '8745120032166', '6198752130467', 'AX 9', 'QY 4', 'R 7 G', 'H 8', 'D4 58', 'B 83', '0123456789', '698765432105'];
      const bigGlyphKeys = ['7', '9', '3', '8', '6', '4', '5', '2', '0', '1', 'P', 'C', 'A', 'B', 'F', 'H', 'Z', 'E'];
      const microKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'Z', 'H', 'P', 'R', '8.3', 'F3', 'B2', 'S', 'R3', '13', '42'];
      const barcodeKeys = ['barcode_1', 'barcode_2', 'barcode_3', 'barcode_4', 'barcode_5', 'barcode_6', 'barcode_7'];

      const elements: CyberHelicalElement[] = [];
      let elId = 0;
      const maxScreenRadius = Math.max(w, h) * 0.72;

      // 2. 24 Primary Highlighted Ray Beams with Staggered Inward Flow
      const NUM_RAYS = 24;
      for (let r = 0; r < NUM_RAYS; r++) {
        const rayAngle = (r / NUM_RAYS) * Math.PI * 2;
        const key = rayCodeKeys[r % rayCodeKeys.length];
        const tex = textureCache.current[`txt_${key}`];
        if (!tex) continue;

        const uOffsets = [0.08, 0.28, 0.48, 0.68, 0.88];
        uOffsets.forEach((uStart) => {
          elements.push({
            id: elId++,
            lane: r,
            texture: tex,
            baseAngle: rayAngle,
            u: uStart,
            speed: 0.18,
            cylinderRadius: maxScreenRadius,
            baseScale: 1.5,
            opacity: 0.98
          });
        });
      }

      // 3. Dense Inter-Ray Gap Streams (48 Sub-Lanes packing the gaps)
      const NUM_GAP_LANES = 48;
      for (let g = 0; g < NUM_GAP_LANES; g++) {
        const gapAngle = (g / NUM_GAP_LANES) * Math.PI * 2 + (Math.PI / NUM_GAP_LANES);
        const uOffsets = g % 2 === 0 ? [0.12, 0.36, 0.60, 0.84] : [0.24, 0.48, 0.72, 0.94];

        uOffsets.forEach((uStart, i) => {
          const itemType = (g + i) % 5;
          let tex: HTMLCanvasElement;
          if (itemType === 0) {
            tex = textureCache.current[barcodeKeys[(g + i) % barcodeKeys.length]];
          } else if (itemType === 1 || itemType === 2) {
            const key = interRayKeys[(g * 3 + i) % interRayKeys.length];
            tex = textureCache.current[`txt_${key}`] || textureCache.current[`txt_3A4D8F19B`];
          } else {
            const glyph = bigGlyphKeys[(g * 2 + i) % bigGlyphKeys.length];
            tex = textureCache.current[`txt_${glyph}`] || textureCache.current[`txt_7`];
          }

          if (tex) {
            elements.push({
              id: elId++,
              lane: g + 100,
              texture: tex,
              baseAngle: gapAngle,
              u: uStart,
              speed: 0.18,
              cylinderRadius: maxScreenRadius * (0.85 + (g % 4) * 0.05),
              baseScale: 1.25,
              opacity: 0.95
            });
          }
        });
      }

      // 4. Dense Floating Field of 300+ Micro & Medium Data Particles in all gaps
      for (let m = 0; m < 300; m++) {
        const randAngle = Math.random() * Math.PI * 2;
        const randRadius = maxScreenRadius * (0.35 + Math.random() * 0.75);
        const randU = Math.random();
        const isSingleDigit = m % 3 === 0;

        let tex: HTMLCanvasElement;
        if (isSingleDigit) {
          const digit = bigGlyphKeys[m % bigGlyphKeys.length];
          tex = textureCache.current[`txt_${digit}`] || textureCache.current[`txt_7`];
        } else {
          const microKey = microKeys[m % microKeys.length];
          tex = textureCache.current[`txt_${microKey}`] || textureCache.current[`txt_0`];
        }

        if (tex) {
          elements.push({
            id: elId++,
            lane: m + 200,
            texture: tex,
            baseAngle: randAngle,
            u: randU,
            speed: 0.16 + (m % 5) * 0.01,
            cylinderRadius: randRadius,
            baseScale: isSingleDigit ? 1.0 : 0.75,
            opacity: 0.92
          });
        }
      }

      cyberElementsRef.current = elements;

      // 5. 550 Cosmic Laser Perspective Speed Streaks
      const streaks: StarStreakHelical[] = [];
      const starColors = ['#00f0ff', '#38bdf8', '#00e5ff', '#ffffff', '#00bfff'];
      for (let i = 0; i < 550; i++) {
        streaks.push({
          baseAngle: Math.random() * Math.PI * 2,
          u: Math.random(),
          speed: 0.22 + (i % 4) * 0.03,
          cylinderRadius: maxScreenRadius * (0.3 + (i % 5) * 0.15),
          size: 1.2,
          length: 16 + (i % 3) * 6,
          color: starColors[i % starColors.length]
        });
      }
      starStreaksRef.current = streaks;
    }, []);

    // ------------------------------------------------------------------
    // Main True 3D Black Hole Perspective Render Loop (Buttery Smooth 120 FPS)
    // ------------------------------------------------------------------
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initHelicalVortexField(width, height);
      };

      window.addEventListener('resize', handleResize);
      initHelicalVortexField(width, height);

      let lastTime = performance.now();

      const render = (now: number) => {
        try {
          const rawDt = (now - lastTime) / 1000;
          const dt = Math.min(0.033, Math.max(0.001, rawDt));
          lastTime = now;

          // Framerate-independent smooth exponential follow
          const followFactor = 1 - Math.exp(-22 * dt);
          animBlackout.current += (targetBlackout.current - animBlackout.current) * followFactor;
          animSuction.current += (targetSuction.current - animSuction.current) * followFactor;

          const s = animSuction.current;
          const b = animBlackout.current;

          if (b <= 0.005 && targetBlackout.current === 0) {
            ctx.clearRect(0, 0, width, height);
            reqIdRef.current = requestAnimationFrame(render);
            return;
          }

          ctx.clearRect(0, 0, width, height);

          // Deep Cosmic Pitch-Black Backdrop
          const bgAlpha = Math.min(1, b * 4.0);
          ctx.fillStyle = `rgba(0, 2, 8, ${bgAlpha})`;
          ctx.fillRect(0, 0, width, height);

          const cx = width / 2;
          const cy = height / 2;
          // Natural black hole gap radius (visible open void, not a microscopic pinhole)
          const blackHoleRadius = Math.min(width, height) * 0.038 * (1.0 + s * 0.25);

          const inwardSpeedMultiplier = 1.0 + s * 4.2;
          const baseAlphaMultiplier = Math.min(1, b * 3.2);

          // -----------------------------------------------------------
          // STEP 1: Cosmic Speed Streaks Gliding Inward
          // -----------------------------------------------------------
          ctx.lineWidth = 1.2;
          const streaks = starStreaksRef.current;
          const streakCount = streaks.length;

          for (let i = 0; i < streakCount; i++) {
            const st = streaks[i];
            st.u += st.speed * inwardSpeedMultiplier * dt;
            if (st.u >= 1.0) st.u -= 1.0;

            const progress = st.u;
            // Smooth glide towards black hole void boundary
            const r = blackHoleRadius + Math.pow(1.0 - progress, 1.2) * (st.cylinderRadius - blackHoleRadius);

            const px = cx + Math.cos(st.baseAngle) * r;
            const py = cy + Math.sin(st.baseAngle) * r * 0.88;

            if (px < -60 || px > width + 60 || py < -60 || py > height + 60) continue;

            const inwardAngle = Math.atan2(cy - py, cx - px);
            const streakLen = Math.max(2.0, (st.length + s * 30) * Math.pow(1.0 - progress, 0.8));

            // Dissolve smoothly right as it reaches the black hole event horizon
            const horizonFade = Math.min(1.0, Math.max(0.0, (r - blackHoleRadius) / 22));
            const alpha = horizonFade * Math.min(1.0, (1.0 - progress) / 0.08) * baseAlphaMultiplier;
            if (alpha <= 0.01) continue;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(inwardAngle);
            ctx.strokeStyle = st.color;
            ctx.globalAlpha = alpha;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(streakLen, 0);
            ctx.stroke();
            ctx.restore();
          }

          // -----------------------------------------------------------
          // STEP 2: Ultra-Dense Pre-Cached GPU Sprite Streams (Plunging into Black Hole Gap)
          // -----------------------------------------------------------
          const elements = cyberElementsRef.current;
          const elementCount = elements.length;

          for (let i = 0; i < elementCount; i++) {
            const el = elements[i];
            el.u += el.speed * inwardSpeedMultiplier * dt;
            if (el.u >= 1.0) el.u -= 1.0;

            const progress = el.u;
            // Smooth inward plunge to the black hole void boundary
            const r = blackHoleRadius + Math.pow(1.0 - progress, 1.25) * (el.cylinderRadius - blackHoleRadius);

            const px = cx + Math.cos(el.baseAngle) * r;
            const py = cy + Math.sin(el.baseAngle) * r * 0.88;

            if (px < -260 || px > width + 260 || py < -260 || py > height + 260) continue;

            const inwardAngle = Math.atan2(cy - py, cx - px);
            const scaleFactor = Math.max(0.18, Math.pow(1.0 - progress, 0.85)) * el.baseScale * (1.0 - s * 0.35);

            // Dissolve smoothly as it crosses into the black hole gap
            const horizonFade = Math.min(1.0, Math.max(0.0, (r - blackHoleRadius) / 30));
            const alpha = el.opacity * horizonFade * Math.min(1.0, (1.0 - progress) / 0.08) * baseAlphaMultiplier;
            if (alpha <= 0.01) continue;

            const tex = el.texture;
            const drawW = (tex.width / 2) * scaleFactor;
            const drawH = (tex.height / 2) * scaleFactor;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(inwardAngle);
            ctx.globalAlpha = alpha;
            ctx.drawImage(tex, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          }

          // -----------------------------------------------------------
          // STEP 3: Natural Soft Black Hole Singularity Void Core
          // -----------------------------------------------------------
          const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, blackHoleRadius * 1.05);
          voidGrad.addColorStop(0, '#000000');
          voidGrad.addColorStop(0.85, 'rgba(0, 1, 4, 0.98)');
          voidGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = voidGrad;
          ctx.fillRect(0, 0, width, height);

          if (b >= 0.98) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.restore();
        } catch (err) {
          console.warn('[BlackHoleTransition] Render loop warning:', err);
        }

        reqIdRef.current = requestAnimationFrame(render);
      };

      reqIdRef.current = requestAnimationFrame(render);

      return () => {
        if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
        window.removeEventListener('resize', handleResize);
      };
    }, [initHelicalVortexField, onComplete]);

    // ------------------------------------------------------------------
    // Imperative Transition Controls
    // ------------------------------------------------------------------
    useImperativeHandle(ref, () => ({
      setProgress: (suctionProgress: number, blackoutProgress: number) => {
        if (!ENABLE_BLACKHOLE_TRANSITIONS) {
          targetSuction.current = 0;
          targetBlackout.current = 0;
          return;
        }
        targetSuction.current = Math.max(0, Math.min(1, suctionProgress));
        targetBlackout.current = Math.max(0, Math.min(1, blackoutProgress));
      },
      trigger: (onMidpoint?: () => void) => {
        if (!ENABLE_BLACKHOLE_TRANSITIONS) {
          if (onMidpoint) onMidpoint();
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          targetSuction.current = 1.0;
          targetBlackout.current = 1.0;
          setTimeout(() => {
            if (onMidpoint) onMidpoint();
            targetBlackout.current = 0.0;
            targetSuction.current = 0.0;
            resolve();
          }, 650);
        });
      },
      triggerEntry: () => {
        if (!ENABLE_BLACKHOLE_TRANSITIONS) return;
        targetSuction.current = 1.0;
        targetBlackout.current = 1.0;
      },
      triggerExit: () => {
        targetBlackout.current = 0.0;
        targetSuction.current = 0.0;
      }
    }));

    if (!ENABLE_BLACKHOLE_TRANSITIONS) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center bg-transparent overflow-hidden select-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>
    );
  }
);

BlackHoleTransition.displayName = 'BlackHoleTransition';
export default BlackHoleTransition;
