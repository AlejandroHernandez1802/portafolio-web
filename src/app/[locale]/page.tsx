import { site } from '@/content/site'
import { getContent } from '@/lib/i18n'

// Scaffold page (F0-08): proves the i18n pipeline and the export. The real sections arrive in
// phase 1 (docs/13 §5). Internal links are plain <a>, not next/link (docs/03 §7).
export default async function Home() {
  const { lang, content } = await getContent()
  const { nav, hero } = content
  const other = lang === 'en' ? 'es' : 'en'

  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-bg focus:p-2"
      >
        {nav.skipToContent}
      </a>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="font-semibold">{site.name}</span>
        <a href={`/${other}`} lang={other} hrefLang={other} className="text-accent underline">
          {nav.switchLanguage}
        </a>
      </header>
      <main id="inicio" className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="max-w-3xl text-[clamp(2rem,6vw,3.5rem)] leading-tight font-bold text-balance">
          {hero.headlines[site.hero.activeHeadline]}
        </h1>
        <p className="mt-6 max-w-prose text-lg text-muted">{hero.subtitle}</p>
        <a
          href={`https://cal.com/${site.contact.calLink[lang]}`}
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-accent px-6 font-semibold text-white"
        >
          {hero.primaryCta}
        </a>
        <p className="mt-6 text-sm text-muted">{hero.trustLine[site.caseMrb.disclosure]}</p>
      </main>
    </>
  )
}
