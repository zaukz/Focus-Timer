import { useEffect, useRef } from 'react';
import { SCENES } from '../lib/constants';
import type { SceneId } from '../types';

type SpriteName = 'cool' | 'star';

const SPRITE_COLORS: Record<SpriteName, string> = {
  cool: '176,208,238',
  star: '236,242,255',
};

const spriteCache = new Map<SpriteName, HTMLCanvasElement>();

// These scenes have no particle canvas: flat colors or a quiet gradient.
const NO_CANVAS_SCENES: SceneId[] = [
  'minimal',
  ...SCENES.filter((scene) => scene.group === 'simple').map((scene) => scene.id),
];

function sprite(name: SpriteName): HTMLCanvasElement {
  const cached = spriteCache.get(name);
  if (cached) return cached;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const rgb = SPRITE_COLORS[name];
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, `rgba(${rgb},1)`);
    gradient.addColorStop(0.22, `rgba(${rgb},0.55)`);
    gradient.addColorStop(0.55, `rgba(${rgb},0.12)`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  spriteCache.set(name, canvas);
  return canvas;
}

export function AmbientCanvas({ scene, intensity }: { scene: SceneId; intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    if (NO_CANVAS_SCENES.includes(scene)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let time = 0;
    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      reduce = false;
    }

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    let draw: (dt: number, strength: number) => void = () => {};

    const setup = () => {
      ctx.clearRect(0, 0, width, height);

      switch (scene) {
        case 'rain': {
          const drops = Array.from({ length: Math.round(width / 7) + 40 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            len: rand(9, 28),
            speed: rand(340, 780),
            alpha: rand(0.05, 0.19),
            wind: rand(-0.24, -0.12),
          }));
          const beads = Array.from({ length: 8 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: rand(14, 46),
            speed: rand(4, 12),
            alpha: rand(0.05, 0.13),
          }));
          draw = (dt, strength) => {
            ctx.lineWidth = 1;
            for (const drop of drops) {
              if (dt > 0) {
                drop.y += drop.speed * dt;
                drop.x += drop.speed * drop.wind * dt;
                if (drop.y - drop.len > height) {
                  drop.y = -drop.len;
                  drop.x = Math.random() * (width + 80);
                }
                if (drop.x < -40) drop.x = width + 40;
              }
              ctx.strokeStyle = `rgba(196,220,240,${drop.alpha * (0.4 + strength * 0.95)})`;
              ctx.beginPath();
              ctx.moveTo(drop.x, drop.y);
              ctx.lineTo(drop.x + drop.len * 0.22, drop.y - drop.len);
              ctx.stroke();
            }
            for (const bead of beads) {
              if (dt > 0) {
                bead.y += bead.speed * dt * 5;
                if (bead.y - bead.r > height) {
                  bead.y = -bead.r;
                  bead.x = Math.random() * width;
                }
              }
              ctx.globalAlpha = bead.alpha * strength;
              ctx.drawImage(
                sprite('cool'),
                bead.x - bead.r,
                bead.y - bead.r,
                bead.r * 2,
                bead.r * 2,
              );
            }
            ctx.globalAlpha = 1;
          };
          break;
        }

        case 'snow': {
          const flakes = Array.from({ length: Math.max(70, Math.round(width / 9)) }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: rand(0.7, 2.8),
            speed: rand(18, 58),
            drift: rand(-8, 8),
            sway: rand(6, 18),
            phase: rand(0, Math.PI * 2),
            rate: rand(0.4, 1.1),
            alpha: rand(0.2, 0.7),
            glow: Math.random() > 0.72,
          }));
          draw = (dt, strength) => {
            for (const flake of flakes) {
              if (dt > 0) {
                flake.y += flake.speed * dt * (0.7 + strength * 0.6);
                flake.x +=
                  (flake.drift + Math.sin(time * flake.rate + flake.phase) * flake.sway) * dt;
                if (flake.y - flake.r > height) {
                  flake.y = -flake.r;
                  flake.x = Math.random() * width;
                }
                if (flake.x < -12) flake.x = width + 12;
                if (flake.x > width + 12) flake.x = -12;
              }
              const alpha = Math.min(1, flake.alpha * (0.35 + strength * 0.8));
              ctx.globalAlpha = alpha;
              ctx.fillStyle = 'rgba(240,247,255,1)';
              ctx.beginPath();
              ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
              ctx.fill();
              if (flake.glow) {
                ctx.globalAlpha = Math.min(1, alpha * 0.24);
                const size = flake.r * 16;
                ctx.drawImage(
                  sprite('cool'),
                  flake.x - size / 2,
                  flake.y - size / 2,
                  size,
                  size,
                );
              }
            }
            ctx.globalAlpha = 1;
          };
          break;
        }

        case 'stars': {
          const total = Math.max(60, Math.round((width * height) / 5200));
          const stars = Array.from({ length: total }, () => ({
            x: Math.random() * width,
            y: Math.random() * height * 0.9,
            r: rand(0.35, 1.5),
            base: rand(0.18, 0.85),
            phase: rand(0, Math.PI * 2),
            speed: rand(0.4, 1.7),
          }));
          let nextShoot = rand(3, 8);
          let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
          draw = (dt, strength) => {
            for (const star of stars) {
              const twinkle = 0.55 + 0.45 * Math.sin(time * star.speed + star.phase);
              const alpha = star.base * twinkle * (0.45 + strength * 0.65);
              ctx.fillStyle = `rgba(233,240,255,${Math.min(1, alpha)})`;
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
              ctx.fill();
              if (star.r > 1.15) {
                ctx.globalAlpha = Math.min(1, alpha * 0.32);
                const size = star.r * 18;
                ctx.drawImage(sprite('star'), star.x - size / 2, star.y - size / 2, size, size);
                ctx.globalAlpha = 1;
              }
            }

            if (!reduce && strength > 0.05 && time > nextShoot) {
              shoot = {
                x: rand(width * 0.1, width * 0.85),
                y: rand(0, height * 0.35),
                vx: rand(190, 330),
                vy: rand(55, 120),
                life: 0,
              };
              nextShoot = time + rand(8, 20);
            }

            if (shoot) {
              shoot.life += dt;
              shoot.x += shoot.vx * dt;
              shoot.y += shoot.vy * dt;
              const fade = Math.max(0, 1 - shoot.life / 0.85);
              if (fade > 0) {
                const tailX = shoot.x - shoot.vx * 0.14;
                const tailY = shoot.y - shoot.vy * 0.14;
                const gradient = ctx.createLinearGradient(tailX, tailY, shoot.x, shoot.y);
                gradient.addColorStop(0, 'rgba(255,255,255,0)');
                gradient.addColorStop(1, `rgba(240,246,255,${0.55 * fade * strength})`);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(shoot.x, shoot.y);
                ctx.stroke();
              } else {
                shoot = null;
              }
            }
          };
          break;
        }

        default:
          draw = () => {};
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setup();
      const strength = intensityRef.current;
      ctx.clearRect(0, 0, width, height);
      draw(0, strength);
    };

    const frame = (timestamp: number) => {
      const dt = last ? Math.min(0.05, (timestamp - last) / 1000) : 0;
      last = timestamp;
      time += dt;
      const strength = intensityRef.current;
      ctx.clearRect(0, 0, width, height);
      draw(dt * (0.35 + strength * 1.35), strength);
      raf = window.requestAnimationFrame(frame);
    };

    resize();
    if (!reduce) raf = window.requestAnimationFrame(frame);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [scene]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
