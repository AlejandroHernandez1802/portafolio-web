import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export const dynamic = 'force-static' // required with output: 'export' (docs/08 §5)

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/privacy'] // never /p/*
  return paths.flatMap((p) =>
    (['en', 'es'] as const).map((l) => ({
      url: `${site.url}/${l}${p}`,
      lastModified: new Date(),
      alternates: { languages: { en: `${site.url}/en${p}`, es: `${site.url}/es${p}` } },
    })),
  )
}
