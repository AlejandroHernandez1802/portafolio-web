import { hasMedia } from '@/media'
import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { pad2 } from '@/lib/format'
import { ABOUT_SECTION, anchorHref, pagePath, SECTION } from '@/lib/routes'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PORTRAIT } from './About'
import { LinkedInCard } from './LinkedIn'

// Section 03 of the home (docs/14 ADR-024): the summary of the About page, where process and
// pricing now live. The prices stay one scroll away from the hero, as in the portfolios that
// convert (ADR-020): the first-person lead, the 4 steps on one line (mono numbers, arrows
// between them), the 3 plans with their price per market, and two links into the About page.
// The portrait, once it exists, sits beside it on a sun block like on the page. While
// site.features.pricing is off, the LinkedIn card takes the place of the plans and their link
// (ADR-025).

export function AboutTeaser({
  lang,
  about,
  teaser,
  steps,
  pricing,
  linkedin,
}: {
  lang: Locale
  about: SiteContent['about'] // the title and the portrait alt
  teaser: SiteContent['aboutTeaser']
  steps: SiteContent['process']['steps']
  pricing: SiteContent['pricing']
  linkedin: SiteContent['linkedin']
}) {
  const portrait = hasMedia(PORTRAIT)
  const aboutPath = pagePath(lang, 'about')
  return (
    <Section id={SECTION.about}>
      <SectionHeading id={SECTION.about} index={3}>
        {about.title}
      </SectionHeading>
      <div
        className={`mt-10 lg:mt-12 ${portrait ? 'grid gap-10 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-start lg:gap-16' : ''}`}
      >
        {portrait && (
          <div className="relative isolate mr-3 mb-3 max-w-xs before:absolute before:inset-0 before:-z-10 before:translate-3 before:bg-sun-400">
            <ResponsiveImage
              image={PORTRAIT}
              alt={about.photo.alt}
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 30vw, 320px"
              className="block border border-ink-1 bg-paper-0"
              imgClassName="block aspect-4/5 w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="max-w-[42ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.3] font-medium tracking-[-0.005em] stretch-title">
            {teaser.lead}
          </p>

          <h3 className="mt-10 label-mono text-ink-2">{teaser.stepsLabel}</h3>
          <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-center gap-2">
                <span className="inline-flex min-h-10 items-center gap-2.5 border border-ink-1 bg-paper-0 px-3 py-1.5 font-semibold">
                  <span aria-hidden="true" className="label-mono text-accent-700">
                    {pad2(i + 1)}
                  </span>
                  {step.title}
                </span>
                {i < steps.length - 1 && (
                  <Icon name="arrow" className="size-4 shrink-0 text-ink-3" />
                )}
              </li>
            ))}
          </ol>

          {site.features.pricing ? (
            <>
              <h3 className="mt-10 label-mono text-ink-2">{teaser.pricesLabel}</h3>
              <ul className="mt-3 grid border-t border-ink-1 sm:grid-cols-3">
                {pricing.plans.map((plan) => (
                  <li
                    key={plan.name}
                    className="flex flex-col gap-3 border-b border-paper-3 py-5 sm:border-b-0 sm:not-first:border-l sm:not-first:pl-6 sm:not-last:pr-6"
                  >
                    <span className="leading-[1.3] font-semibold">{plan.name}</span>
                    <Price
                      price={plan.price}
                      lang={lang}
                      labels={pricing.priceLabels}
                      reserveLabel
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3 className="mt-10 label-mono text-ink-2">{linkedin.title}</h3>
              <LinkedInCard linkedin={linkedin} location="about" className="mt-3 max-w-xl" />
            </>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={aboutPath} iconEnd="arrow">
              {teaser.cta}
            </ButtonLink>
            {site.features.pricing && (
              <ButtonLink variant="secondary" href={anchorHref(aboutPath, ABOUT_SECTION.pricing)}>
                {teaser.pricingLink}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
