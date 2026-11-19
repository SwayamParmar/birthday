/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ─────────────────────────────────────────────────────────────
 *  Replace every placeholder below with your own words.
 *
 *  Assets (optional, drop them into /public):
 *    public/photos/1.jpeg … public/photos/5.jpeg   → memory lane polaroids
 *    public/music/blue-instrumental.mp3          → background music
 *                                                  (mute button appears
 *                                                  only if this file exists)
 * ─────────────────────────────────────────────────────────────
 */

export interface GiftConfig {
  /** Birthday person's name, shown throughout. */
  name: string;
  /** Your name, shown on the lock screen, letter and finale. */
  sender: string;
  /** 4-digit code that unlocks the gift. Checked in the browser only. */
  pin: string;
  /** Exactly 5 reasons — one per balloon, revealed in pop order. */
  reasons: [string, string, string, string, string];
  /** The letter revealed at the end. */
  letter: {
    greeting: string;
    body: string;
  };
  /** Sign-off under the letter. Each array entry is its own line. */
  signature: string[];
  /** Optional captions under each polaroid (same order as the photo files). */
  photoCaptions: [string, string, string, string, string];
}

const NAME = "Needhi"; // ← recipient
const SENDER = "Swayam"; // ← you

export const gift: GiftConfig = {
  name: NAME,
  sender: SENDER,
  pin: "2011", // ← change me (4 digits)

  reasons: [
    "You're my comfort person in a world full of chaos🧿🤍",
    "Just having you around makes everything feel easier",
    "With you, I can be my silly, weird, real self🤪💗",
    "You make me feel so loved, and you don't even try",
    "My best friend, and one of my favourite blessings🧿✨",
  ],

  letter: {
    greeting: `Dear ${NAME},`,
    body: [
      "Happy Birthday to my favourite human! 🎀",
      "I honestly don't know where to start, but I'm so grateful to have you in my life.",
      "Who would've thought our first meet at the ISKCON temple, and then Juhu Beach, would turn into such a beautiful friendship? " +
        "And our next meet, watching a movie together, gave us even more memories to hold on to. " +
        "I'm so glad we met, and that life gave me a friend like you.",
      "Thank you for being your lovely self, and for making even the ordinary moments feel special. " +
        "I hope you always keep smiling and get everything your heart wishes for.",
      "Stay happy, stay blessed and never change ❤️🎉",
    ].join("\n\n"),
  },

  // The letter scene prefixes the last line with "— ", giving "With love, — Swayam".
  signature: ["With love,", SENDER],

  photoCaptions: [
    "That smile in the golden light, my favourite view",
    "Denim jacket, neon lights and that little smirk",
    "Hair flip queen, main character energy always",
    "Golden hour, but your smile still wins every time",
    "Pout mode on, and somehow still the cutest",
  ],
};
