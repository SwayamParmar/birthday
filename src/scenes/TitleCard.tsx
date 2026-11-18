import { useEffect } from "react";
import { motion } from "framer-motion";

const LINES = ["Happy", "Birthday"];

/** Step 3: full-bleed title card; letters spring up one by one, then auto-advances. */
export const TitleCard = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [onDone]);

  let n = 0;
  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Happy Birthday. Tap to continue."
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#FF5FA2,#B4127A_55%,#6A1BB8)] px-4 text-center"
    >
      <div aria-hidden="true" className="title-grid pointer-events-none absolute inset-0 opacity-30" />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="relative mb-4 font-display text-lg font-semibold italic text-white/85 sm:text-xl"
      >
        today is all about you
      </motion.p>

      <h1 className="relative font-display font-black leading-[0.95] tracking-tight text-cream drop-shadow-[0_8px_0_rgba(80,0,60,0.25)]">
        {LINES.map((line) => (
          <span key={line} className="block whitespace-nowrap text-[clamp(3rem,16vw,9rem)]">
            {line.split("").map((ch) => {
              const i = n++;
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "60%", opacity: 0, rotate: -6 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, type: "spring", stiffness: 380, damping: 18 }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="relative mt-6 max-w-xs font-display text-base italic text-white/90 sm:max-w-none sm:text-lg"
      >
        the world got brighter the day you arrived
      </motion.p>
    </button>
  );
};
