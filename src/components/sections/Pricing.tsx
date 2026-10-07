import type { Locale, SiteContent } from '@/content/types'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { MarketToggle } from '@/components/market/MarketToggle'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 6: starting prices by visitor market (docs/04 §8, docs/06 §2).
export function Pricing({
  lang,
  pricing,
  cta,
}: {
  lang: Locale
  pricing: SiteContent['pricing']
  cta: string
}) {
  return (
    <Section id="precios">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionHeading id="precios">{pricing.title}</SectionHeading>
          <p className="mt-3 text-muted">{pricing.note}</p>
        </div>
        <MarketToggle {...pricing.currencyToggle} />
      </div>
      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricing.plans.map((plan, i) => (
          <li
            key={plan.name}
            className={`flex flex-col rounded-2xl p-6 ${i === 1 ? 'border-2 border-accent' : 'border border-border'}`}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 leading-relaxed text-muted">{plan.description}</p>
            <p className="mt-5 text-2xl font-bold">
              <Price price={plan.price} lang={lang} labels={pricing.priceLabels} />
            </p>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 leading-snug">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <BookCallLink lang={lang} location="pricing">
          {cta}
        </BookCallLink>
      </div>
    </Section>
  )
}
