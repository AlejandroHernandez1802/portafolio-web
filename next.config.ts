import type { NextConfig } from 'next'

// Static export served by Cloudflare (docs/14 ADR-017). Redirects live in worker/index.ts
// and headers in public/_headers, because `output: 'export'` ignores redirects() and headers().
const nextConfig: NextConfig = {
  output: 'export', // `next build` writes out/
  images: { unoptimized: true }, // no optimizer in a static export; images ship pre-optimized (docs/06 §4)
  experimental: { globalNotFound: true }, // bilingual 404 → out/404.html (docs/14 ADR-013)
}

export default nextConfig
