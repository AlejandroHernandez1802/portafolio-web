import type { CSSProperties, ReactNode } from 'react'
import { TIMELINE } from './timeline'
import './headline.css'

// The hero H1 (design system components/hero/HeroHeadline). With two curly-quoted phrases the
// first, the old way, is struck through and the second, the new way, gets the sun-yellow marker,
// in sync with the stage (timeline.ts, docs/05 §3): the strike as "Call for pricing" shows, the
// marker as the cursor presses "Add to cart". Any other headline renders as plain text.
//
// The H1 is the LCP element, so its text is never animated: only pseudo-elements draw in. They
// hang off each word, not the phrase, because a positioned decoration can't follow an inline box
// across a line break, and the phrases do wrap on narrow phones. Words keep their trailing space,
// so screen readers get the sentence as plain text and the stroke bridges the gaps mid-line.

type Draw = { t: number; d: number } // delay and duration of the whole stroke, in ms

const QUOTED = /(“[^”]*”)/ // the capture group keeps the phrases in split()

/** Words with their trailing space, each drawing its share of the stroke by length (--t, --d). */
function words(phrase: string, draw: Draw) {
  const at = (chars: number) => Math.round(draw.t + (draw.d * chars) / phrase.length)
  const parts: Array<{ text: string; style: CSSProperties }> = []
  let start = 0
  for (const text of phrase.match(/\S+\s*/g) ?? []) {
    const end = start + text.length
    // Each word starts exactly where the previous one ends: one continuous stroke
    const style = { '--t': `${at(start)}ms`, '--d': `${at(end) - at(start)}ms` } as CSSProperties
    parts.push({ text, style })
    start = end
  }
  return parts
}

function decorate(text: string): ReactNode {
  const parts = text.split(QUOTED) // phrases land on odd indexes
  if (parts.length < 5) return text // fewer than two phrases: nothing to tell
  return parts.map((part, i) => {
    const kind = i === 1 ? 'strike' : i === 3 ? 'mark' : null
    if (!kind) return part
    return (
      <span key={i} className={`headline__${kind}`}>
        {words(part, TIMELINE[kind]).map(({ text, style }, j) => (
          <span key={j} className="headline__word" style={style}>
            {text}
          </span>
        ))}
      </span>
    )
  })
}

export function HeroHeadline({
  id,
  className = '',
  children,
}: {
  id: string
  className?: string
  /** The active headline, with curly quotes “…” around the phrases to decorate */
  children: string
}) {
  return (
    <h1 id={id} className={`text-display stretch-display ${className}`}>
      {decorate(children)}
    </h1>
  )
}
