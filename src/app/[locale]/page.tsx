import type { Metadata } from 'next'
import { featuredCases } from '@/content/cases'
import { site } from '@/content/site'
import { AboutTeaser } from '@/components/sections/AboutTeaser'
import { Closing } from '@/components/sections/Closing'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Work } from '@/components/sections/Work'
import { PageShell } from '@/components/layout/PageShell'
import { getContent } from '@/lib/i18n'
import { homeJsonLd, jsonLdString } from '@/lib/jsonld'
import { publicFileExists } from '@/lib/links'
import { casePath, homeAlternates } from '@/lib/routes'

// The home: composes the sections in the order of docs/06 §1 (docs/14 ADR-020, ADR-024,
// ADR-025): hero with the figures strip and the showcase, then 01 work (the summary of the work
// page), 02 services (the summary of the services page), 03 about (the summary of the About
// page, with the steps, and the prices or LinkedIn), 04 FAQ and 05 contact. Internal links are
// plain <a>, not next/link (docs/03 §7).

const ogImage = (lang: string) => {
  const src = `/og/og-${lang}.png` // R-09; skipped until the file exists
  return publicFileExists(src) ? src : undefined
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang, content } = await getContent()
  const image = ogImage(lang)
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `/${lang}`, languages: { ...homeAlternates, 'x-default': '/' } },
    openGraph: {
      type: 'website',
      url: `/${lang}`,
      siteName: site.name,
      locale: lang === 'en' ? 'en_US' : 'es_CO',
      alternateLocale: lang === 'en' ? ['es_CO'] : ['en_US'],
      title: content.meta.title,
      description: content.meta.description,
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: content.meta.ogImageAlt }],
      }),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}

export default async function Home() {
  const { lang, content } = await getContent()
  const jsonLd = homeJsonLd(lang, `${site.name} · ${content.nav.tagline}`, ogImage(lang))
  const study = featuredCases[0] // the hero showcase, figures and service proofs come from it
  const caseCopy = content.cases[study.id]

  return (
    <PageShell lang={lang} alternates={homeAlternates}>
      <Hero
        lang={lang}
        hero={content.hero}
        study={study}
        caseCopy={caseCopy}
        pricing={content.pricing}
      />
      <Work lang={lang} work={content.work} studies={featuredCases} cases={content.cases} />
      <Services
        lang={lang}
        services={content.services}
        study={study}
        caseCopy={caseCopy}
        carePrice={content.pricing.plans[2].price}
        priceLabels={content.pricing.priceLabels}
        stageHref={site.features.demoStore ? site.demoUrl : casePath(lang, study.id)}
        stageEvent={site.features.demoStore ? 'demo_open' : 'case_open'}
      />
      <AboutTeaser
        lang={lang}
        about={content.about}
        teaser={content.aboutTeaser}
        steps={content.process.steps}
        pricing={content.pricing}
        linkedin={content.linkedin}
      />
      <Faq faq={content.faq} />
      <Closing lang={lang} closing={content.closing} index={5} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </PageShell>
  )
}
