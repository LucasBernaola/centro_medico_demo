import type { Metadata } from 'next';
import { site } from '@/data/site';
export const siteMetadata: Metadata = {
  metadataBase: new URL('https://centromediconova.demo'),
  title: {
    default: 'Centro Médico Nova | Atención y turnos online',
    template: '%s | Centro Médico Nova',
  },
  description: site.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Centro Médico Nova | Tu salud, más cerca',
    description: site.description,
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/images/hero/consultation.webp',
        width: 1440,
        height: 960,
        alt: 'Atención cercana en Centro Médico Nova · Imagen ilustrativa',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
};
