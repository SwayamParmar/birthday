import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Lock } from "lucide-react";
import { gift } from "@/config/gift";
import { cn } from "@/lib/utils";

const LENGTH = 4;

export const PinLock = ({ onUnlock }: { onUnlock: () => void }) => {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [status, setStatus] = useState<"idle" | "wrong" | "ok">("idle");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const shake = useAnimationControls();

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const focus = (i: number) => inputs.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();

  const setAt = (i: number, value: string) => {
    setStatus((s) => (s === "wrong" ? "idle" : s));
    setDigits((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const handleChange = (i: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setAt(i, "");
      return;
    }
    if (value.length > 1) {
      fill(value, i);
      return;
    }
    setAt(i, value);
    if (i < LENGTH - 1) focus(i + 1);
  };

  const fill = (value: string, from = 0) => {
    const chars = value.replace(/\D/g, "").slice(0, LENGTH - from).split("");
    setStatus("idle");
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, k) => (next[from + k] = c));
      return next;
    });
    focus(from + chars.length);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setAt(i - 1, "");
      focus(i - 1);
    } else if (e.key === "ArrowLeft") focus(i - 1);
    else if (e.key === "ArrowRight") focus(i + 1);
    else if (e.key === "Enter") submit();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(e.clipboardData.getData("text"));
  };

  const submit = () => {
    if (status === "ok") return;
    const code = digits.join("");
    if (code.length < LENGTH) {
      focus(digits.findIndex((d) => !d));
      return;
    }
    if (code === gift.pin) {
      setStatus("ok");
      inputs.current.forEach((el) => el?.blur());
      setTimeout(onUnlock, 1100);
    } else {
      setStatus("wrong");
      shake.start({ x: [0, -10, 10, -8, 8, -4, 0], transition: { duration: 0.45 } });
      setTimeout(() => {
        setDigits(Array(LENGTH).fill(""));
        focus(0);
      }, 450);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-ivory px-5 py-10 text-ink">
      <form
        className="flex w-full max-w-sm flex-col items-center text-center"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {/* Envelope */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={status === "ok" ? { y: -6, rotate: [0, -4, 4, 0], opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-6 h-[104px] w-[160px] rounded-2xl border-2 border-lilac bg-white shadow-[0_10px_30px_-12px_rgba(91,42,134,0.35)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 160 104" className="absolute inset-0 h-full w-full">
            <path d="M6 8 L80 58 L154 8" fill="none" stroke="#E2D4F3" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
          <div
            className={cn(
              "absolute left-1/2 top-[58px] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-md transition-colors duration-500",
              status === "ok" ? "bg-mint" : "bg-violet",
            )}
          >
            <Lock size={20} strokeWidth={2.4} />
          </div>
        </motion.div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-rose-deep">Sealed with love</p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">Hey {gift.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink/70">
          {gift.sender} tucked something away for you. Enter the 4-digit code to unwrap it.
        </p>

        <motion.div animate={shake} className="mt-7 flex gap-3" role="group" aria-label="4-digit code">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LENGTH}
              aria-label={`Digit ${i + 1}`}
              disabled={status === "ok"}
              className={cn(
                "h-16 w-14 rounded-2xl border-2 bg-white text-center text-2xl font-bold text-ink outline-none transition-colors duration-300",
                "focus:border-violet focus:ring-4 focus:ring-violet/15",
                status === "ok" && "border-mint bg-mint/10",
                status === "wrong" && "border-rose-deep bg-rose-deep/5",
                status === "idle" && (d ? "border-violet/40" : "border-lilac"),
              )}
            />
          ))}
        </motion.div>

        <p
          aria-live="polite"
          className={cn("mt-4 min-h-[1.5rem] text-sm", status === "ok" ? "font-semibold text-mint" : status === "wrong" ? "font-semibold text-rose-deep" : "text-ink/55")}
        >
          {status === "ok" ? "Unwrapping…" : status === "wrong" ? "Not quite. Try again." : `Don't know it? Ask ${gift.sender}.`}
        </p>

        <button
          type="submit"
          disabled={status === "ok"}
          className="mt-5 min-h-[54px] w-full rounded-2xl bg-gradient-to-r from-violet to-violet-deep text-lg font-bold text-white shadow-[0_12px_24px_-10px_rgba(108,59,209,0.6)] transition active:scale-[0.98] hover:brightness-110 disabled:opacity-80"
        >
          Unwrap
        </button>
      </form>
    </div>
  );
};
