import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationControls, type PanInfo } from "framer-motion";
import { Heart, ImageOff } from "lucide-react";
import { gift } from "@/config/gift";
import { asset, cn } from "@/lib/utils";
import { FadeIn, PillButton } from "@/components/Chrome";

const PHOTOS = [1, 2, 3, 4, 5].map((n) => asset(`photos/${n}.jpeg`));
const TILT = [-2.5, 2, -1.5, 2.5, -2];
const GAP = 22;

const Polaroid = ({ src, caption, index, active }: { src: string; caption: string; index: number; active: boolean }) => {
  const [failed, setFailed] = useState(false);
  return (
    <motion.figure
      animate={{ scale: active ? 1 : 0.88, opacity: active ? 1 : 0.55, rotate: TILT[index] }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="relative rounded-[6px] bg-[#FFFBF3] p-2.5 pb-0 shadow-[0_24px_40px_-18px_rgba(0,0,0,0.7)]"
    >
      <div className="aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-plum-700">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-lavender/40 to-rose/40 text-cream/80">
            <ImageOff size={28} aria-hidden="true" />
            <span className="text-xs font-semibold">public/photos/{index + 1}.jpeg</span>
          </div>
        ) : (
          <img src={src} alt={caption || `Memory ${index + 1}`} draggable={false} onError={() => setFailed(true)} className="h-full w-full select-none object-cover" />
        )}
      </div>
      <figcaption className="flex min-h-[3.75rem] items-center justify-center gap-1.5 px-2 py-1.5 text-center font-hand text-lg font-bold leading-tight text-plum-800">
        <span className="line-clamp-2">{caption}</span> <Heart size={16} className="shrink-0 text-marigold" fill="currentColor" stroke="none" aria-hidden="true" />
      </figcaption>
    </motion.figure>
  );
};

/** Step 7: swipeable polaroids hanging from a string of lights. */
export const MemoryLane = ({ onDone }: { onDone: () => void }) => {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(360);
  const [showButton, setShowButton] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const track = useAnimationControls();

  const cardW = Math.min(width * 0.7, 290);
  const targetX = (width - cardW) / 2 - index * (cardW + GAP);

  useLayoutEffect(() => {
    const measure = () => setWidth(viewportRef.current?.clientWidth ?? window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    track.start({ x: targetX, transition: { type: "spring", stiffness: 260, damping: 30 } });
  }, [targetX, track]);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(PHOTOS.length - 1, i))), []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -cardW * 0.2) go(index + 1);
    else if (swipe > cardW * 0.2) go(index - 1);
    else track.start({ x: targetX, transition: { type: "spring", stiffness: 260, damping: 30 } });
  };

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-0 pb-12 pt-20 text-center">
      <h2 className="px-5 font-display text-2xl font-bold text-cream sm:text-3xl">Little moments</h2>
      <p className="mt-2 px-5 text-sm text-cream/75">swipe to look back 📷</p>

      <div
        ref={viewportRef}
        className="relative mt-8 w-full max-w-3xl overflow-hidden pb-6 pt-6 outline-none"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Photo ${index + 1} of ${PHOTOS.length}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
      >
        {/* String of lights */}
        <div aria-hidden="true" className="absolute inset-x-0 top-6 h-px bg-gradient-to-r from-transparent via-cream/40 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-[21px] flex justify-around px-6">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="string-light h-2 w-2 rounded-full bg-marigold" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        <motion.div
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ gap: GAP }}
          drag="x"
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          animate={track}
          initial={{ x: targetX }}
        >
          {PHOTOS.map((src, i) => (
            <div key={src} className="relative shrink-0 pt-3" style={{ width: cardW }} onClick={() => i !== index && go(i)}>
              {i === index && <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-6 w-3 -translate-x-1/2 rounded-sm bg-gradient-to-b from-[#E9C77B] to-[#B8893A] shadow" />}
              <Polaroid src={src} caption={gift.photoCaptions[i]} index={i} active={i === index} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-2 flex gap-2.5" role="tablist" aria-label="Choose photo">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1}`}
            onClick={() => go(i)}
            className="grid h-6 w-6 place-items-center"
          >
            <span className={cn("block h-2 rounded-full transition-all duration-300", i === index ? "w-5 bg-marigold" : "w-2 bg-cream/35")} />
          </button>
        ))}
      </div>

      {showButton && (
        <FadeIn className="mt-7">
          <PillButton onClick={onDone}>Keep going <Heart size={18} className="text-marigold" fill="currentColor" stroke="none" aria-hidden="true" /></PillButton>
        </FadeIn>
      )}
    </div>
  );
};
