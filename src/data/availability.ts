import type { Exception } from '@/types';
export const DEMO_DATE = '2026-10-06';
export const BOOKING_WINDOW_DAYS = 30;
export const SLOT_DURATION = 30;
export const exceptions: Exception[] = [
  { doctorId: 'sofia', date: '2026-10-12', reason: 'Sin atención' },
  { doctorId: 'sofia', date: '2026-10-15', reason: 'Horario especial', start: 10, end: 12 },
  { doctorId: 'paula', date: '2026-10-08', reason: 'Sin atención' },
  { doctorId: 'mateo', date: '2026-10-09', reason: 'Sin atención' },
];
