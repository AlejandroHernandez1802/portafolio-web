import type { Locale, NavGroup, SiteContent } from '@/content/types'
import { trackAttrs } from '@/lib/analytics'
import { pad2 } from '@/lib/format'
import type { Alternates } from '@/lib/routes'
import { BookCallLink } from '@/components/booking/BookCallLink'
import { ResponsiveImage } from '@/components/media/ResponsiveImage'
import { Chip } from '@/components/ui/Chip'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { MenuCloser } from './MenuCloser'
import { navGroups, type NavGroupModel, type NavItem } from './nav-items'
import './nav.css'

// Right side of the bar (docs/14 ADR-020, ADR-024). From 1024 px: the 3 groups (Work, Services,
// About), the language link and "Book a call". Each group is a button that opens a native
// popover: a full-width panel under the bar with the group's items (nav-items.ts). Below
// 1024 px: the compact booking CTA and a "Menu" button that opens a popover with the 3 groups,
// each with its items, the language and the full CTA (nav.css). `current` marks the group of
// the page (the case pages pass 'work'); a link to this very page gets aria-current="page".
const MENU_ID = 'site-menu'
const panelId = (key: NavGroup) => `nav-${key}`

// 36 px buttons that still give a 48 px touch target (WCAG 2.5.8, docs/11 §3): the ::after
// overhangs 6 px above and below, inside the 56 px bar. Both are at least 44 px wide.
const HIT = 'relative after:absolute after:inset-x-0 after:-inset-y-1.5'

// A group in the bar: the dropdown button, or its no-popover fallback link (nav.css)
const BAR_LINK =
  'inline-flex min-h-11 items-center gap-1 px-2.5 text-[0.9375rem] font-medium text-ink-1 underline decoration-transparent underline-offset-[6px] hover:decoration-accent-500 data-current:text-accent-700 data-current:decoration-accent-500 xl:px-3'

const itemAttrs = (item: NavItem) => ({
  href: item.href,
  'aria-current': item.current ? ('page' as const) : undefined,
  ...(item.newTab ? { target: '_blank', rel: 'noopener' } : {}),
  ...(item.event && !item.current ? trackAttrs(item.event, 'nav') : {}),
})

/** The "opens in a new tab" note of an external item, for screen readers */
const NewTab = ({ item }: { item: NavItem }) =>
  item.newTab ? <span className="sr-only"> {item.newTab}</span> : null

/** The content of a dropdown: cards with a thumbnail for the cases, ruled rows for the rest. */
function DropdownPanel({ group }: { group: NavGroupModel }) {
  const cards = group.key === 'work'
  return (
    <>
      <ul className={`grid gap-x-8 lg:grid-cols-3 ${cards ? 'gap-y-4' : ''}`}>
        {group.items.map((item) => (
          <li key={item.href} className={cards ? '' : 'border-t border-ink-1'}>
            <a
              {...itemAttrs(item)}
              className={`group flex h-full gap-4 text-ink-1 no-underline ${cards ? 'border border-ink-1 bg-paper-1 p-3 hover:bg-accent-50' : 'py-4'}`}
            >
              {item.image && (
                <ResponsiveImage
                  image={item.image}
                  alt=""
                  sizes="96px"
                  className="shrink-0"
                  imgClassName="block size-24 border border-paper-3 object-cover object-top"
                />
              )}
              <span className="flex min-w-0 flex-col gap-1.5">
                {item.badge && <Chip className="self-start">{item.badge}</Chip>}
                {item.kicker && (
                  <span className="label-mono leading-[1.5] text-accent-700">{item.kicker}</span>
                )}
                <span className="text-[1.0625rem] leading-[1.25] font-bold stretch-title underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-accent-500 group-aria-[current=page]:decoration-accent-500">
                  {item.title}
                  {item.newTab && (
                    <Icon
                      name="external"
                      className="ml-1.5 inline size-4 align-[-2px] text-ink-2"
                    />
                  )}
                  <NewTab item={item} />
                </span>
                {item.note && (
                  <span className="text-[0.9375rem] leading-[1.4] text-ink-2">{item.note}</span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {group.all && (
        <a
          href={group.all.href}
          className="group mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-700 underline decoration-2 underline-offset-4"
        >
          {group.all.label}
          <Icon
            name="arrow"
            className="size-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[3px]"
          />
        </a>
      )}
    </>
  )
}

export function Nav({
  lang,
  content,
  alternates,
  current,
}: {
  lang: Locale
  content: SiteContent
  alternates: Alternates
  current?: NavGroup
}) {
  const { nav } = content
  const other: Locale = lang === 'en' ? 'es' : 'en'
  const here = alternates[lang] // this page's own path
  const groups = navGroups(lang, content, here)
  const language = { href: alternates[other], lang: other, hrefLang: other }
  const compact = nav.bookCall !== nav.bookCallFull
  const isCurrent = (key: NavGroup) => (current === key ? '' : undefined)

  return (
    <div className="flex shrink-0 items-center gap-2 lg:gap-5">
      <nav aria-label={nav.label} className="hidden items-center gap-3 lg:flex">
        <ul className="flex items-center">
          {groups.map((group) => (
            <li key={group.key}>
              {/* aria-expanded comes from the browser (popovertarget). The panel follows its
                  button in the DOM, so Tab goes from the button into the panel. */}
              <button
                type="button"
                popoverTarget={panelId(group.key)}
                popoverTargetAction="toggle"
                aria-controls={panelId(group.key)}
                data-current={isCurrent(group.key)}
                className={`site-dropdown-button ${BAR_LINK}`}
              >
                {group.label}
                <Icon name="chevron" className="site-dropdown-chevron size-4 text-ink-2" />
              </button>
              <a
                href={group.href}
                data-current={isCurrent(group.key)}
                className={`site-dropdown-fallback ${BAR_LINK}`}
              >
                {group.label}
              </a>
              <div id={panelId(group.key)} popover="auto" className="site-dropdown">
                <Container className="pt-6 pb-8">
                  <DropdownPanel group={group} />
                </Container>
              </div>
            </li>
          ))}
        </ul>
        {/* A hairline sets the language apart from the groups */}
        <a
          {...language}
          className="inline-flex min-h-11 items-center gap-3 text-sm font-medium text-ink-2 underline decoration-transparent underline-offset-[6px] before:h-5 before:w-px before:bg-paper-3 hover:text-ink-1 hover:decoration-accent-500"
        >
          {nav.switchLanguage}
        </a>
      </nav>

      <BookCallLink lang={lang} location="header" size="sm" className={HIT}>
        {compact ? (
          <>
            <span className="lg:hidden">{nav.bookCall}</span>
            <span className="hidden lg:inline">{nav.bookCallFull}</span>
          </>
        ) : (
          nav.bookCallFull
        )}
      </BookCallLink>

      {/* aria-expanded comes from the browser (popovertarget); the label stays "Menu" and the
          bars turn into an × while open, so the name always matches what is shown. Below 375 px
          the label is visually hidden, so the full name and the CTA still fit (280 px tested). */}
      <button
        type="button"
        popoverTarget={MENU_ID}
        popoverTargetAction="toggle"
        aria-controls={MENU_ID}
        className={`site-menu-button inline-flex min-h-9 min-w-11 items-center justify-center gap-2 rounded-sm px-2.5 text-sm leading-[1.2] font-semibold text-ink-1 inset-ring-1 inset-ring-ink-1 [-webkit-tap-highlight-color:transparent] hover:bg-paper-2 lg:hidden ${HIT}`}
      >
        <span aria-hidden="true" className="site-menu-icon" />
        <span className="sr-only min-[375px]:not-sr-only">{nav.menu.open}</span>
      </button>

      {/* Right after its button in the DOM, so Tab goes from the button into the panel in every
          browser. Each group is a 56 px row with its mono index (01–03), then its items. */}
      <nav id={MENU_ID} popover="auto" aria-label={nav.menu.label} className="site-menu lg:hidden">
        <Container className="flex flex-col pt-2 pb-6">
          <ul>
            {groups.map((group, i) => (
              <li key={group.key} className="border-b border-paper-3 pb-3">
                <a
                  href={group.href}
                  aria-current={group.href === here ? 'page' : undefined}
                  data-current={isCurrent(group.key)}
                  className="group flex min-h-14 items-center gap-4 pt-2 text-ink-1 no-underline"
                >
                  <span
                    aria-hidden="true"
                    className="border border-current px-1.5 py-1 label-mono text-ink-3 group-data-current:border-sun-400 group-data-current:bg-sun-400 group-data-current:text-ink-1"
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className="stretch-heading text-[1.5rem] leading-heading font-extrabold tracking-heading group-hover:text-accent-700">
                    {group.label}
                  </span>
                  <Icon
                    name="arrow"
                    className="ml-auto size-5 shrink-0 text-accent-500 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-[3px]"
                  />
                </a>
                <ul className="pl-12">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        {...itemAttrs(item)}
                        className="flex min-h-11 items-center gap-2 py-1.5 leading-[1.3] font-medium text-ink-2 hover:text-accent-700 aria-[current=page]:text-accent-700"
                      >
                        {item.title}
                        {item.newTab && <Icon name="external" className="size-4 shrink-0" />}
                        <NewTab item={item} />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <a
            {...language}
            className="mt-2 inline-flex min-h-12 items-center self-start text-base font-semibold text-ink-1 underline"
          >
            {nav.switchLanguage}
          </a>
          <BookCallLink lang={lang} location="nav" iconEnd="arrow" className="mt-3">
            {nav.bookCallFull}
          </BookCallLink>
        </Container>
      </nav>
      <MenuCloser menuIds={[MENU_ID, ...groups.map((g) => panelId(g.key))]} />
    </div>
  )
}
