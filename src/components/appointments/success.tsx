import Link from 'next/link';
import { Check, CalendarDays, Clock3, MapPin, ArrowUpRight } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { specialties } from '@/data/specialties';
import { site } from '@/data/site';
import { formatFullDate } from '@/lib/schedule';
import type { Reservation } from '@/types';
export function AppointmentSuccess({
  reservation,
  onRestart,
}: {
  reservation: Reservation;
  onRestart: () => void;
}) {
  const doctor = doctors.find((d) => d.id === reservation.doctorId)!;
  return (
    <section className="success-screen" aria-labelledby="success-title">
      <div className="success-check">
        <Check size={35} strokeWidth={1.8} />
      </div>
      <span className="eyebrow">TODO LISTO PARA TU PRÓXIMA CONSULTA</span>
      <h1 id="success-title" tabIndex={-1}>
        ¡Tu turno fue reservado!
      </h1>
      <p>
        Gracias, {reservation.patient.firstName}. Tu turno quedó registrado
        <br className="desktop-break" /> en esta demostración.
      </p>
      <div className="success-reservation">
        <div className="success-code">
          <span>NÚMERO DE RESERVA</span>
          <strong>{reservation.code}</strong>
        </div>
        <div className="success-date">
          <CalendarDays size={24} />
          <div>
            <strong>{formatFullDate(reservation.date)}</strong>
            <span>{reservation.time} h</span>
          </div>
        </div>
        <div className="success-professional">
          <strong>{doctor.name}</strong>
          <span>{specialties.find((s) => s.id === doctor.specialtyId)?.name}</span>
        </div>
        <div className="success-place">
          <MapPin size={18} />
          {site.name} · {site.address}
        </div>
      </div>
      <div className="arrival-note">
        <Clock3 size={19} />
        Te recomendamos presentarte 10 minutos antes.
      </div>
      <div className="success-actions">
        <Link className="button" href="/">
          Volver al inicio
          <ArrowUpRight size={17} />
        </Link>
        <button className="button button-outline" onClick={onRestart}>
          Solicitar otro turno
        </button>
      </div>
      <p className="success-demo">
        Confirmación de demostración. No se envían emails ni mensajes.
        <br />
        La reserva se conserva mientras navegás y se reinicia al recargar.
      </p>
    </section>
  );
}
