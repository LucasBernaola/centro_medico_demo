import type { Specialty } from '@/types';
export const specialties: Specialty[] = [
  {
    id: 'cardio',
    slug: 'cardiologia',
    name: 'Cardiología',
    summary: 'Un equipo atento al cuidado de tu corazón.',
    description:
      'Un espacio de consulta para acompañar el cuidado cardiovascular, con atención personalizada y continuidad en cada visita.',
    areas: ['Consulta cardiológica', 'Controles programados', 'Seguimiento profesional'],
    icon: 'heart',
  },
  {
    id: 'clinica',
    slug: 'clinica-medica',
    name: 'Clínica médica',
    summary: 'Una mirada integral para cada etapa de tu vida.',
    description:
      'La consulta clínica es un punto de encuentro para conversar sobre tu salud y organizar tu atención con una mirada integral.',
    areas: ['Consulta general', 'Controles de rutina', 'Orientación y seguimiento'],
    icon: 'cross',
  },
  {
    id: 'pedia',
    slug: 'pediatria',
    name: 'Pediatría',
    summary: 'Cercanía y cuidado para los más pequeños.',
    description:
      'Acompañamos a chicos, chicas y sus familias con una atención cercana en las distintas etapas de crecimiento.',
    areas: ['Consulta pediátrica', 'Controles de crecimiento', 'Acompañamiento familiar'],
    icon: 'baby',
  },
  {
    id: 'derma',
    slug: 'dermatologia',
    name: 'Dermatología',
    summary: 'Atención dedicada al bienestar de tu piel.',
    description:
      'Un equipo que escucha y acompaña tus consultas sobre la piel, con atención individual y seguimiento profesional.',
    areas: ['Consulta dermatológica', 'Controles de piel', 'Seguimiento profesional'],
    icon: 'skin',
  },
  {
    id: 'trauma',
    slug: 'traumatologia',
    name: 'Traumatología',
    summary: 'Acompañamos tu movimiento, todos los días.',
    description:
      'Consultas orientadas al cuidado del sistema musculoesquelético, en un entorno cómodo y con tiempo para escucharte.',
    areas: ['Consulta traumatológica', 'Evaluación profesional', 'Controles y seguimiento'],
    icon: 'bone',
  },
  {
    id: 'gine',
    slug: 'ginecologia',
    name: 'Ginecología',
    summary: 'Un espacio de confianza, escucha y respeto.',
    description:
      'Atención ginecológica centrada en la persona, con un espacio de diálogo y acompañamiento en cada consulta.',
    areas: ['Consulta ginecológica', 'Controles programados', 'Acompañamiento profesional'],
    icon: 'flower',
  },
];
