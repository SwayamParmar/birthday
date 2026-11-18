/** The flow, in order. (The spec's step 9, the surprise video, is intentionally left out.) */
export const STEPS = ["pin", "bow", "title", "tree", "cake", "balloons", "memories", "letter", "finale"] as const;
export type Step = (typeof STEPS)[number];
