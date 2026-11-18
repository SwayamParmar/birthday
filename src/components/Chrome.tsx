import { useMemo, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { cn, seeded } from "@/lib/utils";

/* ── Top bar ───────────────────────────────────────────── */

interface TopBarProps {
  onBack?: () => void;
  music: { available: boolean; muted: boolean; toggle: () => void };
  tone?: "dark" | "light";
}

export const TopBar = ({ onBack, music, tone = "dark" }: TopBarProps) => {
  const btn =
    tone === "dark"
      ? "bg-white/10 text-white/90 hover:bg-white/20 border-white/10"
      : "bg-plum-900/10 text-plum-900 hover:bg-plum-900/15 border-plum-900/10";
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)]">
      {onBack ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className={cn("pointer-events-auto flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold backdrop-blur-md transition", btn)}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
      ) : (
        <span />
      )}
      {music.available && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            music.toggle();
          }}
          aria-label={music.muted ? "Unmute music" : "Mute music"}
          aria-pressed={music.muted}
          className={cn("pointer-events-auto grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition", btn)}
        >
          {music.muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
        </button>
      )}
    </header>
  );
};

/* ── Night sky backdrop for the dark scenes ────────────── */

export const NightSky = () => {
  const stars = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      top: rnd() * 100,
      size: 1 + rnd() * 2.2,
      delay: rnd() * 4,
      duration: 2.5 + rnd() * 3,
    }));
  }, []);
  const sparkles = useMemo(() => {
    const rnd = seeded(21);
    return Array.from({ length: 6 }, (_, i) => ({ id: i, left: 5 + rnd() * 90, top: 10 + rnd() * 80, delay: rnd() * 3 }));
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night">
      <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(110,80,230,0.28),transparent_65%)]" />
      <div className="absolute -bottom-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(230,70,140,0.22),transparent_65%)]" />
      <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.10),transparent_65%)]" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="star absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
        />
      ))}
      {sparkles.map((s) => (
        <span key={s.id} className="sparkle absolute text-marigold/70" style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}>
          ✦
        </span>
      ))}
    </div>
  );
};

/* ── Buttons & helpers ─────────────────────────────────── */

export const PillButton = ({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...props}
    className={cn(
      "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose to-tangerine px-10 text-lg font-bold text-white shadow-glow transition active:scale-[0.97] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marigold",
      className,
    )}
  >
    {children}
  </button>
);

export const FadeIn = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

export const TapHint = ({ className, children = "tap anywhere to continue" }: { className?: string; children?: ReactNode }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.55, 1] }}
    transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse" }}
    className={cn("text-sm font-semibold tracking-wide", className)}
  >
    {children}
  </motion.p>
);
