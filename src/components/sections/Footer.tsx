import { site } from '@/content/site'
import type { Locale, SiteContent } from '@/content/types'
import { Container } from '@/components/ui/Container'

// Section 10: postal address (same as the outreach emails, CAN-SPAM), privacy link,
// language and © (docs/06 §2).
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
    <footer className="border-t border-surface py-10 text-sm text-muted">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p>
          <span className="font-semibold text-fg">{footer.addressLabel}:</span>{' '}
          {site.legal.postalAddress}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`/${lang}/privacy`} className="underline underline-offset-4 hover:text-fg">
              {footer.privacy}
            </a>
          </li>
          <li>
            <a
              href={`/${other}${path}`}
              lang={other}
              hrefLang={other}
              className="underline underline-offset-4 hover:text-fg"
            >
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
