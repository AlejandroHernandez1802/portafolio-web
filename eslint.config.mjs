import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Internal links are plain <a> on purpose: in Next 16 static exports, next/link prefetches
      // RSC payloads from the wrong path and gets 404s (docs/14 ADR-017, vercel/next.js#85374).
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Cloudflare: Wrangler state and generated Worker types
    '.wrangler/**',
    'worker/worker-configuration.d.ts',
  ]),
])

export default eslintConfig
