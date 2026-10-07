import type { Locale, PriceByMarket } from '@/content/types'
import { formatPrice, type PriceLabels } from '@/lib/market'

// Renders both currencies; CSS shows the active market's (docs/04 §8.2), so there is no
// layout shift and no client JavaScript.
export function Price({
  price,
  lang,
  labels,
}: {
  price: PriceByMarket
  lang: Locale
  labels: PriceLabels
}) {
  return (
    <>
      <span data-only-market="us">{formatPrice(price.us, 'us', lang, labels)}</span>
      <span data-only-market="co">{formatPrice(price.co, 'co', lang, labels)}</span>
    </>
  )
}
