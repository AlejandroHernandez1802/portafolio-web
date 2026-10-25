import type { MetadataRoute } from 'next'
import { cases } from '@/content/cases'
import { site } from '@/content/site'
import {
  caseAlternates,
  homeAlternates,
  pageAlternates,
  privacyAlternates,
  type Alternates,
} from '@/lib/routes'

export const dynamic = 'force-static' // required with output: 'export' (docs/08 §5)

// One entry per page and language, each listing both versions as hreflang alternates: home,
// work, services, about, privacy and every case = 12 URLs with MRB alone (docs/08 §5). Never /p/*.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ paths: Alternates; lastModified: Date }> = [
    { paths: homeAlternates, lastModified: new Date() },
    { paths: pageAlternates('work'), lastModified: new Date() },
    { paths: pageAlternates('services'), lastModified: new Date() },
    { paths: pageAlternates('about'), lastModified: new Date() },
    { paths: privacyAlternates, lastModified: new Date(site.legal.privacyVersion) },
    ...cases.map((c) => ({ paths: caseAlternates(c.id), lastModified: new Date(c.updated) })),
  ]
  const absolute = (paths: Alternates) => ({
    en: `${site.url}${paths.en}`,
    es: `${site.url}${paths.es}`,
  })
  return pages.flatMap(({ paths, lastModified }) =>
    (['en', 'es'] as const).map((l) => ({
      url: `${site.url}${paths[l]}`,
      lastModified,
      alternates: { languages: absolute(paths) },
    })),
  )
}
