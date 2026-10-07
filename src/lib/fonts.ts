import { Inter } from 'next/font/google'

// Self-hosted at build time: no requests to Google at runtime (docs/06 §3).
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
