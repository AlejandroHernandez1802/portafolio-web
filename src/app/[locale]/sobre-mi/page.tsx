import type { Metadata } from 'next'
import { AboutPage, aboutMetadata } from '@/components/sections/AboutPage'

// Spanish about page: /es/sobre-mi. /en/sobre-mi is never generated (docs/14 ADR-024).
export const dynamicParams = false

// Next calls it once per parent locale and merges the result over the parent's params, so
// returning the locale pins the page to its language (the duplicate is dropped), as in the case
// routes (caseStaticParams)
export function generateStaticParams() {
  return [{ locale: 'es' }]
}

export function generateMetadata(): Metadata {
  return aboutMetadata('es')
}

export default function Page() {
  return <AboutPage lang="es" />
}
