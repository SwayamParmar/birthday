import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useAnimationControls } from "framer-motion";

const MAX_PULL = 110; // px
const FIRE_AT = 36; // px

type Phase = "aim" | "flying" | "hit";

/** Step 2: drag the bow back, let go, the arrow hits the heart, and the heart floods the screen. */
export const BowScene = ({ onDone }: { onDone: () => void }) => {
  const [pull, setPull] = useState(0);
  const [phase, setPhase] = useState<Phase>("aim");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const dragStart = useRef<number | null>(null);
  const heartRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const arrow = useAnimationControls();
  const heart = useAnimationControls();

  // The string (and nocked arrow) moves a bit less than the finger.
  const sp = phase === "aim" ? pull * 0.55 : 0;
  const ratio = pull / MAX_PULL;

  useEffect(() => {
    if (phase === "aim") arrow.set({ y: sp });
  }, [sp, phase, arrow]);

  const fire = async (fromOffset: number) => {
    if (phase !== "aim") return;
    const heartBox = heartRef.current?.getBoundingClientRect();
    const arrowBox = arrowRef.current?.getBoundingClientRect();
    setPhase("flying");
    if (!heartBox || !arrowBox) {
      onDone();
      return;
    }
    const heartCenterY = heartBox.top + heartBox.height * 0.55;
    const distance = heartCenterY - arrowBox.top; // negative: upwards
    await arrow.start({ y: fromOffset + distance, transition: { duration: 0.32, ease: [0.3, 0, 0.9, 0.6] } });
    setOrigin({ x: heartBox.left + heartBox.width / 2, y: heartBox.top + heartBox.height / 2 });
    setPhase("hit");
    await heart.start({ scale: [1, 1.3, 0.9], transition: { duration: 0.35 } });
    setTimeout(onDone, 850);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (phase !== "aim") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = e.clientY;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    setPull(Math.max(0, Math.min(MAX_PULL, e.clientY - dragStart.current)));
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (pull >= FIRE_AT) fire(sp);
    else setPull(0);
  };

  return (
    <div className="relative flex min-h-[100dvh] select-none flex-col items-center overflow-hidden bg-dawn px-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-20 text-berry">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[18%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,111,145,0.35),transparent_65%)]" />

      <p className="relative z-10 text-center font-display text-xl font-bold italic tracking-wide text-berry/90 sm:text-2xl">aim for the heart</p>

      {/* Heart target */}
      <motion.div ref={heartRef} animate={heart} className="relative z-10 mt-6" aria-hidden="true">
        <motion.svg
          viewBox="0 0 120 108"
          className="h-28 w-28 drop-shadow-[0_14px_24px_rgba(230,60,120,0.35)] sm:h-32 sm:w-32"
          animate={phase === "aim" ? { scale: [1, 1.07, 1] } : undefined}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <radialGradient id="bow-heart" cx="38%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFB3CF" />
              <stop offset="55%" stopColor="#FF4F8B" />
              <stop offset="100%" stopColor="#C81D63" />
            </radialGradient>
          </defs>
          <path d="M60 104 C20 76 2 54 2 32 C2 14 16 2 32 2 C44 2 54 9 60 20 C66 9 76 2 88 2 C104 2 118 14 118 32 C118 54 100 76 60 104 Z" fill="url(#bow-heart)" />
          <ellipse cx="34" cy="26" rx="13" ry="8" fill="white" opacity="0.6" transform="rotate(-20 34 26)" />
        </motion.svg>
      </motion.div>

      <div className="flex-1" />

      {/* Bow + arrow */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Bow. Drag down and release to shoot, or press Enter."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fire(0);
          }
        }}
        className="relative z-10 mb-4 flex h-[230px] w-[240px] touch-none items-start justify-center outline-none focus-visible:rounded-3xl focus-visible:ring-4 focus-visible:ring-berry/30"
        style={{ cursor: dragStart.current !== null ? "grabbing" : "grab" }}
      >
        <svg viewBox="0 0 200 150" className="absolute left-1/2 top-[70px] w-[200px] -translate-x-1/2 overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="bow-wood" x1="0" x2="1">
              <stop offset="0%" stopColor="#6B3A2A" />
              <stop offset="50%" stopColor="#A0623F" />
              <stop offset="100%" stopColor="#6B3A2A" />
            </linearGradient>
          </defs>
          <path d={`M14 96 L100 ${96 + sp} L186 96`} fill="none" stroke="#5A3A4A" strokeWidth="1.6" strokeOpacity="0.8" />
          <path d="M14 96 Q100 0 186 96" fill="none" stroke="url(#bow-wood)" strokeWidth="9" strokeLinecap="round" />
          <rect x="91" y="40" width="18" height="16" rx="4" fill="#3F2430" />
        </svg>

        {phase !== "hit" && (
          <motion.div
            ref={arrowRef}
            animate={arrow}
            className="pointer-events-none absolute left-1/2 top-[10px] -ml-[10px] h-[160px] w-5"
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 160" className="h-full w-full overflow-visible">
              <path d="M10 0 L17 16 L10 12 L3 16 Z" fill="#E8A33A" stroke="#B9781F" strokeWidth="1" />
              <rect x="9" y="12" width="2" height="140" fill="#7A4A35" />
              <path d="M10 138 L2 132 L2 156 L10 150 L18 156 L18 132 Z" fill="#FF4F8B" />
            </svg>
          </motion.div>
        )}
      </div>

      <motion.p
        animate={{ opacity: phase === "aim" ? 1 : 0, y: ratio * 4 }}
        className="relative z-10 text-center text-sm font-bold uppercase tracking-[0.3em] text-berry/70"
      >
        {pull >= FIRE_AT ? "now let go" : "drag back & let go ↓"}
      </motion.p>

      {/* Heart floods the screen */}
      {phase === "hit" && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 rounded-full bg-[radial-gradient(circle_at_40%_35%,#FF5FA2,#B4127A_60%,#7A1FD1)]"
          style={{ left: origin.x - 60, top: origin.y - 60, width: 120, height: 120 }}
          initial={{ scale: 0.6 }}
          animate={{ scale: 30 }}
          transition={{ duration: 0.9, ease: [0.6, 0, 0.4, 1] }}
        />
      )}
    </div>
  );
};
