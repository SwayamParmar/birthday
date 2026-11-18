import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { gift } from "@/config/gift";
import { seeded } from "@/lib/utils";
import { TapHint } from "@/components/Chrome";
import { TypeWriter } from "@/components/TypeWriter";

/** Heart path centred on 0,0, ~28 units wide (from the original HeartTree). */
const HEART = "M0,-8 C-2,-14 -10,-14 -12,-7 C-15,0 -8,8 0,16 C8,8 15,0 12,-7 C10,-14 2,-14 0,-8 Z";
const LEAF_COLORS = ["#FF4F8B", "#FF7EB6", "#FFB3CF", "#FFB547", "#FF8A5B", "#E63E7A", "#FFD27A"];

/** Sample points inside a heart-shaped canopy so the blossoms form one big heart. */
const useCanopy = (count: number) =>
  useMemo(() => {
    const rnd = seeded(42);
    const pts: { x: number; y: number; s: number; c: string; d: number; r: number }[] = [];
    let guard = 0;
    while (pts.length < count && guard++ < 20000) {
      const x = rnd() * 2.6 - 1.3;
      const y = rnd() * 2.5 - 1.2;
      // Implicit heart curve: (x² + y² − 1)³ − x²y³ ≤ 0
      const a = x * x + y * y - 1;
      if (a * a * a - x * x * y * y * y > 0) continue;
      pts.push({
        x: 150 + x * 92,
        y: 112 - y * 84,
        s: 0.55 + rnd() * 0.6,
        c: LEAF_COLORS[Math.floor(rnd() * LEAF_COLORS.length)],
        d: 1.3 + (1.2 - y) * 0.9 + rnd() * 0.6,
        r: rnd() * 50 - 25,
      });
    }
    return pts;
  }, [count]);

const BRANCHES = [
  { d: "M150 300 C148 260 146 225 150 190", w: 16, dl: 0 },
  { d: "M150 205 C130 180 104 150 82 118", w: 9, dl: 0.45 },
  { d: "M150 205 C172 178 198 146 220 112", w: 9, dl: 0.55 },
  { d: "M150 195 C150 160 150 120 150 72", w: 8, dl: 0.5 },
  { d: "M112 160 C96 150 80 148 62 152", w: 5, dl: 0.85 },
  { d: "M188 156 C206 146 222 146 240 150", w: 5, dl: 0.9 },
  { d: "M150 120 C134 100 122 86 112 70", w: 4.5, dl: 0.95 },
  { d: "M150 118 C166 98 178 86 190 70", w: 4.5, dl: 1.0 },
  { d: "M95 132 C84 112 80 100 78 86", w: 4, dl: 1.05 },
  { d: "M206 128 C218 110 222 98 224 84", w: 4, dl: 1.1 },
];

const FallingHearts = () => {
  const items = useMemo(() => {
    const rnd = seeded(9);
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      size: 10 + rnd() * 14,
      delay: rnd() * 8,
      duration: 8 + rnd() * 7,
      color: LEAF_COLORS[i % LEAF_COLORS.length],
    }));
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((h) => (
        <svg
          key={h.id}
          viewBox="-15 -15 30 32"
          className="falling-heart absolute -top-8"
          style={{ left: `${h.left}%`, width: h.size, height: h.size, animationDelay: `${h.delay}s`, animationDuration: `${h.duration}s` }}
        >
          <path d={HEART} fill={h.color} opacity="0.7" />
        </svg>
      ))}
    </div>
  );
};

/** Step 4: a tree grows and blooms into a heart while the greeting types in. */
export const TreeScene = ({ onDone }: { onDone: () => void }) => {
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const canopy = useCanopy(isSmall ? 70 : 110);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Continue"
      onClick={() => ready && onDone()}
      onKeyDown={(e) => ready && (e.key === "Enter" || e.key === " ") && onDone()}
      className="relative flex min-h-[100dvh] cursor-pointer flex-col items-center justify-center overflow-hidden bg-blush px-4 pb-16 pt-20 outline-none lg:flex-row-reverse lg:gap-6 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,214,0.95),rgba(255,214,200,0.4)_45%,transparent_70%)] lg:left-[62%]" />
      <FallingHearts />

      {/* Tree */}
      <svg viewBox="0 0 300 300" className="relative z-10 w-[min(88vw,420px)] overflow-visible lg:w-[min(46vw,560px)]" aria-hidden="true">
        <defs>
          <linearGradient id="tree-bark" x1="0" x2="1">
            <stop offset="0%" stopColor="#4A2433" />
            <stop offset="50%" stopColor="#7A4152" />
            <stop offset="100%" stopColor="#4A2433" />
          </linearGradient>
        </defs>
        {BRANCHES.map((b, i) => (
          <motion.path
            key={i}
            d={b.d}
            fill="none"
            stroke="url(#tree-bark)"
            strokeWidth={b.w}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: b.dl, ease: "easeOut" }}
          />
        ))}
        {canopy.map((p, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: p.d, duration: 0.2 }}>
            <g transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
              <motion.path
                d={HEART}
                fill={p.c}
                initial={{ scale: 0 }}
                animate={{ scale: p.s }}
                transition={{ delay: p.d, type: "spring", stiffness: 260, damping: 14 }}
                style={{ filter: "drop-shadow(0 1px 1.5px rgba(120,20,60,0.25))" }}
              />
            </g>
          </motion.g>
        ))}
      </svg>

      {/* Greeting panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative z-10 -mt-4 w-full max-w-md rounded-[28px] border border-white/60 bg-white/45 px-6 py-6 text-left shadow-[0_20px_50px_-25px_rgba(160,40,90,0.45)] backdrop-blur-md lg:mt-0"
      >
        <p className="font-display text-base font-semibold italic text-berry/80">today belongs to you</p>
        <h1 className="mt-2 font-hand text-[clamp(2.6rem,11vw,4rem)] font-bold leading-[0.95] text-transparent [background-clip:text] [-webkit-background-clip:text] bg-gradient-to-b from-rose to-berry">
          <TypeWriter text={`Happy Birthday, ${gift.name}`} speed={70} delay={900} cursor />
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4, duration: 0.8 }} className="mt-3 font-display text-base font-semibold italic text-berry/80">
          may this year grow into something beautiful
        </motion.p>
      </motion.div>

      {ready && <TapHint className="absolute bottom-[max(env(safe-area-inset-bottom),20px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-berry/60" />}
    </div>
  );
};
