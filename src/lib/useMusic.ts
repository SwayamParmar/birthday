import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "./utils";

const MUSIC_FILE = "music/blue-instrumental.mp3";
const MUTE_KEY = "gift:muted";
const VOLUME = 0.3;
const FADE_IN_S = 2.5;
const FADE_OUT_S = 0.4;

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
};

type Ctx = typeof AudioContext;
const getAudioContextCtor = (): Ctx | undefined =>
  window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctx }).webkitAudioContext;

/**
 * Looping background music from public/music/, started on the first user tap.
 * Volume goes through a Web Audio gain node, because iOS ignores
 * HTMLAudioElement.volume; falls back to element volume where Web Audio is missing.
 * Lives in <Gift>, above the steps, so it keeps playing across step changes.
 * `available` stays false when the file is missing, so the UI can hide the toggle.
 */
export const useMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const [available, setAvailable] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Detect the file. Vite's dev server answers missing files with index.html,
  // so check the content type instead of only the status.
  useEffect(() => {
    let cancelled = false;
    const url = asset(MUSIC_FILE);
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const type = res.headers.get("content-type") ?? "";
        if (cancelled || !res.ok || type.includes("text/html")) return;
        const audio = new Audio(url);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = 0;
        audio.addEventListener("error", () => setAvailable(false));
        audioRef.current = audio;
        setAvailable(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (fadeTimer.current) window.clearInterval(fadeTimer.current);
      audioRef.current?.pause();
      audioRef.current = null;
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      gainRef.current = null;
    };
  }, []);

  /** Wire the element through a gain node. Must run inside a user gesture. */
  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;
    const Ctor = getAudioContextCtor();
    if (!Ctor) return;
    try {
      const ctx = new Ctor();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
      audio.volume = 1; // the gain node controls loudness from here on
      ctxRef.current = ctx;
      gainRef.current = gain;
    } catch {
      /* fall back to element volume */
    }
  }, []);

  /** Smoothly move to `target` volume over `seconds`, then run `done`. */
  const fadeTo = useCallback((target: number, seconds: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeTimer.current) window.clearInterval(fadeTimer.current);
    fadeTimer.current = null;

    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (ctx && gain) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(target, now + seconds);
      if (done) fadeTimer.current = window.setTimeout(done, seconds * 1000);
      return;
    }

    const from = audio.volume;
    const start = performance.now();
    fadeTimer.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / (seconds * 1000));
      audio.volume = from + (target - from) * t;
      if (t >= 1) {
        if (fadeTimer.current) window.clearInterval(fadeTimer.current);
        fadeTimer.current = null;
        done?.();
      }
    }, 50);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureGraph();
    ctxRef.current?.resume().catch(() => {});
    audio
      .play()
      .then(() => fadeTo(VOLUME, FADE_IN_S))
      .catch(() => {});
  }, [ensureGraph, fadeTo]);

  // Start on the first user gesture (browsers block autoplay before that).
  useEffect(() => {
    if (!available) return;
    const start = () => {
      const audio = audioRef.current;
      if (!audio || mutedRef.current || !audio.paused) return;
      play();
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [available, play]);

  const toggle = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (next) fadeTo(0, FADE_OUT_S, () => mutedRef.current && audio.pause());
    else play();
  }, [fadeTo, play]);

  return { available, muted, toggle };
};
