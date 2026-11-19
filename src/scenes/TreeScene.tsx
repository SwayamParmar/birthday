import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { gift } from "@/config/gift";
import { asset, prefersReducedMotion, seeded } from "@/lib/utils";
import { TapHint } from "@/components/Chrome";

/** Heart path centred on 0,0, ~28 units wide, ~30 tall. */
const HEART = "M0,-8 C-2,-14 -10,-14 -12,-7 C-15,0 -8,8 0,16 C8,8 15,0 12,-7 C10,-14 2,-14 0,-8 Z";

/** Theme palette, each as [highlight, base] so every heart gets a glossy gradient. */
const LEAF = [
  ["#FF9CC2", "#E63E7A"], // magenta
  ["#FFC2DA", "#FF6F91"], // rose
  ["#FFE0EC", "#FF9EC0"], // light pink
  ["#FFE7A8", "#FFB547"], // marigold
  ["#FFC7A8", "#FF8A5B"], // coral
  ["#FF8FB8", "#A3195B"], // berry
  ["#FFF0C4", "#FFD27A"], // gold
] as const;
/** Weighted so pinks dominate, gold/coral are accents (as in the reference). */
const LEAF_WEIGHTS = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6];

// Tree geometry (viewBox 0 0 300 400). Canopy heart centred at x=150.
const CX = 150;
const CY = 122;
const SX = 112;
const SY = 96;
const TIP_Y = CY + SY; // bottom point of the canopy heart, where the trunk meets it

const TRUNK = { d: "M150 400 C146 345 145 280 150 212", w: 12, dl: 0, dur: 0.7 };
const BRANCHES = [
  { d: "M150 222 C128 196 100 164 68 124", w: 5.5, dl: 0.35 },
  { d: "M150 222 C172 196 200 162 232 122", w: 5.5, dl: 0.4 },
  { d: "M150 214 C150 172 150 120 150 62", w: 5, dl: 0.4 },
  { d: "M122 186 C112 148 100 104 90 54", w: 3.8, dl: 0.55 },
  { d: "M178 186 C188 148 200 104 210 54", w: 3.8, dl: 0.6 },
  { d: "M98 160 C82 148 64 134 44 112", w: 2.8, dl: 0.65 },
  { d: "M202 158 C218 146 236 132 256 110", w: 2.8, dl: 0.7 },
  { d: "M150 150 C136 126 124 106 116 86", w: 2.4, dl: 0.75 },
  { d: "M150 148 C164 124 176 104 184 84", w: 2.4, dl: 0.8 },
  { d: "M68 124 C60 104 56 88 56 70", w: 2.2, dl: 0.8 },
  { d: "M232 122 C240 102 244 86 244 68", w: 2.2, dl: 0.85 },
];
const GROW_END = 1.1;
const BLOOM_START = 0.9;
const BLOOM_SPREAD = 1.3;
const BLOOM_END = BLOOM_START + BLOOM_SPREAD + 0.4;

/**
 * Photo frames (viewBox units). Hanging frames are tied to points on branches and
 * hang just outside / below the crown so they don't cover the hearts or each other.
 * The centre frame sits in the middle of the crown and appears last.
 */
const FRAME_START = BLOOM_END + 0.1;
const FRAMES = [
  { src: "photos/6.jpeg", ax: 58, ay: 126, len: 34, w: 36, h: 45, tilt: -5, delay: FRAME_START, sway: 3.4 },
  { src: "photos/7.jpeg", ax: 240, ay: 128, len: 26, w: 36, h: 45, tilt: 4, delay: FRAME_START + 0.4, sway: 3.9 },
  { src: "photos/8.jpeg", ax: 122, ay: 192, len: 30, w: 34, h: 42, tilt: -3, delay: FRAME_START + 0.8, sway: 3.6 },
] as const;
const CENTER_FRAME = { src: "photos/9.jpeg", cx: CX, cy: CY + 4, w: 54, h: 64, tilt: 2, delay: FRAME_START + 1.35 };
const FRAMES_END = CENTER_FRAME.delay + 0.5;

/** White polaroid frame (thicker bottom), photo cropped to fill. Drawn with its top-centre at 0,0. */
const Polaroid = ({ src, w, h }: { src: string; w: number; h: number }) => {
  const pad = w * 0.08;
  const bottom = pad * 2.8;
  return (
    <g style={{ filter: "drop-shadow(0 2px 2.5px rgba(90,20,50,0.28))" }}>
      <rect x={-w / 2} y={0} width={w} height={h} rx={1.5} fill="#FFFDF8" />
      <image
        href={asset(src)}
        x={-w / 2 + pad}
        y={pad}
        width={w - pad * 2}
        height={h - pad - bottom}
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
};

const PhotoFrames = ({ reduced }: { reduced: boolean }) => (
  <g>
    {FRAMES.map((f) => (
      <motion.g
        key={f.src}
        initial={reduced ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { delay: f.delay, type: "spring", stiffness: 220, damping: 13 }}
      >
        {/* sway pivots on the knot where the string meets the branch */}
        <g
          className={reduced ? undefined : "frame-sway"}
          style={{ transformOrigin: `${f.ax}px ${f.ay}px`, animationDuration: `${f.sway}s` }}
        >
          <line x1={f.ax} y1={f.ay} x2={f.ax} y2={f.ay + f.len} stroke="#5A2E3D" strokeOpacity="0.7" strokeWidth="0.7" />
          <circle cx={f.ax} cy={f.ay} r="1.3" fill="#5A2E3D" />
          <g transform={`translate(${f.ax} ${f.ay + f.len}) rotate(${f.tilt})`}>
            <Polaroid src={f.src} w={f.w} h={f.h} />
          </g>
        </g>
      </motion.g>
    ))}

    <g transform={`translate(${CENTER_FRAME.cx} ${CENTER_FRAME.cy - CENTER_FRAME.h / 2}) rotate(${CENTER_FRAME.tilt})`}>
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduced ? { duration: 0 } : { delay: CENTER_FRAME.delay, type: "spring", stiffness: 240, damping: 15 }}
      >
        <Polaroid src={CENTER_FRAME.src} w={CENTER_FRAME.w} h={CENTER_FRAME.h} />
      </motion.g>
    </g>
  </g>
);

interface Leaf {
  x: number;
  y: number;
  s: number;
  c: number;
  r: number;
  d: number;
}

/**
 * Fill the heart-shaped crown densely with overlapping hearts.
 * Bloom order follows the reference: from where the trunk meets the crown,
 * spreading outward and upward to the lobes.
 */
const useCanopy = (count: number) =>
  useMemo(() => {
    const rnd = seeded(42);
    const pts: Leaf[] = [];
    let guard = 0;
    while (pts.length < count && guard++ < 40000) {
      const x = rnd() * 2.4 - 1.2;
      const y = rnd() * 2.4 - 1.1;
      // Implicit heart curve: (x² + y² − 1)³ − x²y³ ≤ 0, shrunk slightly so edge hearts stay inside
      const a = x * x + y * y - 1;
      if (a * a * a - x * x * y * y * y > -0.02) continue;
      const px = CX + x * SX;
      const py = CY - y * SY;
      const dist = Math.hypot((px - CX) / SX, (py - TIP_Y) / (SY * 2.1));
      pts.push({
        x: px,
        y: py,
        s: 0.5 + rnd() * 0.45,
        c: LEAF_WEIGHTS[Math.floor(rnd() * LEAF_WEIGHTS.length)],
        r: rnd() * 50 - 25,
        d: BLOOM_START + Math.min(1, dist) * BLOOM_SPREAD + rnd() * 0.22,
      });
    }
    // Draw the earliest blooms first so later (outer) hearts layer on top, like the reference.
    return pts.sort((p, q) => p.d - q.d);
  }, [count]);

/** A few hearts let go of the crown and drift down once it is full. */
const usePetals = (canopy: Leaf[]) =>
  useMemo(() => {
    const rnd = seeded(7);
    const lower = canopy.filter((p) => p.y > CY);
    return Array.from({ length: 7 }, (_, i) => {
      const from = lower[Math.floor(rnd() * lower.length)] ?? { x: CX, y: CY };
      return {
        id: i,
        x: from.x,
        y: from.y,
        c: LEAF_WEIGHTS[Math.floor(rnd() * LEAF_WEIGHTS.length)],
        drift: rnd() * 50 - 25,
        fall: 150 + rnd() * 120,
        delay: BLOOM_END + i * 0.9 + rnd() * 0.6,
        dur: 3.2 + rnd() * 1.6,
      };
    });
  }, [canopy]);

const FloatingHearts = () => {
  const items = useMemo(() => {
    const rnd = seeded(9);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      size: 10 + rnd() * 12,
      delay: rnd() * 8,
      duration: 9 + rnd() * 7,
      color: ["#FF9EC0", "#FFC2DA", "#FFB3CF", "#FFD27A"][i % 4],
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
          <path d={HEART} fill={h.color} opacity="0.55" />
        </svg>
      ))}
    </div>
  );
};

/** Step 4: a tree grows, then blooms into one big heart of hearts. */
export const TreeScene = ({ onDone }: { onDone: () => void }) => {
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const reduced = prefersReducedMotion();
  const canopy = useCanopy(isSmall ? 200 : 280);
  const petals = usePetals(canopy);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), reduced ? 600 : FRAMES_END * 1000);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Continue"
      onClick={() => ready && onDone()}
      onKeyDown={(e) => ready && (e.key === "Enter" || e.key === " ") && onDone()}
      className="relative flex min-h-[100dvh] cursor-pointer flex-col items-center overflow-hidden bg-blush px-4 pb-20 pt-16 outline-none lg:flex-row-reverse lg:items-end lg:justify-center lg:gap-10 lg:px-12 lg:pb-0"
    >
      {/* warm light behind the crown */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[28%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,246,220,0.95),rgba(255,222,205,0.45)_45%,transparent_70%)] lg:left-[58%] lg:top-[40%] lg:h-[46rem] lg:w-[46rem]"
      />
      <FloatingHearts />

      {/* Tree */}
      <svg
        viewBox="0 0 300 400"
        className="relative z-10 h-[min(60dvh,520px)] w-auto shrink-0 overflow-visible lg:h-[min(92dvh,820px)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tree-bark" x1="0" x2="1">
            <stop offset="0%" stopColor="#3E1C2B" />
            <stop offset="50%" stopColor="#6E3A4B" />
            <stop offset="100%" stopColor="#3E1C2B" />
          </linearGradient>
          {LEAF.map(([hi, base], i) => (
            <radialGradient key={i} id={`leaf-${i}`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="22%" stopColor={hi} />
              <stop offset="100%" stopColor={base} />
            </radialGradient>
          ))}
        </defs>

        {[TRUNK, ...BRANCHES.map((b) => ({ ...b, dur: GROW_END - b.dl }))].map((b, i) => (
          <motion.path
            key={i}
            d={b.d}
            fill="none"
            stroke="url(#tree-bark)"
            strokeWidth={b.w}
            strokeLinecap="round"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={reduced ? { duration: 0 } : { duration: b.dur, delay: b.dl, ease: "easeOut" }}
          />
        ))}

        {/* Crown: CSS keyframes keep a few hundred hearts smooth on phones */}
        <g>
          {canopy.map((p, i) => (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.r.toFixed(0)}) scale(${p.s.toFixed(2)})`}>
              <path
                d={HEART}
                className="leaf-pop"
                fill={`url(#leaf-${p.c})`}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="0.9"
                style={{ animationDelay: `${reduced ? 0 : p.d.toFixed(2)}s` } as CSSProperties}
              />
            </g>
          ))}
        </g>

        <PhotoFrames reduced={reduced} />

        {/* Petals letting go */}
        {!reduced &&
          petals.map((p) => (
            <g key={p.id} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              <path
                d={HEART}
                className="petal-fall"
                fill={`url(#leaf-${p.c})`}
                style={
                  {
                    "--drift": `${p.drift}px`,
                    "--fall": `${p.fall}px`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.dur}s`,
                  } as CSSProperties
                }
              />
            </g>
          ))}
      </svg>

      {/* Greeting card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 0.15 }}
        className="relative z-20 -mt-20 w-full max-w-sm rounded-[28px] border border-white/50 bg-white/40 px-6 py-6 text-left shadow-[0_20px_50px_-28px_rgba(160,40,90,0.4)] backdrop-blur-md lg:mb-[22vh] lg:mt-0 lg:max-w-md lg:px-9 lg:py-9"
      >
        <p className="font-display text-sm font-semibold italic text-berry/75 sm:text-base">it's officially your day</p>
        <h1 className="mt-2 bg-gradient-to-b from-rose to-berry bg-clip-text font-display text-[clamp(2.4rem,10vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight text-transparent">
          <span className="block">Happy</span>
          <span className="block">Birthday,</span>
          <span className="block">{gift.name}</span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : BLOOM_START + 0.3, duration: 0.6 }}
          className="mt-3 font-display text-sm font-semibold italic text-berry/75 sm:text-base"
        >
          here's to a year that blooms
        </motion.p>
      </motion.div>

      {ready && <TapHint className="absolute bottom-[max(env(safe-area-inset-bottom),18px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-xs text-berry/55" />}
    </div>
  );
};
