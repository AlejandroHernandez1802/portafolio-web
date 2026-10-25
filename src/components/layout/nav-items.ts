import type { KnownMediaKey } from '@/media'
import { featuredCases } from '@/content/cases'
import { site } from '@/content/site'
import type { AboutNavItem, Locale, NavGroup, SiteContent } from '@/content/types'
import {
  ABOUT_SECTION,
  anchorHref,
  casePath,
  pagePath,
  SERVICE_ANCHOR,
  SERVICE_ORDER,
} from '@/lib/routes'

// The 3 groups of the bar and the mobile menu (docs/14 ADR-024), built once per page so the
// dropdowns, the menu and their links can't drift apart:
// - Work: one item per featured case (its card capture as a thumbnail), then "All work", the
//   work page (ADR-025).
// - Services: one item per block of the services page, then "All services".
// - About: who I am and how I work on the About page, then pricing; while the prices are hidden,
//   my LinkedIn profile in its place, in a new tab (ADR-025).

export type NavItem = {
  href: string
  title: string
  kicker?: string // mono line above the title (the service outcome)
  note?: string // line below the title
  badge?: string // "Demo · my own project"
  image?: KnownMediaKey // case items: the top of the card capture
  current: boolean // this very page: aria-current="page"
  event?: 'case_open' | 'linkedin_open' // counted from "nav"
  newTab?: string // an external link: opens a new tab, which this text tells screen readers
}

export type NavGroupModel = {
  key: NavGroup
  label: string
  href: string // the group's own page or section, for the mobile menu and the no-popover link
  items: NavItem[]
  all?: { href: string; label: string } // closing link of the dropdown
}

const ABOUT_ITEMS: Array<{ id: AboutNavItem; anchor?: string }> = [
  { id: 'intro' },
  { id: 'process', anchor: ABOUT_SECTION.process },
  site.features.pricing ? { id: 'pricing', anchor: ABOUT_SECTION.pricing } : { id: 'linkedin' },
]

export function navGroups(lang: Locale, content: SiteContent, here: string): NavGroupModel[] {
  const { nav, work, services } = content
  const workHref = pagePath(lang, 'work')
  const servicesPath = pagePath(lang, 'services')
  const aboutPath = pagePath(lang, 'about')
  return [
    {
      key: 'work',
      label: nav.links.work,
      href: workHref,
      items: featuredCases.map((study) => {
        const href = casePath(lang, study.id)
        return {
          href,
          title: study.client.name,
          note: content.cases[study.id].card.outcome,
          badge: study.kind === 'demo' ? work.card.demoBadge : undefined,
          image: study.media.cardTop ?? study.media.card,
          current: href === here,
          event: 'case_open' as const,
        }
      }),
      all: { href: workHref, label: nav.groups.work.all },
    },
    {
      key: 'services',
      label: nav.links.services,
      href: servicesPath,
      items: SERVICE_ORDER.map((id) => ({
        href: anchorHref(servicesPath, SERVICE_ANCHOR[id], here),
        title: services.tiles[id].title,
        kicker: services.tiles[id].outcome,
        current: false,
      })),
      all: { href: servicesPath, label: nav.groups.services.all },
    },
    {
      key: 'about',
      label: nav.links.about,
      href: aboutPath,
      items: ABOUT_ITEMS.map(({ id, anchor }): NavItem => {
        const { title, body } = nav.groups.about[id]
        if (id === 'linkedin') {
          const href = site.contact.linkedin
          return {
            href,
            title,
            note: body,
            current: false,
            event: 'linkedin_open',
            newTab: content.linkedin.newTab,
          }
        }
        const href = anchor ? anchorHref(aboutPath, anchor, here) : aboutPath
        return { href, title, note: body, current: href === here }
      }),
    },
  ]
}
