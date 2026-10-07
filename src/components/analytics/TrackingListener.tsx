'use client'

import { useEffect } from 'react'
import { track, type EventName } from '@/lib/analytics'
import { captureUtm, getCampaign } from '@/lib/utm'

// One client island for all analytics (docs/12 §4): CTA clicks via data-track, section views via
// data-track-view, and the `landing` event after the first real interaction.

const LANDING_KEY = 'landing_sent'
const VIEW_DELAY_MS = 1000
const LANDING_DELAY_MS = 4000

function once(key: string): boolean {
  try {
    if (sessionStorage.getItem(key)) return false
    sessionStorage.setItem(key, '1')
  } catch {}
  return true
}

export function TrackingListener() {
  useEffect(() => {
    const utm = captureUtm()
    const cleanups: Array<() => void> = []

    // Clicks in the CAPTURE phase, so no third party (e.g. Cal.com) can stop them
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]')
      if (!el?.dataset.track) return
      track(el.dataset.track as EventName, {
        location: el.dataset.trackLocation ?? 'unknown',
        campaign: getCampaign(),
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    cleanups.push(() => document.removeEventListener('click', onClick, { capture: true }))

    // landing: only with UTM, and only after a real interaction. Email security scanners open
    // links and may run JS; waiting for an interaction keeps them out of the numbers.
    if ((utm.utm_source || utm.utm_campaign) && !sessionStorage.getItem(LANDING_KEY)) {
      const send = () => {
        stop()
        if (once(LANDING_KEY))
          track('landing', { source: utm.utm_source ?? 'none', campaign: getCampaign() })
      }
      const onScroll = () => window.scrollY > 100 && send()
      let timer: number | undefined
      const armTimer = () => {
        window.clearTimeout(timer)
        if (document.visibilityState === 'visible')
          timer = window.setTimeout(send, LANDING_DELAY_MS)
      }
      const stop = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('pointerdown', send)
        window.removeEventListener('keydown', send)
        document.removeEventListener('visibilitychange', armTimer)
        window.clearTimeout(timer)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('pointerdown', send)
      window.addEventListener('keydown', send)
      document.addEventListener('visibilitychange', armTimer)
      armTimer()
      cleanups.push(stop)
    }

    // Section views: 50 % visible for 1 s, once per session
    const timers = new Map<Element, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.trackView as EventName | undefined
          if (!name) continue
          if (entry.isIntersecting) {
            timers.set(
              entry.target,
              window.setTimeout(() => {
                observer.unobserve(entry.target)
                if (once(`view_${name}`)) track(name, { campaign: getCampaign() })
              }, VIEW_DELAY_MS),
            )
          } else {
            window.clearTimeout(timers.get(entry.target))
          }
        }
      },
      { threshold: 0.5 },
    )
    document.querySelectorAll('[data-track-view]').forEach((el) => observer.observe(el))
    cleanups.push(() => {
      observer.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])
  return null
}
