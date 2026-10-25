import { getCase } from '@/content/cases'
import type { CaseId, Locale, ServiceTileId } from '@/content/types'

// Every internal URL of the site, in one place (docs/04 §1, docs/14 ADR-020, ADR-024, ADR-025). Links
// are plain <a> (docs/03 §7). Section ids are Spanish in both languages, so /en#trabajo is
// valid too.

/** The section pages, each under a translated segment (ADR-024, ADR-025). The work page lists
 * every case, and each case page hangs from it: /en/work/{slug} and /es/trabajos/{slug}. */
export const PAGE_SEGMENT = {
  work: { en: 'work', es: 'trabajos' },
  services: { en: 'services', es: 'servicios' },
  about: { en: 'about', es: 'sobre-mi' },
} as const satisfies Record<string, Record<Locale, string>>
export type SectionPage = keyof typeof PAGE_SEGMENT

/** Home section ids, in page order (docs/06 §1). */
export const SECTION = {
  hero: 'inicio',
  work: 'trabajo',
  services: 'servicios',
  about: 'sobre-mi',
  faq: 'preguntas',
  contact: 'contacto',
} as const
export type SectionId = (typeof SECTION)[keyof typeof SECTION]

/** Case page section ids (the hero is the page's H1, not a numbered section). */
export const CASE_SECTION = {
  results: 'resultados',
  overview: 'resumen',
  beforeAfter: 'antes-despues',
  features: 'que-construi',
  closing: 'cierre',
} as const

/** About page section ids; its hero (who I am) is the page itself. #precios is only rendered
 * with site.features.pricing; #linkedin takes its place while the prices are hidden (ADR-025). */
export const ABOUT_SECTION = {
  process: 'proceso',
  pricing: 'precios',
  linkedin: 'linkedin',
} as const

/** One block per service on the services page, in the bento's order. */
export const SERVICE_ANCHOR = {
  catalog: 'catalogo',
  quote: 'cotizador',
  design: 'diseno',
  languages: 'idiomas',
  seo: 'google-e-ia',
  analytics: 'analitica',
  care: 'plan-mensual',
} as const satisfies Record<ServiceTileId, string>
export const SERVICE_ORDER = Object.keys(SERVICE_ANCHOR) as ServiceTileId[]

export function homePath(lang: Locale): string {
  return `/${lang}`
}

export function privacyPath(lang: Locale): string {
  return `/${lang}/privacy`
}

/** /en/work, /es/servicios, /es/sobre-mi… */
export function pagePath(lang: Locale, page: SectionPage): string {
  return `/${lang}/${PAGE_SEGMENT[page][lang]}`
}

export function casePath(lang: Locale, id: CaseId): string {
  return `${pagePath(lang, 'work')}/${getCase(id).slug[lang]}`
}

/**
 * A section of the page at `path`. From another page: /es/sobre-mi#precios. On that page itself
 * (`here` is its path): the bare #precios, so the jump stays in the page and keeps its query
 * string; with the full path, /es?mkt=co&utm_source=… would reload without it (docs/12 §5).
 */
export function anchorHref(path: string, id: string, here?: string): string {
  return here === path ? `#${id}` : `${path}#${id}`
}

/** A home section: /es#servicios, or the bare #servicios on the home itself. */
export function sectionHref(lang: Locale, id: SectionId, here?: string): string {
  return anchorHref(homePath(lang), id, here)
}

/** The same page in each language, for the language switch and hreflang. */
export type Alternates = Record<Locale, string>

export const homeAlternates: Alternates = { en: homePath('en'), es: homePath('es') }
export const privacyAlternates: Alternates = { en: privacyPath('en'), es: privacyPath('es') }

export function caseAlternates(id: CaseId): Alternates {
  return { en: casePath('en', id), es: casePath('es', id) }
}

export function pageAlternates(page: SectionPage): Alternates {
  return { en: pagePath('en', page), es: pagePath('es', page) }
}
