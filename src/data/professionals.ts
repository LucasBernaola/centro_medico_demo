import type { Doctor } from '@/types';
export const doctors: Doctor[] = [
  {
    id: 'sofia',
    slug: 'sofia-martinez',
    name: 'Dra. Sofía Martínez',
    specialtyId: 'cardio',
    image: '/images/professionals/sofia.webp',
    introduction:
      'Creo en una atención que comienza con la escucha. Mi propuesta es acompañarte con claridad, cercanía y tiempo para conversar.',
    days: [1, 2, 4],
    start: 9,
    end: 14,
  },
  {
    id: 'nicolas',
    slug: 'nicolas-ferrer',
    name: 'Dr. Nicolás Ferrer',
    specialtyId: 'clinica',
    image: '/images/professionals/nicolas.webp',
    introduction:
      'Una mirada integral y un vínculo de confianza hacen la diferencia. Me interesa que cada consulta sea un espacio de encuentro.',
    days: [1, 2, 3, 5],
    start: 8,
    end: 13,
  },
  {
    id: 'paula',
    slug: 'paula-rios',
    name: 'Dra. Paula Ríos',
    specialtyId: 'derma',
    image: '/images/professionals/paula.webp',
    introduction:
      'Cada persona tiene su propia historia. Te acompaño con atención personalizada y explicaciones claras en cada visita.',
    days: [2, 3, 4],
    start: 9,
    end: 13,
  },
  {
    id: 'julieta',
    slug: 'julieta-fernandez',
    name: 'Dra. Julieta Fernández',
    specialtyId: 'pedia',
    image: '/images/professionals/julieta.webp',
    introduction:
      'Acompañar a las familias con calidez y paciencia es el centro de mi trabajo. Un espacio amable para los más pequeños.',
    days: [1, 2, 4, 5],
    start: 9,
    end: 14,
  },
  {
    id: 'mateo',
    slug: 'mateo-alvarez',
    name: 'Dr. Mateo Álvarez',
    specialtyId: 'trauma',
    image: '/images/professionals/mateo.webp',
    introduction:
      'Me gusta trabajar junto a cada persona, escuchando sus inquietudes y acompañando su atención de manera cercana.',
    days: [1, 3, 5],
    start: 10,
    end: 16,
  },
  {
    id: 'elena',
    slug: 'elena-acosta',
    name: 'Dra. Elena Acosta',
    specialtyId: 'gine',
    image: '/images/professionals/elena.webp',
    introduction:
      'Te recibo en un espacio de confianza y respeto, con tiempo para escuchar tus preguntas y acompañar cada etapa.',
    days: [2, 4],
    start: 10,
    end: 15,
  },
];
