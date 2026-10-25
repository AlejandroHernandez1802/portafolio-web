import type { Metadata } from 'next'
import { AboutPage, aboutMetadata } from '@/components/sections/AboutPage'

// English about page: /en/about. /es/about is never generated (docs/14 ADR-024).
export const dynamicParams = false

// Next calls it once per parent locale and merges the result over the parent's params, so
// returning the locale pins the page to its language (the duplicate is dropped), as in the case
// routes (caseStaticParams)
export function generateStaticParams() {
  return [{ locale: 'en' }]
}

export function generateMetadata(): Metadata {
  return aboutMetadata('en')
}

export default function Page() {
  return <AboutPage lang="en" />
}
