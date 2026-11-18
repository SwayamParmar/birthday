import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

const PALETTE = ["#FFB547", "#9D7BFF", "#3DDBD9", "#FF6F91", "#FF8A5B", "#FFF3D6"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
}

/**
 * Looping ring-burst fireworks on a full-screen canvas. Bursts favour the left
 * and right thirds so they frame the centred content instead of covering it.
 * Adapted from the original PremiumFireworks canvas loop.
 */
export const Fireworks = ({ intervalMs = 1100 }: { intervalMs?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    let nextBurst = last + 300;
    let side = 0;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      side = (side + 1) % 3;
      const band = side === 0 ? [0.05, 0.3] : side === 1 ? [0.7, 0.95] : [0.25, 0.75];
      const x = w * (band[0] + Math.random() * (band[1] - band[0]));
      const y = h * (side === 2 ? 0.55 + Math.random() * 0.25 : 0.25 + Math.random() * 0.45);
      const count = reduced ? 18 : w < 768 ? 34 : 56;
      const speed = (w < 768 ? 2.2 : 3) + Math.random();
      const main = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.08;
        const s = speed * (0.75 + Math.random() * 0.35);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: 900 + Math.random() * 500,
          size: 2 + Math.random() * 2.6,
          color: Math.random() < 0.7 ? main : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        });
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 40);
      last = now;
      if (now >= nextBurst) {
        burst();
        nextBurst = now + (reduced ? intervalMs * 2.5 : intervalMs * (0.6 + Math.random() * 0.8));
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) {
          particles.splice(i, 1);
          continue;
        }
        const k = dt / 16;
        p.vx *= Math.pow(0.97, k);
        p.vy = p.vy * Math.pow(0.97, k) + 0.035 * k;
        p.x += p.vx * k;
        p.y += p.vy * k;
        const alpha = 1 - p.life / p.max;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.6 + alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [intervalMs]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
};
