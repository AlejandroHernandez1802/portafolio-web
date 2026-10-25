import type { ReactNode } from 'react'
import type { Locale, NavGroup } from '@/content/types'
import { dictionary } from '@/lib/i18n'
import type { Alternates } from '@/lib/routes'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'

// The frame of every page (docs/14 ADR-020): skip link, fixed header with the nav, <main> and
// footer. `alternates` is the same page in each language, for the language switch; `current`
// marks the group of the bar the page belongs to (the case pages pass 'work', ADR-024).
export function PageShell({
  lang,
  alternates,
  current,
  mainClassName,
  children,
}: {
  lang: Locale
  alternates: Alternates
  current?: NavGroup
  mainClassName?: string
  children: ReactNode
}) {
  const content = dictionary(lang)
  return (
    <>
      {/* Parked above the viewport until focused; sits over the fixed header (z-50) */}
      <a
        href="#main"
        className="fixed top-2 left-2 z-60 -translate-y-[200%] border border-ink-1 bg-paper-0 px-3.5 py-3 font-semibold underline focus:translate-y-0"
      >
        {content.nav.skipToContent}
      </a>
      <Header lang={lang} content={content} alternates={alternates} current={current} />
      <main id="main" className={mainClassName}>
        {children}
      </main>
      <Footer lang={lang} content={content} alternates={alternates} />
    </>
  )
}
