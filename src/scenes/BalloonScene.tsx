import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gift } from "@/config/gift";
import { FadeIn, PillButton } from "@/components/Chrome";

const BALLOONS = [
  { color: "#FF7EB6", shade: "#E0458B", left: 6, top: 4 },
  { color: "#FFC94D", shade: "#E39B17", left: 22, top: 36 },
  { color: "#9D7BFF", shade: "#6E49E0", left: 40, top: 22 },
  { color: "#3DDBD9", shade: "#14A8A6", left: 58, top: 0 },
  { color: "#FF8A5B", shade: "#E0582A", left: 74, top: 28 },
];

interface Burst {
  id: number;
  x: number;
  y: number;
  color: string;
}

const PopBurst = ({ x, y, color }: Omit<Burst, "id">) => {
  const bits = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
        const dist = 40 + Math.random() * 45;
        const palette = [color, "#FFB547", "#FF6F91", "#9D7BFF", "#3DDBD9"];
        return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, size: 4 + Math.random() * 6, c: palette[i % palette.length] };
      }),
    [color],
  );
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }} aria-hidden="true">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: b.size, height: b.size, background: b.c, marginLeft: -b.size / 2, marginTop: -b.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: b.dx, y: b.dy + 18, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const Balloon = ({ color, shade, index }: { color: string; shade: string; index: number }) => (
  <svg viewBox="0 0 80 150" className="h-full w-full overflow-visible" aria-hidden="true">
    <defs>
      <radialGradient id={`bl-${index}`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="18%" stopColor={color} />
        <stop offset="100%" stopColor={shade} />
      </radialGradient>
    </defs>
    <path d="M40 98 C42 112 36 124 41 138 C44 146 38 150 40 150" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
    <ellipse cx="40" cy="48" rx="34" ry="44" fill={`url(#bl-${index})`} />
    <path d="M35 91 L45 91 L42 98 L38 98 Z" fill={shade} />
  </svg>
);

/** Step 6: five balloons; each pop reveals the next reason card. */
export const BalloonScene = ({ onDone }: { onDone: () => void }) => {
  const [popped, setPopped] = useState<number[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [showButton, setShowButton] = useState(false);
  const clusterRef = useRef<HTMLDivElement | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const allPopped = popped.length === BALLOONS.length;

  const pop = (i: number, el: HTMLElement) => {
    if (popped.includes(i)) return;
    const box = el.getBoundingClientRect();
    const host = clusterRef.current?.getBoundingClientRect();
    if (host) {
      const id = Date.now() + i;
      setBursts((b) => [...b, { id, x: box.left - host.left + box.width / 2, y: box.top - host.top + box.height * 0.32, color: BALLOONS[i].color }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
    }
    navigator.vibrate?.(20);
    setPopped((p) => [...p, i]);
  };

  useEffect(() => {
    if (popped.length === 0) return;
    const t = setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 250);
    return () => clearTimeout(t);
  }, [popped.length]);

  useEffect(() => {
    if (!allPopped) return;
    const t = setTimeout(() => setShowButton(true), 1100);
    return () => clearTimeout(t);
  }, [allPopped]);

  return (
    <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col items-center px-5 pb-12 pt-20 text-center">
      <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">Pop every balloon 🎈</h2>
      <p className="mt-2 text-sm text-cream/75 sm:text-base">Five balloons, five things I love about you.</p>

      {/* Balloon cluster */}
      <motion.div
        ref={clusterRef}
        className="relative mt-6 w-full max-w-[340px]"
        animate={{ height: allPopped ? 40 : 230 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {BALLOONS.map((b, i) =>
            popped.includes(i) ? null : (
              <motion.button
                key={i}
                type="button"
                aria-label={`Pop balloon ${i + 1}`}
                onClick={(e) => pop(i, e.currentTarget)}
                className="absolute h-[150px] w-[76px] cursor-pointer outline-none focus-visible:drop-shadow-[0_0_10px_white] sm:w-[84px]"
                style={{ left: `${b.left}%`, top: b.top, zIndex: i === 2 ? 2 : 1 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ scale: 1.35, opacity: 0, transition: { duration: 0.12 } }}
                transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 180, damping: 14 }}
                whileTap={{ scale: 0.92 }}
              >
                <span className="balloon-bob block h-full w-full" style={{ animationDelay: `${i * 0.45}s` }}>
                  <Balloon color={b.color} shade={b.shade} index={i} />
                </span>
              </motion.button>
            ),
          )}
        </AnimatePresence>
        {bursts.map((b) => (
          <PopBurst key={b.id} x={b.x} y={b.y} color={b.color} />
        ))}
      </motion.div>

      {/* Reason cards, in pop order */}
      <ol className="mt-2 flex w-full flex-col gap-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {popped.map((balloon, order) => (
            <motion.li
              key={balloon}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative overflow-hidden rounded-2xl border bg-plum-800/70 px-4 py-3.5 text-left backdrop-blur-sm"
              style={{ borderColor: `${BALLOONS[balloon].color}66`, boxShadow: `0 10px 30px -12px ${BALLOONS[balloon].color}88` }}
            >
              <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: BALLOONS[balloon].color }} aria-hidden="true" />
              <span className="inline-flex items-center gap-1 rounded-full bg-marigold/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-marigold">
                Reason {order + 1} <span aria-hidden="true">💗</span>
              </span>
              <p className="mt-1.5 flex items-start justify-between gap-3 text-[15px] font-semibold leading-snug text-cream sm:text-base">
                <span>{gift.reasons[order]}</span>
                <span className="text-marigold" aria-hidden="true">✦</span>
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {allPopped && (
        <FadeIn delay={0.4} className="mt-6">
          <p className="font-hand text-2xl font-bold text-marigold">…and a thousand more 💛</p>
        </FadeIn>
      )}
      {showButton && (
        <FadeIn className="mt-5">
          <PillButton onClick={onDone}>Keep going 💛</PillButton>
        </FadeIn>
      )}
      <div ref={listEndRef} className="h-2" />
    </div>
  );
};
