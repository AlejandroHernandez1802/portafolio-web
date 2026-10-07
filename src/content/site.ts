import type { Disclosure, HeadlineVariant } from './types'

// Settings that don't depend on the language and change between versions (docs/04 §5).
// Changing a flag means commit + deploy, so every change stays in Git.
export const site = {
  url: 'https://alejandrodeveloper.com',
  name: 'Alejandro Hernández',
  indexable: false, // pre-launch: noindex on the whole site; true at launch (F1-10)
  features: {
    demoStore: false, // v2: shows #demo and switches the secondary CTA and the stage
    contactForm: false, // v1.1: shows the form in the closing section
  },
  hero: { activeHeadline: 'a' as HeadlineVariant }, // docs/12 §6
  caseMrb: { disclosure: 'anonymized' as Disclosure }, // 'named' once Brian approves
  contact: {
    email: 'hola@alejandrodeveloper.com',
    whatsapp: '57XXXXXXXXXX', // TODO(F0-13): no "+" or spaces (wa.me format)
    calLink: { en: 'tu-usuario/15min', es: 'tu-usuario/15min-es' }, // TODO(F0-09): one event per language (docs/07 §2.1)
  },
  demoUrl: 'https://demo.alejandrodeveloper.com', // v2
  analytics: { umamiWebsiteId: '4785d172-91a3-47a9-b8d6-cdf8a082806d' }, // public ID (docs/12 §4)
  legal: {
    postalAddress: 'Por definir', // TODO(F0-07): CAN-SPAM; same address as the emails
    privacyVersion: '2026-10-17', // effective date of the privacy policy
  },
}
