import type { Appointment } from '@/types';
import { doctors } from './professionals';
import { DEMO_DATE, exceptions } from './availability';
const occupiedDates = [DEMO_DATE, '2026-10-07', '2026-10-09', '2026-10-13'];
export const appointments: Appointment[] = occupiedDates.flatMap((date) =>
  doctors
    .filter(
      (d) =>
        d.days.includes(new Date(`${date}T12:00:00`).getDay()) &&
        !exceptions.some((e) => e.doctorId === d.id && e.date === date),
    )
    .flatMap((d) =>
      [0, 1, 3].map((slot, index) => {
        const minutes = d.start * 60 + slot * 30;
        return {
          id: `occupied-${date}-${d.id}-${index}`,
          doctorId: d.id,
          date,
          time: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
        };
      }),
    ),
);
// A full day makes the no-availability case testable without exposing patient records.
for (let minutes = 9 * 60; minutes < 13 * 60; minutes += 30)
  appointments.push({
    id: `full-paula-${minutes}`,
    doctorId: 'paula',
    date: '2026-10-14',
    time: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
  });
