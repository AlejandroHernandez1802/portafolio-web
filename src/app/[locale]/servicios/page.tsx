import type { Metadata } from 'next'
import { ServicesPage, servicesMetadata } from '@/components/services/ServicesPage'

// Spanish services page: /es/servicios. /en/servicios is never generated (docs/14 ADR-024).
export const dynamicParams = false

// Next calls it once per parent locale and merges the result over the parent's params, so
// returning the locale pins the page to its language (the duplicate is dropped), as in the case
// routes (caseStaticParams)
export function generateStaticParams() {
  return [{ locale: 'es' }]
}

export function generateMetadata(): Metadata {
  return servicesMetadata('es')
}

export default function Page() {
  return <ServicesPage lang="es" />
}
