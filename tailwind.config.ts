import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: { 900: "#160B26", 800: "#24123A", 700: "#3A1E55" },
        ivory: "#FFF9F2",
        ink: "#2B1B3D",
        lilac: "#E2D4F3",
        violet: { DEFAULT: "#6C3BD1", deep: "#9B3FC4" },
        rose: { DEFAULT: "#FF6F91", deep: "#E0456B" },
        tangerine: "#FF9A62",
        marigold: "#FFB547",
        cream: "#FFF4E8",
        mint: "#2FAF7F",
        berry: "#A3195B",
        lavender: "#9D7BFF",
        aqua: "#3DDBD9",
        paper: "#FFF8EA",
      },
      fontFamily: {
        sans: ["Quicksand", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
        letter: ["Kalam", "cursive"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      backgroundImage: {
        night: "linear-gradient(180deg, #120822 0%, #22103A 55%, #3A1438 100%)",
        dawn: "linear-gradient(180deg, #FFF3EC 0%, #FFDDE3 100%)",
        blush: "linear-gradient(160deg, #FFF2E8 0%, #FFD9DC 60%, #FFCBC4 100%)",
      },
      boxShadow: {
        glow: "0 12px 32px -10px rgba(255, 111, 145, 0.65)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
