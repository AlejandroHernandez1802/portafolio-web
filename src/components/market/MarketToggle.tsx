'use client'

import { useSyncExternalStore } from 'react'
import { track } from '@/lib/analytics'
import { detectMarket, type Market } from '@/lib/market'

// USD / COP switch (docs/04 §8.4). The inline script already set html[data-market]; this island
// only changes it, saves the choice and reports currency_switch. Looks: the design system's
// segmented control, a cobalt frame whose selected option is filled cobalt with white mono text.

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ['data-market'] })
  return () => observer.disconnect()
}
const getMarket = (): Market => (document.documentElement.dataset.market === 'co' ? 'co' : 'us')
const getServerMarket = (): Market => 'us'

/** Applies and saves the visitor's choice; the store above re-renders the buttons. */
function setMarket(to: Market) {
  document.documentElement.setAttribute('data-market', to)
  try {
    localStorage.setItem('mkt', to)
  } catch {}
  track('currency_switch', { to, detected: detectMarket() })
}

export function MarketToggle({ label, usd, cop }: { label: string; usd: string; cop: string }) {
  const market = useSyncExternalStore(subscribe, getMarket, getServerMarket)

  const choose = (to: Market) => {
    if (to !== market) setMarket(to)
  }

  const option = (value: Market, text: string) => (
    <button
      type="button"
      aria-pressed={market === value}
      onClick={() => choose(value)}
      className="min-h-9 min-w-14 cursor-pointer rounded-xs px-3 font-mono text-[13px] font-medium tracking-[0.06em] text-ink-2 hover:bg-accent-100 hover:text-accent-700 aria-pressed:bg-accent-500 aria-pressed:text-white motion-safe:transition-colors motion-safe:duration-120 motion-safe:ease-out"
    >
      {text}
    </button>
  )

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex gap-0.5 rounded-sm border border-accent-500 bg-paper-0 p-[3px]"
    >
      {option('us', usd)}
      {option('co', cop)}
    </div>
  )
}
