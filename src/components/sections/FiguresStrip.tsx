import { site } from '@/content/site'
import type { CaseStudy, Locale, PriceByMarket, SiteContent } from '@/content/types'
import { fillCase } from '@/lib/cases'
import { Price } from '@/components/ui/Price'
import '@/components/hero/figures.css'

// The hero's figures strip (R-06, docs/14 ADR-021): a ruled spec table across the container, 4
// cells in a row from 1024 px and 2 × 2 below. Each value is a big condensed number with its
// unit beside it on the baseline and a sun marker under the number (static now; phase B draws
// it on scroll, ADR-023), over a mono label. A fact whose figure is still null shows its
// fallback in the same place, or is skipped, so there is never a gap (the quote count). The
// price cell is the store plan's starting price in both currencies, shown per market by CSS
// (docs/04 §8.2); while site.features.pricing is off it shows its fallback fact instead
// (ADR-025). Not animated: the numbers are final from the first paint.

// Cells are subgrids of 2 rows (value, label), so values share a baseline across a row even
// when a label wraps to more lines or the price has its "From" line above. Rules: ink above
// and below the strip, paper hairlines between cells; the first column sits flush left.
const CELL =
  'row-span-2 grid min-w-0 grid-rows-subgrid gap-y-3 border-paper-3 py-5 pr-3 even:border-l even:pl-4 nth-[n+3]:border-t sm:pr-4 sm:even:pl-6 lg:gap-y-4 lg:py-7 lg:pr-6 lg:nth-[n+3]:border-t-0 lg:not-first:border-l lg:not-first:pl-6'

const UNIT = 'figures__unit font-bold stretch-heading'

/** "5 business days" → 5 set big, "business days" as its unit; text without a leading number as is */
const LEADING_NUMBER = /^(\d[\d.,]*)\s*(.*)$/

function FactValue({ text }: { text: string }) {
  const match = LEADING_NUMBER.exec(text)
  if (!match) return <span className={UNIT}>{text}</span>
  const [, number, unit] = match
  return (
    <>
      <span className="figures__num stretch-display font-extrabold">{number}</span>
      {unit ? (
        <>
          {/* A real space in the inline flow, so screen readers don't read "5business" */}{' '}
          <span className={UNIT}>{unit}</span>
        </>
      ) : null}
    </>
  )
}

type Cell = { label: string; value: string | null } // null value = the price cell

export function FiguresStrip({
  lang,
  figures,
  study,
  price,
  priceLabels,
}: {
  lang: Locale
  figures: SiteContent['hero']['figures']
  study: CaseStudy // fills {products}, {languages}…
  price: PriceByMarket // pricing.plans[1].price
  priceLabels: SiteContent['pricing']['priceLabels']
}) {
  const cells = figures.items.flatMap((cell): Cell[] => {
    if (cell.kind === 'price') {
      return [site.features.pricing ? { label: cell.label, value: null } : cell.fallback]
    }
    for (const option of [cell, cell.fallback]) {
      if (!option) continue
      const value = fillCase(option.value, study, lang)
      const label = fillCase(option.label, study, lang)
      if (value !== null && label !== null) return [{ label, value }]
    }
    return []
  })
  return (
    <dl
      aria-label={figures.label}
      className="figures grid grid-cols-2 border-y border-ink-1 lg:grid-cols-4"
    >
      {cells.map((cell) => (
        <div key={cell.label} className={CELL}>
          <dt className="row-start-2 label-mono leading-[1.5] text-ink-2">{cell.label}</dt>
          <dd className="figures__value row-start-1 self-end">
            {cell.value === null ? (
              <Price price={price} lang={lang} labels={priceLabels} />
            ) : (
              <FactValue text={cell.value} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
