import type { Locale, SiteContent } from '@/content/types'
import { pad2 } from '@/lib/format'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { MarketToggle } from '@/components/market/MarketToggle'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Section 6: starting prices by visitor market (docs/04 §8, docs/06 §2). The plans form one
// ruled table (design system PlanCard): shared 1 px ink borders, and from 1024 px each column
// is a 5-row subgrid so names, prices and lists line up. The recommended plan is raised paper
// with a 6 px cobalt band on top.

// Mobile stacks the columns (no top border after the first); desktop sets them side by side
const PLAN =
  'relative flex min-w-0 flex-col border border-ink-1 px-6 pt-8 pb-7 not-first:border-t-0 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:content-start lg:not-first:border-t lg:not-first:border-l-0'
const FEATURED =
  "bg-paper-0 before:absolute before:-inset-x-px before:-top-px before:h-1.5 before:bg-accent-500"

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
      <SectionHeading id="precios" index={4}>
        {pricing.title}
      </SectionHeading>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <p className="text-ink-2">{pricing.note}</p>
        <MarketToggle {...pricing.currencyToggle} />
      </div>
      <ul className="mt-10 grid lg:grid-cols-3 lg:grid-rows-[repeat(5,auto)]">
        {pricing.plans.map((plan, i) => (
          <li key={plan.name} className={`${PLAN} ${i === 1 ? FEATURED : 'bg-paper-1'}`}>
            <span aria-hidden="true" className="label-mono text-ink-3">
              {pad2(i + 1)}
            </span>
            <h3 className="mt-3.5 text-[1.375rem] leading-[1.15] font-bold tracking-[-0.01em] stretch-title">
              {plan.name}
            </h3>
            <p className="mt-2.5 text-ink-2">{plan.description}</p>
            <div className="mt-6 border-y border-ink-1 py-5">
              <Price price={plan.price} lang={lang} labels={pricing.priceLabels} reserveLabel />
            </div>
            {/* content-start: in the shared subgrid row a shorter list keeps its 12 px rhythm
                instead of stretching its rows to the tallest column */}
            <ul className="mt-5 grid content-start gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 leading-[1.45]">
                  <Icon name="check" className="mt-px size-5 shrink-0 text-ok-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <BookCallLink lang={lang} location="pricing" iconEnd="arrow">
          {cta}
        </BookCallLink>
      </div>
    </Section>
  )
}
