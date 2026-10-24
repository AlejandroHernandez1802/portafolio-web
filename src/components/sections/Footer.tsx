import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { Container } from '@/components/ui/Container'

// Section 10: postal address (same as the outreach emails, CAN-SPAM), privacy link,
// language and © (docs/06 §2). A deep-navy band: on-ink gives it the sun-yellow focus ring.
// The underline keeps the text color at rest (7.5:1), so the links don't read like the © line.
const LINK =
  'underline decoration-current hover:text-on-ink-1 hover:decoration-sun-400 motion-safe:transition-colors motion-safe:duration-120'

export function Footer({
  lang,
  footer,
  switchLanguage,
  path = '',
}: {
  lang: Locale
  footer: SiteContent['footer']
  switchLanguage: string
  path?: string
}) {
  const other: Locale = lang === 'en' ? 'es' : 'en'
  return (
    <footer className="on-ink bg-deep pt-10 pb-8 text-sm leading-body text-on-ink-2">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p>
          <span className="font-semibold text-on-ink-1">{footer.addressLabel}:</span>{' '}
          {site.legal.postalAddress}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`/${lang}/privacy`} className={LINK}>
              {footer.privacy}
            </a>
          </li>
          <li>
            <a href={`/${other}${path}`} lang={other} hrefLang={other} className={LINK}>
              {switchLanguage}
            </a>
          </li>
          <li>
            © {new Date().getFullYear()} {site.name}. {footer.rights}
          </li>
        </ul>
      </Container>
    </footer>
  )
}
