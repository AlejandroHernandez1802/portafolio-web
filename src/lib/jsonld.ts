import type { Graph } from 'schema-dts'
import { site } from '@/content/site'
import type { CaseContent, CaseStudy, Locale } from '@/content/types'
import { casePath, homePath, pagePath } from '@/lib/routes'

// One @graph per language on the home page (docs/08 §4). No worksFor: the current employer is
// never named. The address is added only once site.legal.postalAddress is real (F0-07).
// Case pages get an Article about the client plus a BreadcrumbList. Each page carries its own
// #person node, since a parser reads one page at a time; the shared @id lets search engines
// join them.

const JOB_TITLE: Record<Locale, string> = {
  en: 'Software engineer · Online stores and quote systems',
  es: 'Ingeniero de software · Tiendas y catálogos con cotizador',
}

/** The site owner, the author and publisher of every page */
function person(lang: Locale) {
  const base = site.url
  return {
    '@type': 'Person',
    '@id': `${base}/#person`,
    name: site.name,
    jobTitle: JOB_TITLE[lang],
    url: `${base}/`,
    sameAs: [site.contact.linkedin], // linked from the site since ADR-025 (docs/08 §4)
  } as const
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
        ...person(lang),
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
        // Only while the prices are on the site (ADR-025)
        ...(site.features.pricing ? { priceRange: 'US$150–US$3,000+' } : {}),
      },
    ],
  }
}

export function caseJsonLd(
  lang: Locale,
  study: CaseStudy,
  copy: CaseContent,
  image?: string,
): Graph {
  const base = site.url
  const url = `${base}${casePath(lang, study.id)}`
  const { page } = copy
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: page.hero.title,
        description: page.meta.description,
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
        datePublished: study.published,
        dateModified: study.updated,
        author: { '@id': `${base}/#person` },
        publisher: { '@id': `${base}/#person` },
        // A client is an organization; a demo is my own website with a fictional brand (ADR-026)
        about:
          study.kind === 'demo'
            ? { '@type': 'WebSite', name: study.client.name, url: study.client.url }
            : { '@type': 'Organization', name: study.client.name, url: study.client.url },
        ...(image ? { image: `${base}${image}` } : {}),
      },
      person(lang),
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: page.breadcrumb.home,
            item: `${base}${homePath(lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.breadcrumb.work,
            item: `${base}${pagePath(lang, 'work')}`,
          },
          { '@type': 'ListItem', position: 3, name: study.client.name, item: url },
        ],
      },
    ],
  }
}

/** Serializes JSON-LD for a native <script>, escaping "<" (Next.js JSON-LD guide). */
export function jsonLdString(data: Graph): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
