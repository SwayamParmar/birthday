import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { gift } from "@/config/gift";
import { useConfetti } from "@/lib/useConfetti";
import { Fireworks } from "@/components/Fireworks";
import { FadeIn, PillButton } from "@/components/Chrome";

/** Step 10: the big finish — confetti rain, fireworks, and a Replay button. */
export const FinaleScene = ({ onReplay }: { onReplay: () => void }) => {
  const { burst, rain } = useConfetti();

  useEffect(() => {
    burst(0.5, 0.35, { spread: 120, startVelocity: 45 });
    rain(Infinity);
  }, [burst, rain]);

  return (
    <>
      <Fireworks />
      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 pb-12 pt-20 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.2, 0.9, 0.3, 1.2] }}
          className="font-display text-[clamp(3rem,15vw,6.5rem)] font-black uppercase leading-[0.95] tracking-tight text-cream [text-shadow:0_0_40px_rgba(255,220,180,0.35)]"
        >
          Happy
          <br />
          Birthday
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-2 font-hand text-[clamp(3rem,14vw,5.5rem)] font-bold leading-none text-marigold [text-shadow:0_0_30px_rgba(255,181,71,0.45)]"
        >
          {gift.name}!
        </motion.p>

        <motion.div
          aria-hidden="true"
          className="mt-8 text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { delay: 1.2 }, y: { delay: 1.2, duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
        >
          🎉
        </motion.div>

        <FadeIn delay={2.2} className="mt-8">
          <p className="text-base text-cream/85">
            Made for you by <span className="font-bold text-marigold">{gift.sender}</span> ❤️
          </p>
        </FadeIn>
        <FadeIn delay={2.8} className="mt-6">
          <PillButton onClick={onReplay}>
            <RotateCcw size={20} aria-hidden="true" /> Replay
          </PillButton>
        </FadeIn>
      </div>
    </>
  );
};
