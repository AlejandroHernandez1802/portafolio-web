import type { CSSProperties, ReactNode } from 'react'
import { HEADLINE } from './timeline'
import './headline.css'

// The hero H1 (design system components/hero/HeroHeadline). With two curly-quoted phrases the
// first, the old way, is struck through and the second, the new way, gets the sun-yellow marker:
// the strike at ~0.4 s, the marker at ~1.0 s (HEADLINE in timeline.ts; no stage to sync with
// since R-06). Any other headline renders as plain text.
//
// The H1 is the LCP element, so its text is never animated: only pseudo-elements draw in. They
// hang off each word, not the phrase, because a positioned decoration can't follow an inline box
// across a line break, and the phrases do wrap on narrow phones. Words keep their trailing space,
// so screen readers get the sentence as plain text and the stroke bridges the gaps mid-line.
//
// A question before the first phrase ("No website, or an outdated one?") names who the headline
// is for: it is set on its own line, a step smaller, so the struck and marked phrases keep the
// display size (ADR-024). It stays inside the H1, so the sentence reads as one. With it the
// display steps down to 7 rem (headline--audience), so the phrases still take two lines on
// desktop instead of three.

type Draw = { t: number; d: number } // delay and duration of the whole stroke, in ms

const QUOTED = /(“[^”]*”)/ // the capture group keeps the phrases in split()
const AUDIENCE = /^([^“]*\?)\s+/ // a leading question, before any quote

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
        {words(part, HEADLINE[kind]).map(({ text, style }, j) => (
          <span key={j} className="headline__word" style={style}>
            {text}
          </span>
        ))}
      </span>
    )
  })
}

/** The audience line, if any, then the decorated rest. */
function headline(text: string): ReactNode {
  const audience = text.match(AUDIENCE)
  if (!audience) return decorate(text)
  return (
    <>
      <span className="headline__audience">{audience[1]}</span>{' '}
      {decorate(text.slice(audience[0].length))}
    </>
  )
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
    <h1
      id={id}
      className={`stretch-display text-display ${AUDIENCE.test(children) ? 'headline--audience' : ''} ${className}`}
    >
      {headline(children)}
    </h1>
  )
}
