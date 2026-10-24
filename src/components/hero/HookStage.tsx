import type { CSSProperties } from 'react'
import type { SiteContent } from '@/content/types'
import { Icon } from '@/components/ui/Icon'
import { TIMELINE, type Step } from './timeline'
import './hook.css'

// Hook A (docs/05 §5): a Server Component with no state. Decorative for screen readers: the
// H1 and subtitle carry the message, and the link goes where the secondary CTA goes. Its
// timings come from timeline.ts, shared with HeroHeadline.

type Stage = SiteContent['hero']['stage']

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

export function HookStage({ stage, href }: { stage: Stage; href: string }) {
  const { product } = stage
  return (
    <a href={href} className="hook" aria-hidden="true" tabIndex={-1} title={stage.linkTitle}>
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
