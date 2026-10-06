import type { News } from '@/types';
export const news: News[] = [
  {
    slug: 'un-espacio-para-escucharte',
    category: 'Nuestro centro',
    title: 'Un espacio pensado para escucharte',
    excerpt: 'Conocé nuestros consultorios y una forma de atención más cercana.',
    paragraphs: [
      'En Nova pensamos cada espacio para que tu visita sea cómoda: desde una recepción luminosa hasta consultorios tranquilos donde conversar con el equipo.',
      'Nuestra propuesta reúne distintas especialidades en un mismo lugar y una forma sencilla de organizar tu próxima consulta.',
      'Las instalaciones que se muestran son ilustrativas y forman parte de esta institución ficticia.',
    ],
    image: '/images/facilities/reception.webp',
    imageAlt: 'Recepción luminosa de un centro médico ficticio',
    date: '2026-10-02',
  },
  {
    slug: 'bienvenida-julieta',
    category: 'Nuestro equipo',
    title: 'Una nueva mirada para los más chicos',
    excerpt: 'La Dra. Julieta Fernández se suma al equipo de Pediatría.',
    paragraphs: [
      'Damos la bienvenida a la Dra. Julieta Fernández, profesional ficticia de nuestro equipo de Pediatría.',
      'Su propuesta de atención pone en el centro a las familias, con tiempo para escuchar y un espacio amable para cada consulta.',
      'Podés conocer sus días de atención y solicitar un turno desde la web.',
    ],
    image: '/images/professionals/julieta.webp',
    imageAlt: 'Retrato ilustrativo de la profesional ficticia Julieta Fernández',
    date: '2026-09-28',
  },
  {
    slug: 'organiza-tu-visita',
    category: 'Información útil',
    title: 'Tu próxima visita, más simple',
    excerpt: 'Todo lo que necesitás saber para organizar tu consulta en Nova.',
    paragraphs: [
      'Reservar tu consulta online lleva unos pocos pasos: ingresá datos ficticios, elegí una especialidad y encontrá el día y horario que mejor te convenga.',
      'Te sugerimos llegar diez minutos antes y traer tu documentación. Si necesitás llevar documentación adicional, consultalo previamente con el centro.',
      'Esta es una demostración: no se envían correos ni se realizan reservas en una institución real.',
    ],
    image: '/images/hero/consultation.webp',
    imageAlt: 'Consulta ilustrativa entre una médica y una paciente ficticias',
    date: '2026-09-21',
  },
];
