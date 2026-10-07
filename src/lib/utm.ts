// UTM capture (docs/12 §4–5). First touch wins: the first page of the session that carries
// utm_* stores them in sessionStorage, and later pages without UTM keep the original values.

const KEY = 'utm'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type Utm = Partial<Record<(typeof PARAMS)[number], string>>

function read(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Utm
  } catch {
    return {}
  }
}

/** Stores the URL's UTM parameters if the session has none yet. Returns the session's UTM. */
export function captureUtm(): Utm {
  const stored = read()
  if (stored.utm_source || stored.utm_campaign) return stored
  const query = new URLSearchParams(location.search)
  const utm: Utm = {}
  for (const p of PARAMS) {
    const v = query.get(p)
    if (v) utm[p] = v.slice(0, 100)
  }
  if (Object.keys(utm).length === 0) return stored
  try {
    sessionStorage.setItem(KEY, JSON.stringify(utm))
  } catch {}
  return utm
}

export function getUtm(): Utm {
  return read()
}

export function getCampaign(): string {
  return read().utm_campaign ?? 'none'
}
