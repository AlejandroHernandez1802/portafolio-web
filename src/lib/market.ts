import type { Locale, PriceSpec } from '@/content/types'

export type Market = 'us' | 'co'

// Market detection (docs/04 §8). Runs inline in <head> before first paint, in this order:
// 1. ?mkt=co|us in the URL (saved to localStorage), 2. previous choice in localStorage,
// 3. device time zone America/Bogota → co, 4. us. Without JavaScript the CSS shows USD.
export const MARKET_SCRIPT = `(function(){try{var q=new URLSearchParams(location.search).get('mkt');if(q==='co'||q==='us')localStorage.setItem('mkt',q);var m=localStorage.getItem('mkt')||(Intl.DateTimeFormat().resolvedOptions().timeZone==='America/Bogota'?'co':'us');document.documentElement.setAttribute('data-market',m)}catch(e){}})()`

/** Market the device would get without a saved choice (sent as `detected` in currency_switch). */
export function detectMarket(): Market {
  return Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Bogota' ? 'co' : 'us'
}

// Currency format by market and page language (docs/04 §8.3). Runs at build time.
function currencyFormat(market: Market, lang: Locale) {
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    style: 'currency',
    currency: market === 'us' ? 'USD' : 'COP',
    currencyDisplay: market === 'co' ? 'code' : 'symbol',
    maximumFractionDigits: 0,
  })
}

export type PriceLabels = { from: string; perMonth: string; free: string }

export function formatPrice(spec: PriceSpec, market: Market, lang: Locale, labels: PriceLabels) {
  if (spec.kind === 'free') return labels.free
  const format = currencyFormat(market, lang)
  const value =
    spec.kind === 'from'
      ? `${labels.from} ${format.format(spec.amount)}`
      : format.formatRange(spec.min, spec.max) // "COP 250,000–500,000", currency shown once
  return spec.period === 'month' ? `${value} ${labels.perMonth}` : value
}
