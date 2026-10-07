'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'
import { getCampaign, getUtm } from '@/lib/utm'
import { CAL_NAMESPACE } from './cal'

// Progressive enhancement for the booking links (docs/07 §2.3). Nothing loads at first paint:
// embed.js arrives on the first intent (hover, focus, touch) or when the browser is idle.

const ORIGIN = 'https://app.cal.com'
const EMBED_SRC = 'https://app.cal.com/embed/embed.js'
const SELECTOR = '[data-cal-link]'
const LOCATION_KEY = 'cal_location'

type Args = unknown[]
type Queue = ((...args: Args) => void) & { q: Args[] }
type CalGlobal = Queue & { loaded?: boolean; ns: Record<string, Queue> }

declare global {
  interface Window {
    Cal?: CalGlobal
  }
}

let ready = false

// Port of the official "pop-up via element click" snippet: queues calls until embed.js runs them.
function installCal(): CalGlobal {
  if (window.Cal) return window.Cal
  const cal = function (...args: Args) {
    const c = window.Cal!
    if (!c.loaded) {
      c.ns = {}
      const script = document.createElement('script')
      script.src = EMBED_SRC
      script.async = true
      script.onload = () => {
        ready = true
      }
      document.head.appendChild(script)
      c.loaded = true
    }
    if (args[0] === 'init') {
      const api = function (...a: Args) {
        api.q.push(a)
      } as Queue
      api.q = []
      const namespace = args[1]
      if (typeof namespace === 'string') {
        c.ns[namespace] ??= api
        c.ns[namespace].q.push(args)
        c.q.push(['initNamespace', namespace])
      } else {
        c.q.push(args)
      }
      return
    }
    c.q.push(args)
  } as CalGlobal
  cal.q = []
  window.Cal = cal
  return cal
}

/** Adds the session's UTM to every link's data-cal-config, so Cal.com stores them (docs/07 §2.3). */
function applyUtm() {
  const utm = getUtm()
  if (Object.keys(utm).length === 0) return
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    const config = JSON.parse(el.dataset.calConfig ?? '{}') as Record<string, string>
    el.dataset.calConfig = JSON.stringify({ ...config, ...utm })
  })
}

function load() {
  if (window.Cal?.loaded) return
  const cal = installCal()
  cal('init', CAL_NAMESPACE, { origin: ORIGIN })
  const ns = cal.ns[CAL_NAMESPACE]
  ns('ui', { hideEventTypeDetails: false, layout: 'month_view' })
  ns('on', {
    action: 'bookingSuccessfulV2',
    callback: () => {
      let location = 'unknown'
      try {
        location = sessionStorage.getItem(LOCATION_KEY) ?? 'unknown'
      } catch {}
      track('booking_completed', { location, campaign: getCampaign() })
    },
  })
  ns('on', {
    action: 'linkFailed',
    callback: () => {
      const link = document.querySelector<HTMLAnchorElement>(SELECTOR)
      if (link) window.open(link.href, '_blank', 'noopener')
    },
  })
  applyUtm()
}

export function CalLoader() {
  useEffect(() => {
    let preloaded = false
    const onIntent = (e: Event) => {
      const link = (e.target as Element | null)?.closest?.<HTMLElement>(SELECTOR)
      if (!link) return
      load()
      if (!preloaded && link.dataset.calLink) {
        window.Cal?.ns[CAL_NAMESPACE]('preload', { calLink: link.dataset.calLink })
        preloaded = true
      }
    }
    // Capture phase: with the embed ready, cancel the new tab and let Cal open the popup.
    // Before that, the browser follows the link in a new tab (docs/07 §2.3, step 5).
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR)
      if (!link) return
      try {
        sessionStorage.setItem(LOCATION_KEY, link.dataset.trackLocation ?? 'unknown')
      } catch {}
      if (ready) e.preventDefault()
      else load()
    }

    const intents = ['pointerover', 'focusin', 'touchstart'] as const
    intents.forEach((t) => document.addEventListener(t, onIntent, { passive: true }))
    document.addEventListener('click', onClick, { capture: true })

    // Fallback: load when the browser is idle, a few seconds after the page loads
    const timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(load)
      else load()
    }, 4000)

    return () => {
      intents.forEach((t) => document.removeEventListener(t, onIntent))
      document.removeEventListener('click', onClick, { capture: true })
      window.clearTimeout(timer)
    }
  }, [])
  return null
}
