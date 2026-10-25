// Animation timings in ms (docs/05 §3): t = delay, d = duration.

export type Step = { t: number; d?: number }

// The H1 decorations (HeroHeadline). Since R-06 the hero has no stage to sync with (it moved to
// services tile B), so the H1 tells the story on its own, right after the first paint: the old
// way is struck at ~0.4 s and the new way marked at ~1.0 s, once the strike has landed.
export const HEADLINE = {
  strike: { t: 400, d: 500 },
  mark: { t: 1000, d: 450 },
} satisfies Record<string, Step>

// Hook A (HookStage, services tile B), from the moment the scene starts. The bubbles, card,
// cursor and toast keep their relative order; nothing here drives the H1 any more.
const reply = { t: 1000, d: 1200 } // "Call for pricing": fully visible at ~1.18 s (15 % in)
const press = { t: 3300, d: 200 } // the cursor presses "Add to cart"

export const TIMELINE = {
  customer: { t: 0, d: 2200 },
  reply,
  card: { t: 1800, d: 800 },
  price: { t: 2400 },
  qty: { t: 2600 },
  cursor: { t: 3000, d: 700 },
  press,
  badge: { t: 3400, d: 250 },
  toast: { t: 3600, d: 500 },
} satisfies Record<string, Step>
