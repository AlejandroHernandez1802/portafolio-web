import type { Metadata } from 'next'
import { featuredCases } from '@/content/cases'
import { site } from '@/content/site'
import type { CaseStudy, Locale, ServiceTileId, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { fillCase } from '@/lib/cases'
import { pad2 } from '@/lib/format'
import { dictionary } from '@/lib/i18n'
import { publicFileExists } from '@/lib/links'
import {
  ABOUT_SECTION,
  anchorHref,
  casePath,
  homePath,
  pageAlternates,
  pagePath,
  SECTION,
  SERVICE_ANCHOR,
  SERVICE_ORDER,
} from '@/lib/routes'
import { Capture } from '@/components/case/CaseFeatures'
import { altFor } from '@/components/case/case-media'
import { PageShell } from '@/components/layout/PageShell'
import { DeviceFrame } from '@/components/media/DeviceFrame'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { Closing } from '@/components/sections/Closing'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Container'
import { SectionIndex } from '@/components/ui/SectionHeading'
import '@/components/case/case.css'

// The services page, shared by /en/services and /es/servicios (docs/14 ADR-024). The home bento
// is its summary; here each service gets a block, in the bento's order and under the anchor the
// "Services" dropdown links to (SERVICE_ANCHOR):
// - hero: breadcrumb, H1, lead and the 7 blocks as a numbered index;
// - one block per service: number, outcome, title (H2), the bento body plus a longer intro, and
//   what it includes; beside it, the example of every featured case that has one (cases.ts →
//   examples), the capture on a blueprint plate with its caption and a link to the case. A demo
//   store's example is labelled as a demo; a print piece (design, ADR-025) sits under the case's
//   logo as on the case page. From 1024 px a 5/7 split that switches sides block by block; the
//   care plan has no capture, so its plan takes that column, with its price only while
//   site.features.pricing is on;
// - the closing band with the booking CTA.

const SIZES = {
  browser: '(min-width: 1024px) 600px, calc(100vw - 72px)',
  phone: '(min-width: 1024px) 240px, 62vw',
}

/** Same OG image as the home, until the page has its own. */
function ogImage(lang: Locale): string | undefined {
  const src = `/og/og-${lang}.png`
  return publicFileExists(src) ? src : undefined
}

export function servicesMetadata(lang: Locale): Metadata {
  const { meta } = dictionary(lang).servicesPage
  const url = pagePath(lang, 'services')
  const alternates = pageAlternates('services')
  const image = ogImage(lang)
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: { ...alternates, 'x-default': alternates.en } },
    openGraph: {
      type: 'website',
      url,
      siteName: site.name,
      locale: lang === 'en' ? 'en_US' : 'es_CO',
      alternateLocale: lang === 'en' ? ['es_CO'] : ['en_US'],
      title: meta.title,
      description: meta.description,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}

function Example({
  lang,
  study,
  id,
  content,
}: {
  lang: Locale
  study: CaseStudy
  id: ServiceTileId
  content: SiteContent
}) {
  const example = study.examples[id]
  const copy = content.cases[study.id]
  const caption = copy.examples[id]
  if (!example || !caption) return null
  const page = content.servicesPage
  const label = page.exampleLabel[study.kind].replace('{name}', study.client.name)
  const image = (
    <ResponsiveImage
      image={example.media}
      alt={altFor(copy.alts, example.media)}
      sizes={SIZES[example.frame === 'phone' ? 'phone' : 'browser']}
    />
  )
  return (
    <figure className="min-w-0">
      {example.frame === 'plain' ? (
        <Capture media={example.media} frame="plain" url={study.client.domain} alts={copy.alts} />
      ) : example.frame === 'phone' ? (
        // The phone rises from the plate's bottom edge, as in the case page (CaseFeatures)
        <div className="case-plate overflow-hidden px-6 pt-8 sm:pt-10">
          <DeviceFrame variant="phone" className="mx-auto -mb-36 w-[min(62%,15rem)] lg:-mb-40">
            {image}
          </DeviceFrame>
        </div>
      ) : (
        <div className="case-plate p-5 sm:p-8">
          <DeviceFrame variant="browser" url={study.client.domain}>
            {image}
          </DeviceFrame>
        </div>
      )}
      <figcaption className="mt-4 grid gap-2">
        <span className="flex items-start gap-2.5 label-mono leading-[1.5] text-ink-1">
          <span aria-hidden="true" className="mt-[5px] size-2 shrink-0 bg-sun-400" />
          {label}
        </span>
        <span className="max-w-[60ch] text-ink-2">{fillCase(caption, study, lang) ?? caption}</span>
        <a
          href={casePath(lang, study.id)}
          className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-accent-700 underline decoration-2 underline-offset-4"
          {...trackAttrs('case_open', 'services')}
        >
          {page.viewCase}
          <Icon name="arrow" className="size-4" />
        </a>
      </figcaption>
    </figure>
  )
}

function ServiceBlock({
  lang,
  id,
  index,
  content,
}: {
  lang: Locale
  id: ServiceTileId
  index: number
  content: SiteContent
}) {
  const anchor = SERVICE_ANCHOR[id]
  const tile = content.services.tiles[id]
  const item = content.servicesPage.items[id]
  const examples = featuredCases.filter((study) => study.examples[id])
  const care = id === 'care'
  const plan = content.pricing.plans[2] // the monthly care plan
  const { pricing } = site.features
  const examplesLeft = index % 2 === 1
  return (
    <Section
      id={anchor}
      tone={index % 2 === 1 ? 'raised' : 'paper'}
      containerClassName="grid gap-10 lg:grid-cols-12 lg:gap-x-12"
    >
      <div className={`min-w-0 lg:col-span-5 ${examplesLeft ? 'lg:order-last' : ''}`}>
        <SectionIndex index={index + 1} className="mb-5" />
        <p className="label-mono leading-[1.5] text-accent-700">{tile.outcome}</p>
        <h2
          id={`${anchor}-title`}
          className="mt-3 stretch-heading text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.02] font-extrabold tracking-[-0.01em]"
        >
          {tile.title}
        </h2>
        <p className="mt-5 text-lead text-ink-1">{tile.body}</p>
        <p className="mt-4 text-ink-2">{item.intro}</p>
        <h3 className="mt-8 label-mono text-ink-2">{content.servicesPage.includedLabel}</h3>
        <ul className="mt-3 grid gap-3 border-t border-ink-1 pt-4">
          {item.included.map((line) => (
            <li key={line} className="flex gap-2.5 leading-[1.45]">
              <Icon name="check" className="mt-px size-5 shrink-0 text-ok-600" />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid min-w-0 content-start gap-10 lg:col-span-7">
        {examples.map((study) => (
          <Example key={study.id} lang={lang} study={study} id={id} content={content} />
        ))}
        {care && (
          // No capture for the care plan: the plan itself, as a sheet of the pricing table
          <div className="border border-ink-1 bg-paper-0 px-6 pt-8 pb-7 sm:px-8">
            <p className="label-mono text-ink-3">{content.servicesPage.care.planLabel}</p>
            <h3 className="mt-3.5 text-[1.375rem] leading-[1.15] font-bold tracking-[-0.01em] stretch-title">
              {plan.name}
            </h3>
            <p className="mt-2.5 text-ink-2">{plan.description}</p>
            {pricing && (
              <div className="mt-6 border-t border-ink-1 pt-5">
                <Price price={plan.price} lang={lang} labels={content.pricing.priceLabels} />
              </div>
            )}
            <ButtonLink
              variant="secondary"
              href={anchorHref(
                pagePath(lang, 'about'),
                pricing ? ABOUT_SECTION.pricing : ABOUT_SECTION.process,
              )}
              className="mt-6"
            >
              {pricing ? content.services.pricingLink : content.services.processLink}
            </ButtonLink>
          </div>
        )}
      </div>
    </Section>
  )
}

export function ServicesPage({ lang }: { lang: Locale }) {
  const content = dictionary(lang)
  const page = content.servicesPage
  const here = pagePath(lang, 'services')
  return (
    <PageShell lang={lang} alternates={pageAlternates('services')} current="services">
      <Section
        id={SECTION.hero}
        backdrop="grid"
        className="pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]"
      >
        <Breadcrumb
          label={page.breadcrumb.label}
          trail={[{ href: homePath(lang), label: page.breadcrumb.home }]}
          current={content.nav.links.services}
        />
        <h1
          id={`${SECTION.hero}-title`}
          className="mt-3 max-w-[16ch] stretch-display text-[length:clamp(2.5rem,6.4vw,6rem)] leading-display font-extrabold tracking-display"
        >
          {page.title}
        </h1>
        <p className="mt-6 max-w-[60ch] text-lead text-ink-2">{page.lead}</p>
        <nav aria-label={page.indexLabel} className="mt-10">
          <ol className="grid border-t border-ink-1 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_ORDER.map((id, i) => (
              <li key={id} className="border-b border-paper-3">
                <a
                  href={anchorHref(here, SERVICE_ANCHOR[id], here)}
                  className="group flex min-h-16 items-center gap-4 py-3 pr-4 text-ink-1 no-underline"
                >
                  <span aria-hidden="true" className="label-mono text-ink-3">
                    {pad2(i + 1)}
                  </span>
                  <span className="font-semibold underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-accent-500">
                    {content.services.tiles[id].title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Section>
      {SERVICE_ORDER.map((id, i) => (
        <ServiceBlock key={id} lang={lang} id={id} index={i} content={content} />
      ))}
      <Closing lang={lang} closing={content.closing} index={SERVICE_ORDER.length + 1} />
    </PageShell>
  )
}
