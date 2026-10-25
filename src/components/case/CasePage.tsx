import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { caseBySlug, cases, featuredCases } from '@/content/cases'
import { site } from '@/content/site'
import type { CaseId, CaseStudy, Locale } from '@/content/types'
import { dictionary } from '@/lib/i18n'
import { caseJsonLd, jsonLdString } from '@/lib/jsonld'
import { publicFileExists } from '@/lib/links'
import { caseAlternates, casePath, pagePath } from '@/lib/routes'
import { PageShell } from '@/components/layout/PageShell'
import { CaseBeforeAfter } from './CaseBeforeAfter'
import { CaseClosing, type NextLink } from './CaseClosing'
import { CaseFeatures } from './CaseFeatures'
import { CaseHero } from './CaseHero'
import { CaseOverview } from './CaseOverview'
import { CaseResults } from './CaseResults'

// A case page, shared by the two thin routes /en/work/[slug] and /es/trabajos/[slug]
// (docs/14 ADR-020). Each route passes its own language, so a slug under the other language's
// segment is never generated and Cloudflare answers 404 (dynamicParams = false).

/**
 * generateStaticParams of a case route. Next calls it once per parent locale and merges the
 * result over the parent's params, so returning `locale` too pins every page to the route's own
 * language: /es/work/* and /en/trabajos/* are never generated (the duplicates are dropped). An
 * empty array for the other locale would fail the static export instead (Next error E1454).
 */
export function caseStaticParams(lang: Locale): Array<{ locale: Locale; slug: string }> {
  return cases.map((c) => ({ locale: lang, slug: c.slug[lang] }))
}

function findCase(lang: Locale, slug: string): CaseStudy {
  const study = caseBySlug(lang, slug)
  if (!study) notFound()
  return study
}

/** OG image per case and language (R-09); skipped until the file exists. */
function ogImage(lang: Locale, id: CaseId): string | undefined {
  const src = `/og/case-${id}-${lang}.png`
  return publicFileExists(src) ? src : undefined
}

export function caseMetadata(lang: Locale, slug: string): Metadata {
  const study = findCase(lang, slug)
  const { meta } = dictionary(lang).cases[study.id].page
  const image = ogImage(lang, study.id)
  const url = casePath(lang, study.id)
  const alternates = caseAlternates(study.id)
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { ...alternates, 'x-default': alternates.en },
    },
    openGraph: {
      type: 'article',
      url,
      siteName: site.name,
      locale: lang === 'en' ? 'en_US' : 'es_CO',
      alternateLocale: lang === 'en' ? ['es_CO'] : ['en_US'],
      title: meta.title,
      description: meta.description,
      publishedTime: study.published,
      modifiedTime: study.updated,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: meta.ogImageAlt }] }),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}

/** The next featured case, or the services page after the last one (ADR-024). */
function nextLink(lang: Locale, study: CaseStudy): NextLink {
  const content = dictionary(lang)
  const following = featuredCases[featuredCases.findIndex((c) => c.id === study.id) + 1]
  if (following) {
    return {
      href: casePath(lang, following.id),
      label: content.work.card.nextCase,
      title: following.client.name,
      body: content.cases[following.id].card.outcome,
    }
  }
  return { href: pagePath(lang, 'services'), ...content.cases[study.id].page.next }
}

export function CasePage({ lang, slug }: { lang: Locale; slug: string }) {
  const study = findCase(lang, slug)
  const copy = dictionary(lang).cases[study.id]
  const { page } = copy
  const jsonLd = caseJsonLd(lang, study, copy, ogImage(lang, study.id))

  // Order of the plan (§1): hero → results → overview → before/after → what I built →
  // closing. The 49 s teaser goes between "what I built" and the closing in phase B (R-18).
  // Bands: paper (grid) → ink → paper → tint → paper → accent. The hero and the results stay
  // adjacent: the hero capture straddles the results' navy band (CaseHero .case-bridge).
  return (
    <PageShell lang={lang} alternates={caseAlternates(study.id)} current="work">
      <CaseHero
        lang={lang}
        study={study}
        hero={page.hero}
        breadcrumb={page.breadcrumb}
        alts={copy.alts}
        visitSite={copy.visitSite}
      />
      <CaseResults lang={lang} study={study} results={page.results} />
      <CaseOverview study={study} overview={page.overview} />
      <CaseBeforeAfter study={study} beforeAfter={page.beforeAfter} alts={copy.alts} />
      <CaseFeatures lang={lang} study={study} features={page.features} alts={copy.alts} />
      <CaseClosing lang={lang} closing={page.closing} next={nextLink(lang, study)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </PageShell>
  )
}
