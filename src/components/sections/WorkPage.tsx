import type { Metadata } from 'next'
import { featuredCases } from '@/content/cases'
import { site } from '@/content/site'
import type { Locale } from '@/content/types'
import { dictionary } from '@/lib/i18n'
import { publicFileExists } from '@/lib/links'
import { homePath, pageAlternates, pagePath, SECTION } from '@/lib/routes'
import { CaseCard } from '@/components/case/CaseCard'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Section } from '@/components/ui/Container'
import { Closing } from './Closing'

// The work page, shared by /en/work and /es/trabajos (docs/14 ADR-025), the parent of every
// case page. The home keeps its summary (Work). Here: the breadcrumb, the H1 and the lead
// (its "many" version once a demo store joins), then one band per featured case with its card,
// numbered and alternating tone and sides, under the case's slug as anchor
// (/es/trabajos#malone-road-belt), and the closing band.

/** Same OG image as the home, until the page has its own. */
function ogImage(lang: Locale): string | undefined {
  const src = `/og/og-${lang}.png`
  return publicFileExists(src) ? src : undefined
}

export function workMetadata(lang: Locale): Metadata {
  const { meta } = dictionary(lang).workPage
  const url = pagePath(lang, 'work')
  const alternates = pageAlternates('work')
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

export function WorkPage({ lang }: { lang: Locale }) {
  const content = dictionary(lang)
  const page = content.workPage
  return (
    <PageShell lang={lang} alternates={pageAlternates('work')} current="work">
      <Section
        id={SECTION.hero}
        backdrop="grid"
        className="pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]"
      >
        <Breadcrumb
          label={page.breadcrumb.label}
          trail={[{ href: homePath(lang), label: page.breadcrumb.home }]}
          current={content.nav.links.work}
        />
        <h1
          id={`${SECTION.hero}-title`}
          className="mt-3 max-w-[16ch] stretch-display text-[length:clamp(2.5rem,6.4vw,6rem)] leading-display font-extrabold tracking-display"
        >
          {page.title}
        </h1>
        <p className="mt-6 max-w-[60ch] text-lead text-ink-2">
          {featuredCases.length > 1 ? page.lead.many : page.lead.one}
        </p>
      </Section>
      {featuredCases.map((study, i) => {
        const anchor = study.slug[lang]
        return (
          <Section key={study.id} id={anchor} tone={i % 2 === 1 ? 'raised' : 'paper'}>
            <CaseCard
              lang={lang}
              study={study}
              copy={content.cases[study.id]}
              labels={content.work.card}
              index={i + 1}
              headingId={`${anchor}-title`}
              reverse={i % 2 === 1}
            />
          </Section>
        )
      })}
      <Closing lang={lang} closing={content.closing} index={featuredCases.length + 1} />
    </PageShell>
  )
}
