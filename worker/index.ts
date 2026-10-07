// Runs only for the paths in `assets.run_worker_first` (wrangler.jsonc). Everything else is
// served straight from the static assets in out/. See docs/04 §2 and docs/14 ADR-004.

const SHORT_LINKS: Record<string, string> = {
  '/call': 'https://cal.com/tu-usuario/15min',
  '/llamada': 'https://cal.com/tu-usuario/15min-es', // or 15min if the Free plan allows a single event (docs/07 §2.1)
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/') {
      // Only the first preferred language: es, es-CO, es-419… → /es; everything else → /en
      const first = (request.headers.get('accept-language') ?? '').trim().toLowerCase()
      return redirect((first.startsWith('es') ? '/es' : '/en') + url.search)
    }

    const shortLink = SHORT_LINKS[url.pathname]
    if (shortLink) return redirect(shortLink + url.search)

    // v1.1: if (url.pathname === '/api/contact') return handleContact(request, env)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

// 307 so browsers don't cache it; url.search carries the UTM parameters to the destination
function redirect(location: string): Response {
  return new Response(null, {
    status: 307,
    headers: { location, 'cache-control': 'no-store', vary: 'accept-language' },
  })
}
