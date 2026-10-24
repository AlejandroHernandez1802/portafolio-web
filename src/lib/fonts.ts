import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'

// Both are served from our own domain: no requests to Google at runtime (docs/06 §3.2).
//
// Archivo does display, headings and body by moving its width axis, so it is the variable font,
// cut to the ranges the design system uses (wdth 62–100 %, wght 400–800): 60 KB instead of the
// 90 KB that Google serves, for the LCP budget (docs/11 §2, how to rebuild it in docs/06 §3.2).
// 'swap' so a slow first visit still gets it: each width role has its own size-adjusted
// fallback in globals.css that keeps the H1 on the same lines, so the swap moves nothing.
const archivo = localFont({
  src: '../fonts/archivo-latin-wdth62-100-wght400-800.woff2',
  weight: '400 800',
  style: 'normal',
  declarations: [{ prop: 'font-stretch', value: '62% 100%' }],
  variable: '--font-archivo',
  display: 'swap',
  adjustFontFallback: false, // the fallbacks live in globals.css, one per width role
})

// Mono is only for data labels, all in 500: one 10 KB file. It is not preloaded, but the stage
// in the first screen uses it, so it is still fetched before the first paint (docs/11 §2).
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false,
})

/** Classes for <html> that declare --font-archivo and --font-plex-mono (used by globals.css). */
export const fontVariables = `${archivo.variable} ${plexMono.variable}`
