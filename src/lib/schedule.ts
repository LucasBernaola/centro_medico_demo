import { doctors } from '@/data/professionals';
import { DEMO_DATE, BOOKING_WINDOW_DAYS, SLOT_DURATION, exceptions } from '@/data/availability';
import type { Appointment, Booking } from '@/types';
export function formatDate(date: string, long = false) {
  return new Intl.DateTimeFormat(
    'es-AR',
    long
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { day: '2-digit', month: '2-digit', year: 'numeric' },
  ).format(new Date(`${date}T12:00:00`));
}
export function formatFullDate(date: string) {
  const formatted = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
export function shiftDate(date: string, delta: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function slotsFor(doctorId: string, date: string, appointments: Appointment[]) {
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor || !doctor.days.includes(new Date(`${date}T12:00:00`).getDay())) return [];
  const exception = exceptions.find((e) => e.doctorId === doctorId && e.date === date);
  if (exception && exception.start === undefined) return [];
  const result = [];
  for (
    let minutes = (exception?.start ?? doctor.start) * 60;
    minutes < (exception?.end ?? doctor.end) * 60;
    minutes += SLOT_DURATION
  ) {
    const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    const occupied = appointments.some(
      (a) => a.doctorId === doctorId && a.date === date && a.time === time && !a.cancelled,
    );
    result.push({ time, available: !occupied });
  }
  return result;
}
export function isBookableDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(parsed.getTime()) &&
    shiftDate(date, 0) === date &&
    date >= DEMO_DATE &&
    date <= shiftDate(DEMO_DATE, BOOKING_WINDOW_DAYS)
  );
}
export function validateBooking(booking: Booking, appointments: Appointment[]) {
  if (!isBookableDate(booking.date))
    return 'Elegí una fecha dentro de los próximos 30 días de la demo.';
  const doctor = doctors.find((d) => d.id === booking.doctorId);
  if (!doctor || doctor.specialtyId !== booking.specialtyId)
    return 'Elegí un profesional de la especialidad seleccionada.';
  if (
    !slotsFor(booking.doctorId, booking.date, appointments).some(
      (s) => s.time === booking.time && s.available,
    )
  )
    return 'Ese horario ya no está disponible. Elegí otro para continuar.';
  return null;
}
export function bookingHref({
  specialtyId,
  doctorId,
}: { specialtyId?: string; doctorId?: string } = {}) {
  const params = new URLSearchParams();
  if (specialtyId) params.set('especialidad', specialtyId);
  if (doctorId) params.set('profesional', doctorId);
  return `/turnos${params.size ? `?${params}` : ''}`;
}
