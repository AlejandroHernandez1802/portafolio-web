import type { Graph } from 'schema-dts'
import { site } from '@/content/site'
import type { Locale } from '@/content/types'

// One @graph per language on the home page (docs/08 §4). No worksFor: the current employer is
// never named. The address is added only once site.legal.postalAddress is real (F0-07).

const JOB_TITLE: Record<Locale, string> = {
  en: 'Software engineer · Online stores and quote systems',
  es: 'Ingeniero de software · Tiendas y catálogos con cotizador',
}

export function homeJsonLd(lang: Locale, serviceName: string, ogImage?: string): Graph {
  const base = site.url
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: site.name,
        inLanguage: ['en', 'es'],
        publisher: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: site.name,
        jobTitle: JOB_TITLE[lang],
        url: `${base}/`,
        knowsLanguage: ['en', 'es'],
        knowsAbout: ['E-commerce', 'B2B quote systems', 'Product catalogs', 'Next.js'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${base}/#service`,
        name: serviceName,
        url: `${base}/${lang}`,
        ...(ogImage ? { image: `${base}${ogImage}` } : {}),
        email: site.contact.email,
        founder: { '@id': `${base}/#person` },
        areaServed: [
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Colombia' },
        ],
        priceRange: 'US$150–US$3,000+',
      },
    ],
  }
}

/** Serializes JSON-LD for a native <script>, escaping "<" (Next.js JSON-LD guide). */
export function jsonLdString(data: Graph): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
