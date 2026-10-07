import type { Metadata } from 'next'
import { site } from '@/content/site'
import { CalLoader } from '@/components/booking/CalLoader'
import { TrackingListener } from '@/components/analytics/TrackingListener'
import { inter } from '@/lib/fonts'
import { currentLocale, locales } from '@/lib/i18n'
import { MARKET_SCRIPT } from '@/lib/market'
import '../globals.css'

export const dynamicParams = false // any locale other than en/es → 404

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Title, description and alternates live in each page's generateMetadata (docs/08 §2)
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Pre-launch: noindex on every page until F1-10 sets site.indexable = true
  robots: site.indexable ? undefined : { index: false, follow: false },
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const lang = await currentLocale()
  const productionHost = new URL(site.url).hostname
  return (
    // suppressHydrationWarning: the market script sets data-market before hydration
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARKET_SCRIPT }} />
        {site.analytics.umamiWebsiteId && (
          // data-domains: only production counts, never localhost or previews (docs/12 §4)
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={site.analytics.umamiWebsiteId}
            data-domains={productionHost}
          />
        )}
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        {children}
        <TrackingListener />
        <CalLoader />
      </body>
    </html>
  )
}
