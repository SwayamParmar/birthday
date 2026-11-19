import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gift } from "@/config/gift";
import { useMusic } from "@/lib/useMusic";
import { NightSky, TopBar } from "@/components/Chrome";
import { HeartIntro } from "@/scenes/HeartIntro";
import { PinLock } from "@/scenes/PinLock";
import { BowScene } from "@/scenes/BowScene";
import { TitleCard } from "@/scenes/TitleCard";
import { TreeScene } from "@/scenes/TreeScene";
import { CakeScene } from "@/scenes/CakeScene";
import { BalloonScene } from "@/scenes/BalloonScene";
import { MemoryLane } from "@/scenes/MemoryLane";
import { LetterScene } from "@/scenes/LetterScene";
import { FinaleScene } from "@/scenes/FinaleScene";

import { STEPS, type Step } from "@/steps";

const DARK: Step[] = ["cake", "balloons", "memories", "letter", "finale"];
/** Steps that can't be returned to with Back (lock screen, auto-playing title card). */
const NOT_BACK_TARGETS: Step[] = ["pin", "title"];

export const Gift = () => {
  const [intro, setIntro] = useState(true);
  const [step, setStep] = useState<Step>("pin");
  const music = useMusic();
  const endIntro = useCallback(() => setIntro(false), []);
  const index = STEPS.indexOf(step);
  const isDark = DARK.includes(step);

  const next = useCallback(() => setStep((s) => STEPS[Math.min(STEPS.indexOf(s) + 1, STEPS.length - 1)]), []);
  const back = useCallback(() => {
    setStep((s) => {
      let i = STEPS.indexOf(s) - 1;
      while (i > 0 && NOT_BACK_TARGETS.includes(STEPS[i])) i--;
      return STEPS[Math.max(i, 1)];
    });
  }, []);
  const replay = useCallback(() => setStep("bow"), []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    document.title = `🎂 For ${gift.name}`;
  }, []);

  const scene = (() => {
    switch (step) {
      case "pin":
        return <PinLock onUnlock={next} />;
      case "bow":
        return <BowScene onDone={next} />;
      case "title":
        return <TitleCard onDone={next} />;
      case "tree":
        return <TreeScene onDone={next} />;
      case "cake":
        return <CakeScene onDone={next} />;
      case "balloons":
        return <BalloonScene onDone={next} />;
      case "memories":
        return <MemoryLane onDone={next} />;
      case "letter":
        return <LetterScene onDone={next} />;
      case "finale":
        return <FinaleScene onReplay={replay} />;
    }
  })();

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden">
      {isDark && <NightSky />}
      {!intro && step !== "title" && <TopBar onBack={index > 1 ? back : undefined} music={music} tone={isDark ? "dark" : "light"} />}
      <AnimatePresence mode="wait">
        {intro ? (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <HeartIntro onDone={endIntro} />
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: step === "title" ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: step === "bow" ? 1 : 0 }}
            transition={{ duration: 0.45 }}
          >
            {scene}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
