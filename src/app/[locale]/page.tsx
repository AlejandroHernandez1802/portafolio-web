import type { Metadata } from 'next'
import { site } from '@/content/site'
import { About } from '@/components/sections/About'
import { CaseMrb } from '@/components/sections/CaseMrb'
import { Closing } from '@/components/sections/Closing'
import { Faq } from '@/components/sections/Faq'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Pricing } from '@/components/sections/Pricing'
import { Process } from '@/components/sections/Process'
import { Solves } from '@/components/sections/Solves'
import { getContent } from '@/lib/i18n'
import { homeJsonLd, jsonLdString } from '@/lib/jsonld'
import { publicFileExists } from '@/lib/links'

// The single page: composes the sections in the order of docs/06 §1. Internal links are plain
// <a>, not next/link (docs/03 §7). The demo teaser (section 4) arrives in v2.

const ogImage = (lang: string) => {
  const src = `/og/og-${lang}.png` // designed in F0-11; skipped until the file exists
  return publicFileExists(src) ? src : undefined
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang, content } = await getContent()
  const image = ogImage(lang)
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `/${lang}`, languages: { en: '/en', es: '/es', 'x-default': '/' } },
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

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:rounded-lg focus:bg-bg focus:p-3"
      >
        {content.nav.skipToContent}
      </a>
      <Header lang={lang} nav={content.nav} />
      <main id="main">
        <Hero lang={lang} hero={content.hero} />
        <Solves solves={content.solves} />
        <CaseMrb caseMrb={content.caseMrb} />
        <Process process={content.process} />
        <Pricing lang={lang} pricing={content.pricing} cta={content.hero.primaryCta} />
        <Faq faq={content.faq} />
        <About about={content.about} />
        <Closing lang={lang} closing={content.closing} />
      </main>
      <Footer lang={lang} footer={content.footer} switchLanguage={content.nav.switchLanguage} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </>
  )
}
