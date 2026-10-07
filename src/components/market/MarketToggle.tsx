'use client'

import { useSyncExternalStore } from 'react'
import { track } from '@/lib/analytics'
import { detectMarket, type Market } from '@/lib/market'

// USD / COP switch (docs/04 §8.4). The inline script already set html[data-market]; this island
// only changes it, saves the choice and reports currency_switch.

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
      className="min-h-9 min-w-14 rounded-md px-3 text-sm font-semibold text-muted aria-pressed:bg-white aria-pressed:text-fg aria-pressed:shadow-sm"
    >
      {text}
    </button>
  )

  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg bg-surface p-1">
      {option('us', usd)}
      {option('co', cop)}
    </div>
  )
}
