import type { CSSProperties } from 'react'
import type { SiteContent } from '@/content/types'
import { Icon } from '@/components/ui/Icon'
import './hook.css'

// Hook A (docs/05 §5): a Server Component with no state. Decorative for screen readers: the
// H1 and subtitle carry the message, and the link goes where the secondary CTA goes.

type Stage = SiteContent['hero']['stage']

/** Delay (--t) and duration (--d) of one animated element, in ms. */
function at(t: number, d?: number): CSSProperties {
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
      style={at(3000, 700)}
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
      <span className="hook__scene">
        <span data-anim className="hook__msg hook__msg--in" style={at(0, 2200)}>
          {stage.customerMessage}
        </span>
        <span data-anim className="hook__msg hook__msg--out" style={at(1000, 1200)}>
          {stage.businessReply}
        </span>
        <span data-anim className="hook__card" style={at(1800, 800)}>
          <BeltIllustration />
          <span className="hook__brand">{product.brand}</span>
          <span className="hook__name">{product.name}</span>
          <span data-anim className="hook__price" style={at(2400)}>
            <span data-only-market="us">{product.price.us}</span>
            <span data-only-market="co">{product.price.co}</span>{' '}
            <span className="hook__unit">{product.unit}</span>
          </span>
          <span data-anim className="hook__qty" style={at(2600)}>
            {product.qtyLabel} 20
          </span>
          <span data-anim className="hook__btn" style={at(3300, 200)}>
            {stage.addToCart}
          </span>
        </span>
        <span className="hook__cart">
          <Icon name="cart" className="size-full" />
          <span data-anim className="hook__badge" style={at(3400, 250)}>
            1
          </span>
        </span>
        <Cursor />
        <span data-anim className="hook__toast" style={at(3600, 500)}>
          <Icon name="check" className="size-5" />
          {stage.orderReceived}
        </span>
      </span>
    </a>
  )
}
