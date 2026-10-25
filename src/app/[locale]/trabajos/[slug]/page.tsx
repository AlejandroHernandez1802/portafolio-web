import type { Metadata } from 'next'
import { CasePage, caseMetadata, caseStaticParams } from '@/components/case/CasePage'

// Spanish case pages: /es/trabajos/{slug}. /en/trabajos/* is never generated (docs/14 ADR-020).
export const dynamicParams = false

export function generateStaticParams() {
  return caseStaticParams('es')
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/trabajos/[slug]'>): Promise<Metadata> {
  return caseMetadata('es', (await params).slug)
}

export default async function Page({ params }: PageProps<'/[locale]/trabajos/[slug]'>) {
  return <CasePage lang="es" slug={(await params).slug} />
}
