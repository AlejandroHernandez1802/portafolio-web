import type { Metadata } from 'next'
import { site } from '@/content/site'
import { inter } from '@/lib/fonts'
import { currentLocale, getContent, locales } from '@/lib/i18n'
import { MARKET_SCRIPT } from '@/lib/market'
import '../globals.css'

export const dynamicParams = false // any locale other than en/es → 404

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent()
  return {
    metadataBase: new URL(site.url),
    title: content.meta.title,
    description: content.meta.description,
    // Pre-launch: noindex on every page until F1-10 sets site.indexable = true
    robots: site.indexable ? undefined : { index: false, follow: false },
  }
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const lang = await currentLocale()
  return (
    // suppressHydrationWarning: the market script sets data-market before hydration
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARKET_SCRIPT }} />
      </head>
      <body className="bg-bg font-sans text-fg antialiased">{children}</body>
    </html>
  )
}
