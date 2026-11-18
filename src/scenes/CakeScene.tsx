import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gift } from "@/config/gift";
import { useConfetti } from "@/lib/useConfetti";
import { TapHint } from "@/components/Chrome";
import { TypeWriter } from "@/components/TypeWriter";

const LAYERS = [
  { y: 112, fill: "#FF8FB8", stripe: "#E8679A", delay: 0.2 },
  { y: 84, fill: "#FFD9A0", stripe: "#F2B565", delay: 0.65 },
  { y: 56, fill: "#FF8FB8", stripe: "#E8679A", delay: 1.1 },
];

type Stage = "baking" | "lit" | "wish" | "ready";

/** Step 5: the cake builds itself, the candle lights, confetti pops, the greeting types out. */
export const CakeScene = ({ onDone }: { onDone: () => void }) => {
  const [stage, setStage] = useState<Stage>("baking");
  const cakeRef = useRef<SVGSVGElement | null>(null);
  const { burst, rain } = useConfetti();

  useEffect(() => {
    const t = setTimeout(() => {
      const box = cakeRef.current?.getBoundingClientRect();
      const x = box ? (box.left + box.width / 2) / window.innerWidth : 0.5;
      const y = box ? (box.top + box.height * 0.3) / window.innerHeight : 0.5;
      burst(x, y, { spread: 90, startVelocity: 38 });
      rain(Infinity);
      setStage("lit");
    }, 3100);
    return () => clearTimeout(t);
  }, [burst, rain]);

  useEffect(() => {
    if (stage !== "wish") return;
    const t = setTimeout(() => setStage("ready"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Continue"
      onClick={() => stage === "ready" && onDone()}
      onKeyDown={(e) => stage === "ready" && (e.key === "Enter" || e.key === " ") && onDone()}
      className="relative z-10 flex min-h-[100dvh] cursor-pointer flex-col items-center justify-center px-5 pb-16 pt-20 text-center outline-none"
    >
      <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">Let's start with cake 🎂</h2>

      <svg ref={cakeRef} viewBox="0 0 240 160" className="mt-10 w-[min(76vw,300px)] overflow-visible" aria-hidden="true">
        {/* Plate */}
        <motion.rect x="10" y="140" width="220" height="5" rx="2.5" fill="#FFF3E6" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} style={{ transformOrigin: "120px 142px" }} />

        {/* Layers */}
        {LAYERS.map((l, i) => (
          <motion.g key={i} initial={{ y: -160, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: l.delay, type: "spring", stiffness: 220, damping: 16 }}>
            <rect x="40" y={l.y} width="160" height="28" rx="8" fill={l.fill} />
            <rect x="40" y={l.y + 11} width="160" height="5" fill={l.stripe} />
          </motion.g>
        ))}

        {/* Frosting with drips */}
        <motion.path
          d="M36 60 Q36 50 48 50 L192 50 Q204 50 204 60 L204 70 Q198 74 196 70 L196 88 Q192 94 188 88 L188 68 Q178 72 170 68 L170 76 Q166 82 162 76 L162 68 L132 68 L132 92 Q127 99 122 92 L122 68 L92 68 L92 80 Q88 86 84 80 L84 68 L60 68 L60 96 Q55 103 50 96 L50 70 Q40 74 36 68 Z"
          fill="#FFF8F2"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 1.75, duration: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: "120px 50px" }}
        />

        {/* Candle */}
        <motion.g initial={{ y: -200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.4, type: "spring", stiffness: 260, damping: 18 }}>
          <rect x="114" y="10" width="12" height="42" rx="3" fill="#FFF8F2" />
          {[16, 26, 36, 46].map((y) => (
            <rect key={y} x="114" y={y} width="12" height="3.5" fill="#9D7BFF" opacity="0.85" />
          ))}
          <rect x="119" y="2" width="2" height="9" rx="1" fill="#4A3A40" />
        </motion.g>

        {/* Flame */}
        {stage !== "baking" && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "120px 2px" }}>
            <defs>
              <radialGradient id="flame-halo">
                <stop offset="0%" stopColor="#FFD27A" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFB547" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="-6" r="22" fill="url(#flame-halo)" className="flame-glow" />
            <path className="flame" d="M120 -18 C126 -10 128 -4 124 2 C122 5 118 5 116 2 C112 -4 114 -10 120 -18 Z" fill="#FFC94D" />
            <path className="flame" d="M120 -10 C123 -6 123 -2 121 1 C120 2 119.5 2 119 1 C117 -2 117 -6 120 -10 Z" fill="#FFF3D6" />
          </motion.g>
        )}
      </svg>

      <div className="mt-8 min-h-[6.5rem]">
        <AnimatePresence mode="wait">
          {stage === "baking" ? (
            <motion.p key="baking" exit={{ opacity: 0 }} className="text-sm font-semibold text-cream/80">
              Mixing the batter…
            </motion.p>
          ) : (
            <motion.div key="lit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-hand text-[clamp(2rem,9vw,2.75rem)] font-bold leading-tight text-marigold drop-shadow-[0_0_18px_rgba(255,181,71,0.35)]">
                <TypeWriter text={`Happy Birthday, ${gift.name}!`} speed={65} delay={250} onComplete={() => setStage("wish")} />
              </p>
              <div className="mt-2 h-6">
                <AnimatePresence mode="wait">
                  {stage === "wish" && (
                    <motion.p key="wish" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm font-semibold text-cream/90">
                      Close your eyes and make a wish ✨
                    </motion.p>
                  )}
                  {stage === "ready" && <TapHint key="tap" className="text-cream/75" />}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
