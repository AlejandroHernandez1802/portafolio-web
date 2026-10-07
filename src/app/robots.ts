import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export const dynamic = 'force-static' // required with output: 'export' (docs/08 §5)

// AI crawlers are not blocked, and /p/ is not disallowed so crawlers can see its noindex (docs/08 §5).
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${site.url}/sitemap.xml` }
}
