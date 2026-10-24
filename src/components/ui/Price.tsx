import type { Locale, PriceByMarket } from '@/content/types'
import { priceParts, type Market, type PriceLabels } from '@/lib/market'

// Renders both currencies; CSS shows the active market's (docs/04 §8.2), so there is no
// layout shift and no client JavaScript. Design system Price: a mono label ("Desde") over the
// amount in condensed Archivo 800, then a mono period ("/ mes") that wraps below when tight.

const MONO = 'label-mono text-ink-2'

export function Price({
  price,
  lang,
  labels,
  reserveLabel = false,
}: {
  price: PriceByMarket
  lang: Locale
  labels: PriceLabels
  /** Keep the label line empty when there is none, so amounts align across the plans table */
  reserveLabel?: boolean
}) {
  const one = (market: Market) => {
    const { label, amount, period } = priceParts(price[market], market, lang, labels)
    return (
      <span data-only-market={market}>
        <span className="inline-flex flex-col gap-1.5 tabular-nums">
          {(label || reserveLabel) && (
            <span className={MONO} aria-hidden={label ? undefined : true}>
              {label ?? '\u00a0'}
            </span>
          )}
          <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-price wrap-anywhere stretch-display">{amount}</span>
            {period && <span className={MONO}>{period}</span>}
          </span>
        </span>
      </span>
    )
  }
  return (
    <>
      {one('us')}
      {one('co')}
    </>
  )
}
