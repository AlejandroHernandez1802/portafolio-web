// Hook A timeline (docs/05 §3), in ms: t = delay, d = duration. One source for the stage
// (HookStage) and the H1 decorations (HeroHeadline), so the strike and the marker can't drift
// from the reply bubble and the button press.

export type Step = { t: number; d?: number }

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
  // H1: the old way is struck as the reply shows, the new way is marked with the press
  strike: { t: reply.t + 200, d: 500 },
  mark: { t: press.t, d: 450 },
} satisfies Record<string, Step>
