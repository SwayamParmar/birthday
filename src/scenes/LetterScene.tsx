import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gift } from "@/config/gift";
import { FadeIn, PillButton } from "@/components/Chrome";
import { TypeWriter } from "@/components/TypeWriter";

type Stage = "sealed" | "opening" | "reading";

const FlyingBits = () => {
  const bits = useMemo(
    () =>
      ["💌", "✨", "💗", "🎂", "✨", "💛", "💗"].map((e, i) => ({
        e,
        x: (i - 3) * 34 + (Math.random() * 20 - 10),
        y: -140 - Math.random() * 90,
        r: Math.random() * 60 - 30,
        d: 0.55 + i * 0.06,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/3" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute text-xl"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: b.x, y: b.y, opacity: [0, 1, 0], scale: 1, rotate: b.r }}
          transition={{ delay: b.d, duration: 1.3, ease: "easeOut" }}
        >
          {b.e}
        </motion.span>
      ))}
    </div>
  );
};

const Envelope = ({ open, onOpen }: { open: boolean; onOpen: () => void }) => (
  <button
    type="button"
    onClick={onOpen}
    disabled={open}
    aria-label="Open the letter"
    className="relative mt-8 aspect-[16/10] w-[min(84vw,360px)] outline-none [perspective:900px] focus-visible:drop-shadow-[0_0_14px_rgba(255,181,71,0.8)]"
  >
    <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.28),transparent_65%)]" />
    {/* Back */}
    <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[#C98A2E] to-[#A86C1F]" />
    {/* Letter peeking out */}
    <motion.div
      className="absolute inset-x-[7%] top-[8%] h-[80%] rounded-sm bg-paper shadow"
      initial={false}
      animate={open ? { y: "-55%" } : { y: 0 }}
      transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
    >
      <div className="mx-[12%] mt-[14%] space-y-2.5 opacity-40">
        <div className="h-1.5 w-1/2 rounded bg-plum-700/50" />
        <div className="h-1.5 rounded bg-plum-700/40" />
        <div className="h-1.5 rounded bg-plum-700/40" />
        <div className="h-1.5 w-3/4 rounded bg-plum-700/40" />
      </div>
    </motion.div>
    {/* Front pocket */}
    <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="env-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2B856" />
          <stop offset="100%" stopColor="#D69433" />
        </linearGradient>
      </defs>
      <path d="M0 100 L0 22 L80 64 L160 22 L160 100 Z" fill="url(#env-front)" />
      <path d="M0 100 L68 56 M160 100 L92 56" stroke="#B87A22" strokeWidth="0.8" opacity="0.5" />
    </svg>
    {/* Flap */}
    <motion.div
      className="absolute inset-x-0 top-0 h-[62%] origin-top [transform-style:preserve-3d]"
      initial={false}
      animate={{ rotateX: open ? 180 : 0, zIndex: open ? 0 : 3 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 160 62" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_4px_4px_rgba(90,50,10,0.25)]" aria-hidden="true">
        <defs>
          <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD27A" />
            <stop offset="100%" stopColor="#E5A443" />
          </linearGradient>
        </defs>
        <path d="M0 0 L160 0 L80 62 Z" fill="url(#env-flap)" />
      </svg>
    </motion.div>
    {/* Seal */}
    <motion.div
      className="absolute left-1/2 top-[62%] z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#FFE7B0] bg-gradient-to-br from-rose to-berry font-display text-2xl font-bold text-white shadow-lg"
      animate={open ? { scale: 0, opacity: 0 } : { scale: [1, 1.06, 1] }}
      transition={open ? { duration: 0.25 } : { duration: 1.6, repeat: Infinity }}
      aria-hidden="true"
    >
      {gift.name.trim().charAt(0).toUpperCase()}
    </motion.div>
  </button>
);

/** Step 8: sealed envelope → tap → letter types itself out → signature → Continue. */
export const LetterScene = ({ onDone }: { onDone: () => void }) => {
  const [stage, setStage] = useState<Stage>("sealed");
  const [typed, setTyped] = useState(false);
  const [skip, setSkip] = useState(false);

  const open = () => {
    if (stage !== "sealed") return;
    setStage("opening");
    setTimeout(() => setStage("reading"), 1600);
  };

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 pb-12 pt-20 text-center">
      <AnimatePresence mode="wait">
        {stage !== "reading" ? (
          <motion.div key="envelope" className="flex flex-col items-center" exit={{ opacity: 0, y: 40, transition: { duration: 0.35 } }}>
            <motion.div animate={{ opacity: stage === "sealed" ? 1 : 0 }}>
              <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">Before you go, {gift.name}…</h2>
              <p className="mt-2 text-sm text-cream/75">{gift.sender} left you a note.</p>
            </motion.div>
            <Envelope open={stage === "opening"} onOpen={open} />
            {stage === "opening" && <FlyingBits />}
            <motion.div animate={{ opacity: stage === "sealed" ? 1 : 0 }} className="mt-8 flex flex-col items-center gap-2">
              <motion.span className="text-2xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 1.1, repeat: Infinity }} aria-hidden="true">
                👆
              </motion.span>
              <p className="text-sm font-bold text-cream/85">Tap the envelope</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="letter" className="flex w-full flex-col items-center" initial={{ opacity: 0, scale: 0.85, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 20 }}>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.16),transparent_65%)]" />
            <article
              onClick={() => !typed && setSkip(true)}
              className="letter-paper relative w-full max-w-[34rem] rounded-2xl border border-[#E9CF98] px-6 pb-7 pt-6 text-left shadow-[0_30px_60px_-25px_rgba(0,0,0,0.75)] sm:px-9"
            >
              <h3 className="border-b border-[#E3CFA6] pb-2 font-hand text-3xl font-bold text-[#7A4A1E]">{gift.letter.greeting}</h3>
              <p className="mt-3 font-letter text-[1.15rem] leading-8 text-[#3E2A20] sm:text-[1.25rem]">
                <TypeWriter text={gift.letter.body} speed={32} delay={500} glowTail={6} instant={skip} onComplete={() => setTyped(true)} />
              </p>
              {typed && (
                <FadeIn delay={0.3} className="mt-5 text-right font-hand text-2xl font-bold leading-tight text-[#B5762A]">
                  {gift.signature.map((line, i) => (
                    <span key={i} className="block">
                      {i === gift.signature.length - 1 && gift.signature.length > 1 ? `— ${line}` : line}
                    </span>
                  ))}
                </FadeIn>
              )}
              {!typed && <p className="mt-4 text-right text-xs text-[#9C7A55]/80">tap to skip</p>}
            </article>
            {typed && (
              <FadeIn delay={1.1} className="mt-8">
                <PillButton onClick={onDone}>Continue</PillButton>
              </FadeIn>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
