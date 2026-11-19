import { useEffect } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * One continuous line drawn left → right that loops into a heart in the
 * middle, then runs on to the right edge. viewBox 0 0 400 140, heart centred on x=200.
 */
const LINE =
  "M20 92 C70 100 130 104 172 96 " + // gentle lead-in from the left
  "C186 93 196 98 200 108 " + // dip into the heart's tip
  "C180 90 160 70 164 52 " + // left lobe, up
  "C168 34 192 32 200 52 " + // over the left lobe into the top notch
  "C208 32 232 34 236 52 " + // over the right lobe
  "C240 70 220 90 200 108 " + // down to the tip
  "C206 98 216 92 232 92 " + // out of the heart
  "C280 92 330 84 380 88"; // run on to the right

const DRAW_S = 2.1;
const TOTAL_MS = 3000;

/** Opening flourish before the PIN screen: the heart draws itself, then hands off. */
export const HeartIntro = ({ onDone }: { onDone: () => void }) => {
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 1200 : TOTAL_MS);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  const draw = reduced ? { duration: 0 } : { duration: DRAW_S, ease: [0.45, 0, 0.35, 1] as const };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-ivory px-4" role="img" aria-label="A heart drawing itself">
      <div className="relative w-[min(92vw,560px)]">
        {/* soft glow behind the heart, blooms once the loop is drawn */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[48%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,111,145,0.28),transparent_70%)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduced ? 0 : DRAW_S * 0.6, duration: 0.8, ease: "easeOut" }}
        />
        <svg viewBox="0 0 400 140" className="relative h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="intro-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6F91" />
              <stop offset="50%" stopColor="#E0456B" />
              <stop offset="100%" stopColor="#A3195B" />
            </linearGradient>
          </defs>

          {/* start dot */}
          <motion.circle
            cx="20"
            cy="92"
            r="3.2"
            fill="#FF6F91"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          />

          <motion.path
            d={LINE}
            fill="none"
            stroke="url(#intro-line)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={draw}
          />

          {/* end dot pops when the pen reaches the right edge */}
          <motion.circle
            cx="380"
            cy="88"
            r="3.2"
            fill="#A3195B"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 1], opacity: 1 }}
            transition={{ delay: reduced ? 0 : DRAW_S, duration: 0.35 }}
          />
        </svg>
      </div>
    </div>
  );
};
