import { site } from '@/content/site'
import { featuredCases } from '@/content/cases'
import type { Locale, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { pad2 } from '@/lib/format'
import { postalAddress } from '@/lib/links'
import { casePath, homePath, privacyPath, type Alternates } from '@/lib/routes'
import { navGroups } from '@/components/layout/nav-items'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'

// The deep-navy band that closes every page (docs/06 §2, docs/14 ADR-020, ADR-024): the brand,
// the 3 groups of the bar repeated with their mono indexes (sun yellow, as in SectionIndex on
// ink), one link per case, LinkedIn (a new tab, ADR-025), privacy and language, then © and the
// postal address (CAN-SPAM, the same as the outreach emails). on-ink gives every link the
// sun-yellow focus ring. All links are ≥ 44 px tall. A link to this very page is aria-current
// and untracked: a click on its own case link is not a case_open.
const LINK =
  'inline-flex min-h-11 items-center underline decoration-current hover:text-on-ink-1 hover:decoration-sun-400 motion-safe:transition-colors motion-safe:duration-120'

export function Footer({
  lang,
  content,
  alternates,
}: {
  lang: Locale
  content: SiteContent // footer and nav texts, plus the groups of the bar
  alternates: Alternates
}) {
  const { footer, nav } = content
  const other: Locale = lang === 'en' ? 'es' : 'en'
  const here = alternates[lang] // this page's own path
  const groups = navGroups(lang, content, here)
  const address = postalAddress()
  return (
    <footer className="on-ink bg-deep pt-14 pb-8 text-sm leading-body text-on-ink-2 lg:pt-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <a
              href={homePath(lang)}
              className="inline-flex min-h-11 items-center text-xl font-extrabold tracking-[-0.01em] text-on-ink-1 stretch-title no-underline"
            >
              {site.name}
            </a>
            <p className="max-w-[28ch] text-base leading-lead">{nav.tagline}</p>
          </div>

          <nav
            aria-label={footer.navLabel}
            className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6"
          >
            <ul>
              {groups.map((group, i) => (
                <li key={group.key}>
                  <a
                    href={group.href}
                    aria-current={group.href === here ? 'page' : undefined}
                    className="group inline-flex min-h-11 items-center gap-3 text-base font-semibold text-on-ink-1 no-underline"
                  >
                    <span aria-hidden="true" className="w-5 label-mono text-sun-400">
                      {pad2(i + 1)}
                    </span>
                    <span className="underline decoration-transparent group-hover:decoration-sun-400">
                      {group.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <ul>
              {featuredCases.map((study) => {
                const href = casePath(lang, study.id)
                return (
                  <li key={study.id}>
                    <a
                      href={href}
                      className={LINK}
                      {...(href === here
                        ? { 'aria-current': 'page' as const }
                        : trackAttrs('case_open', 'footer'))}
                    >
                      {footer.caseLink.replace('{name}', study.client.name)}
                    </a>
                  </li>
                )
              })}
              <li>
                <a
                  href={site.contact.linkedin}
                  target="_blank"
                  rel="noopener"
                  className={`${LINK} gap-1.5`}
                  {...trackAttrs('linkedin_open', 'footer')}
                >
                  {footer.linkedin}
                  <Icon name="external" className="size-4 shrink-0" />
                  <span className="sr-only"> {content.linkedin.newTab}</span>
                </a>
              </li>
              <li>
                <a href={privacyPath(lang)} className={LINK}>
                  {footer.privacy}
                </a>
              </li>
              <li>
                <a href={alternates[other]} lang={other} hrefLang={other} className={LINK}>
                  {nav.switchLanguage}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-on-ink-line pt-6 sm:flex-row sm:justify-between sm:gap-6">
          <p>
            © {new Date().getFullYear()} {site.name}. {footer.rights}
          </p>
          {address && (
            <p>
              <span className="font-semibold text-on-ink-1">{footer.addressLabel}:</span> {address}
            </p>
          )}
        </div>
      </Container>
    </footer>
  )
}
