import type { CSSProperties } from 'react'
import type { SiteContent } from '@/content/types'
import type { trackAttrs } from '@/lib/analytics'
import { Icon } from '@/components/ui/Icon'
import { TIMELINE, type Step } from './timeline'
import './hook.css'

// Hook A (docs/05 §5): a Server Component with no state. Since ADR-020 it lives in tile B of the
// services bento and plays once when it scrolls into view, in CSS only (hook.css). Decorative
// for screen readers: the tile's title and body carry the message, and the link goes to the
// case page (the demo in v2). Its timings come from timeline.ts.

type Stage = SiteContent['services']['stage']

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const // registration marks of the spec sheet

/** Delay (--t) and duration (--d) of one animated element, in ms. */
function at({ t, d }: Step): CSSProperties {
  return { '--t': `${t}ms`, ...(d ? { '--d': `${d}ms` } : {}) } as CSSProperties
}

function BeltIllustration() {
  return (
    <svg viewBox="0 0 72 72" className="hook__img" aria-hidden="true" focusable="false">
      <rect
        x="12"
        y="20"
        width="48"
        height="32"
        rx="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      />
      <rect
        x="12"
        y="20"
        width="48"
        height="32"
        rx="16"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
    </svg>
  )
}

function Cursor() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="hook__cursor"
      data-anim
      style={at(TIMELINE.cursor)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 3l14 8-6 1.5L10 19 5 3Z" fill="currentColor" stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}

export function HookStage({
  stage,
  href,
  track,
  className = '',
}: {
  stage: Stage
  href: string
  /** trackAttrs() of the click, e.g. case_open from 'stage' */
  track?: ReturnType<typeof trackAttrs>
  /** Placement in the tile, e.g. grow to fill a tall tile (the scene scales to the width) */
  className?: string
}) {
  const { product } = stage
  return (
    <a
      href={href}
      className={`hook ${className}`}
      aria-hidden="true"
      tabIndex={-1}
      title={stage.linkTitle}
      {...track}
    >
      {CORNERS.map((corner) => (
        <span key={corner} className={`hook__corner hook__corner--${corner}`} />
      ))}
      <span className="hook__scene">
        <span data-anim className="hook__msg hook__msg--in" style={at(TIMELINE.customer)}>
          {stage.customerMessage}
        </span>
        <span data-anim className="hook__msg hook__msg--out" style={at(TIMELINE.reply)}>
          {stage.businessReply}
        </span>
        <span data-anim className="hook__card" style={at(TIMELINE.card)}>
          <BeltIllustration />
          <span className="hook__brand">{product.brand}</span>
          <span className="hook__name">{product.name}</span>
          <span data-anim className="hook__price" style={at(TIMELINE.price)}>
            <span data-only-market="us">{product.price.us}</span>
            <span data-only-market="co">{product.price.co}</span>{' '}
            <span className="hook__unit">{product.unit}</span>
          </span>
          <span data-anim className="hook__qty" style={at(TIMELINE.qty)}>
            {product.qtyLabel} 20
          </span>
          <span data-anim className="hook__btn" style={at(TIMELINE.press)}>
            {stage.addToCart}
          </span>
        </span>
        <span className="hook__cart">
          <Icon name="cart" className="size-full" />
          <span data-anim className="hook__badge" style={at(TIMELINE.badge)}>
            1
          </span>
        </span>
        <Cursor />
        <span data-anim className="hook__toast" style={at(TIMELINE.toast)}>
          <span className="hook__ok">
            <Icon name="check" className="size-3.5" />
          </span>
          {stage.orderReceived}
        </span>
      </span>
    </a>
  )
}
