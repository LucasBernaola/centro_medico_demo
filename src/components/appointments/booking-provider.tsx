'use client';
import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { appointments as initialAppointments } from '@/data/appointments';
import { validateBooking } from '@/lib/schedule';
import { validatePatient } from '@/lib/patient-validation';
import type { Appointment, Booking, PatientData, Reservation } from '@/types';
type ReservationResult =
  { reservation: Reservation; error: null } | { reservation: null; error: string };
interface BookingStore {
  appointments: Appointment[];
  reserve: (booking: Booking, patient: PatientData) => Promise<ReservationResult>;
}
const Context = createContext<BookingStore | null>(null);
export function BookingProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const current = useRef(initialAppointments);
  async function reserve(booking: Booking, patient: PatientData): Promise<ReservationResult> {
    if (Object.keys(validatePatient(patient)).length)
      return { reservation: null, error: 'Revisá tus datos antes de confirmar.' };
    const error = validateBooking(booking, current.current);
    if (error) return { reservation: null, error };
    const id = crypto.randomUUID();
    const reservation: Reservation = {
      ...booking,
      patient: { ...patient },
      id,
      code: `NOV-${id.replaceAll('-', '').slice(0, 6).toUpperCase()}`,
    };
    current.current = [
      ...current.current,
      { id, doctorId: booking.doctorId, date: booking.date, time: booking.time },
    ];
    setAppointments(current.current);
    return { reservation, error: null };
  }
  return <Context.Provider value={{ appointments, reserve }}>{children}</Context.Provider>;
}
export function useBooking() {
  const context = useContext(Context);
  if (!context) throw new Error('Falta el proveedor de reservas');
  return context;
}
