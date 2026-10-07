import { locale } from 'next/root-params'
import { en } from '@/content/en'
import { es } from '@/content/es'
import type { Locale, SiteContent } from '@/content/types'

// Server-only helpers: next/root-params works in Server Components, not in Client Components.
// Client islands receive their texts as props (docs/04 §3).

export const locales = ['en', 'es'] as const satisfies readonly Locale[]

const dictionaries: Record<Locale, SiteContent> = { en, es }

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Locale of the current route, read from the root `[locale]` segment. */
export async function currentLocale(): Promise<Locale> {
  const value = await locale()
  // dynamicParams = false in the root layout makes any other value a 404 before reaching this
  if (!hasLocale(value)) throw new Error(`Unsupported locale: ${value}`)
  return value
}

/** Texts for the current route's locale. */
export async function getContent(): Promise<{ lang: Locale; content: SiteContent }> {
  const lang = await currentLocale()
  return { lang, content: dictionaries[lang] }
}
