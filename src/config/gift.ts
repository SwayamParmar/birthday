/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ─────────────────────────────────────────────────────────────
 *  Replace every placeholder below with your own words.
 *
 *  Assets (optional, drop them into /public):
 *    public/photos/1.jpg … public/photos/5.jpg   → memory lane polaroids
 *    public/music.mp3                            → background music
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

const NAME = "Their Name"; // ← recipient
const SENDER = "Your Name"; // ← you

export const gift: GiftConfig = {
  name: NAME,
  sender: SENDER,
  pin: "1234", // ← change me (4 digits)

  reasons: [
    "Reason #1: something small you adore about them",
    "Reason #2: a moment they made better just by being there",
    "Reason #3: a way they've helped you grow",
    "Reason #4: something about them that always makes you smile",
    "Reason #5: why the world is lucky to have them",
  ],

  letter: {
    greeting: `Dear ${NAME},`,
    body:
      "Write your letter here. Tell them what this past year meant, a memory you keep coming back to, " +
      "and what you hope the next one brings. Keep it honest — it will appear one letter at a time, " +
      "so a few heartfelt sentences go a long way.",
  },

  signature: ["Always yours,", `${SENDER}`],

  photoCaptions: ["Caption one", "Caption two", "Caption three", "Caption four", "Caption five"],
};
