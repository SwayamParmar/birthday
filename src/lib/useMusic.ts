import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "./utils";

const MUTE_KEY = "gift:muted";
const VOLUME = 0.35;

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Plays public/music.mp3 (if it exists) from the first tap anywhere.
 * `available` stays false when the file is missing, so the UI can hide the toggle.
 */
export const useMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [available, setAvailable] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Detect the file. Vite's dev server answers missing files with index.html,
  // so check the content type instead of only the status.
  useEffect(() => {
    let cancelled = false;
    const url = asset("music.mp3");
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const type = res.headers.get("content-type") ?? "";
        if (cancelled || !res.ok || type.includes("text/html")) return;
        const audio = new Audio(url);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = VOLUME;
        audio.addEventListener("error", () => setAvailable(false));
        audioRef.current = audio;
        setAvailable(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Start on the first user gesture (browsers block autoplay before that).
  useEffect(() => {
    if (!available) return;
    const start = () => {
      const audio = audioRef.current;
      if (!audio || mutedRef.current || !audio.paused) return;
      audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [available]);

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        /* storage unavailable */
      }
      const audio = audioRef.current;
      if (audio) {
        if (next) audio.pause();
        else audio.play().catch(() => {});
      }
      return next;
    });
  }, []);

  return { available, muted, toggle };
};
