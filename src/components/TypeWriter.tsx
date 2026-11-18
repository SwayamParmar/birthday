import { useEffect, useMemo, useRef, useState } from "react";

interface TypeWriterProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** ms before typing starts */
  delay?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
  /** Give the last N revealed characters a soft glow that fades out. */
  glowTail?: number;
  /** Jump straight to the full text. */
  instant?: boolean;
}

interface GraphemeSegmenter {
  segment(input: string): Iterable<{ segment: string }>;
}
interface IntlWithSegmenter {
  Segmenter: new (locales?: string | string[], options?: { granularity: "grapheme" }) => GraphemeSegmenter;
}

/** Split into user-perceived characters so emoji are never cut in half. */
const splitGraphemes = (str: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as unknown as IntlWithSegmenter).Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (s) => s.segment);
  }
  return Array.from(str);
};

/**
 * Typewriter effect. The not-yet-typed text is rendered invisibly so the
 * paragraph's layout is fixed from the start: words wrap normally and never
 * jump to the next line halfway through being typed.
 */
export const TypeWriter = ({
  text,
  speed = 40,
  delay = 0,
  className = "",
  onComplete,
  cursor = false,
  glowTail = 0,
  instant = false,
}: TypeWriterProps) => {
  const graphemes = useMemo(() => splitGraphemes(text), [text]);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(delay === 0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const firedRef = useRef(false);

  useEffect(() => {
    setIndex(0);
    firedRef.current = false;
    if (delay === 0) {
      setStarted(true);
      return;
    }
    setStarted(false);
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  useEffect(() => {
    if (instant) setIndex(graphemes.length);
  }, [instant, graphemes.length]);

  useEffect(() => {
    if (!started) return;
    if (index < graphemes.length) {
      const t = setTimeout(() => setIndex((i) => i + 1), speed);
      return () => clearTimeout(t);
    }
    if (!firedRef.current) {
      firedRef.current = true;
      completeRef.current?.();
    }
  }, [started, index, graphemes.length, speed]);

  const done = index >= graphemes.length;
  const tailStart = Math.max(0, index - glowTail);
  const settled = graphemes.slice(0, done ? index : tailStart).join("");
  const tail = done ? [] : graphemes.slice(tailStart, index);
  const hidden = graphemes.slice(index).join("");

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {settled}
        {tail.map((ch, i) => (
          <span key={tailStart + i} className="tw-glow" style={{ opacity: 0.55 + (0.45 * (i + 1)) / tail.length }}>
            {ch}
          </span>
        ))}
        {cursor && !done && <span className="tw-cursor" />}
        <span className="invisible">{hidden}</span>
      </span>
    </span>
  );
};
