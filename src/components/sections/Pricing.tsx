import type { Locale, SiteContent } from '@/content/types'
import { pad2 } from '@/lib/format'
import { ABOUT_SECTION, SECTION, sectionHref } from '@/lib/routes'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { MarketToggle } from '@/components/market/MarketToggle'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

// The About page's section 02 (ADR-024): starting prices by visitor market (docs/04 §8, docs/06 §2). The plans form one
// ruled table (design system PlanCard): shared 1 px ink borders, and from 1024 px each column
// is a 5-row subgrid so names, prices and lists line up. The recommended plan is raised paper
// with a 6 px cobalt band on top. The table closes with an action row that shares its ink
// border: the prototype is requested on the booking call, and the link answers payments and
// timing in the FAQ, which stays on the home.

// Mobile stacks the columns (no top border after the first); desktop sets them side by side
const PLAN =
  'relative flex min-w-0 flex-col border border-ink-1 px-6 pt-8 pb-7 not-first:border-t-0 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:content-start lg:not-first:border-t lg:not-first:border-l-0'
const FEATURED =
  'bg-paper-0 before:absolute before:-inset-x-px before:-top-px before:h-1.5 before:bg-accent-500'

export function Pricing({
  lang,
  pricing,
  index,
}: {
  lang: Locale
  pricing: SiteContent['pricing']
  index: number
}) {
  return (
    <Section id={ABOUT_SECTION.pricing}>
      <SectionHeading id={ABOUT_SECTION.pricing} index={index}>
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
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border border-t-0 border-ink-1 bg-accent-50 px-6 py-5 lg:px-8">
        <BookCallLink lang={lang} location="pricing" iconEnd="arrow">
          {pricing.cta}
        </BookCallLink>
        <ButtonLink variant="secondary" href={sectionHref(lang, SECTION.faq)}>
          {pricing.faqLink}
        </ButtonLink>
      </div>
    </Section>
  )
}
