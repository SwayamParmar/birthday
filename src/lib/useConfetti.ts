import { useCallback, useEffect, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import { prefersReducedMotion } from "./utils";

export const PARTY_COLORS = ["#FF6F91", "#FFB547", "#9D7BFF", "#3DDBD9", "#FF8A5B", "#FFFFFF"];

/** canvas-confetti helpers, adapted from the original Confetti hook (no global store). */
export const useConfetti = () => {
  const reduced = prefersReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const rafs = useRef<number[]>([]);

  useEffect(
    () => () => {
      rafs.current.forEach(cancelAnimationFrame);
      confetti.reset();
    },
    [],
  );

  /** One upward burst from a point (x/y are 0–1 of the viewport). */
  const burst = useCallback(
    (x = 0.5, y = 0.6, options?: confetti.Options) => {
      confetti({
        particleCount: reduced ? 12 : isMobile ? 45 : 90,
        spread: 75,
        startVelocity: isMobile ? 32 : 40,
        origin: { x, y },
        scalar: isMobile ? 0.8 : 1,
        colors: PARTY_COLORS,
        disableForReducedMotion: reduced,
        ...options,
      });
    },
    [isMobile, reduced],
  );

  /** Confetti strips falling from the top for `ms` milliseconds (Infinity = until unmount). */
  const rain = useCallback(
    (ms = 3000) => {
      if (reduced) return;
      const end = ms === Infinity ? Infinity : Date.now() + ms;
      const interval = isMobile ? 110 : 60;
      let last = 0;
      const tick = () => {
        const now = Date.now();
        if (now - last >= interval) {
          last = now;
          confetti({
            particleCount: 1,
            angle: 270,
            spread: 40,
            startVelocity: 8,
            origin: { x: Math.random(), y: -0.05 },
            colors: PARTY_COLORS,
            gravity: 0.45,
            scalar: isMobile ? 0.6 : 0.75,
            drift: Math.random() * 0.6 - 0.3,
            ticks: 400,
            shapes: ["square"],
          });
        }
        if (now < end) rafs.current.push(requestAnimationFrame(tick));
      };
      tick();
    },
    [isMobile, reduced],
  );

  return useMemo(() => ({ burst, rain }), [burst, rain]);
};
