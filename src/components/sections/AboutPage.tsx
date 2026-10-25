import type { Metadata } from 'next'
import { site } from '@/content/site'
import type { Locale } from '@/content/types'
import { dictionary } from '@/lib/i18n'
import { publicFileExists } from '@/lib/links'
import { pageAlternates, pagePath } from '@/lib/routes'
import { PageShell } from '@/components/layout/PageShell'
import { About } from './About'
import { Closing } from './Closing'
import { LinkedIn } from './LinkedIn'
import { Pricing } from './Pricing'
import { Process } from './Process'

// The About page, shared by /en/about and /es/sobre-mi (docs/14 ADR-024): who I am as the hero,
// then 01 how I work (#proceso), 02 pricing (#precios) and 03 the closing band. The home keeps
// a summary of it (AboutTeaser) and the FAQ, which the pricing table links to. While
// site.features.pricing is off, 02 is my LinkedIn profile (#linkedin) instead (ADR-025).

/** Same OG image as the home, until the page has its own. */
function ogImage(lang: Locale): string | undefined {
  const src = `/og/og-${lang}.png`
  return publicFileExists(src) ? src : undefined
}

export function aboutMetadata(lang: Locale): Metadata {
  const { meta } = dictionary(lang).aboutPage
  const url = pagePath(lang, 'about')
  const alternates = pageAlternates('about')
  const image = ogImage(lang)
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: { ...alternates, 'x-default': alternates.en } },
    openGraph: {
      type: 'profile',
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

export function AboutPage({ lang }: { lang: Locale }) {
  const content = dictionary(lang)
  return (
    <PageShell lang={lang} alternates={pageAlternates('about')} current="about">
      <About
        lang={lang}
        about={content.about}
        breadcrumb={content.aboutPage.breadcrumb}
        crumb={content.nav.links.about}
      />
      <Process process={content.process} index={1} />
      {site.features.pricing ? (
        <Pricing lang={lang} pricing={content.pricing} index={2} />
      ) : (
        <LinkedIn linkedin={content.linkedin} index={2} />
      )}
      <Closing lang={lang} closing={content.closing} index={3} />
    </PageShell>
  )
}
