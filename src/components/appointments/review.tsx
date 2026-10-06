import { CalendarCheck2, MapPin } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { specialties } from '@/data/specialties';
import { site } from '@/data/site';
import { formatFullDate } from '@/lib/schedule';
import type { Booking, PatientData } from '@/types';
export function AppointmentReview({
  booking,
  patient,
  onEdit,
}: {
  booking: Booking;
  patient: PatientData;
  onEdit: (step: number) => void;
}) {
  const doctor = doctors.find((d) => d.id === booking.doctorId)!;
  const specialty = specialties.find((s) => s.id === booking.specialtyId)!;
  return (
    <div className="review-card">
      <div className="review-heading">
        <CalendarCheck2 size={24} />
        <span>Tu próxima consulta en Nova</span>
      </div>
      <div className="review-row">
        <div>
          <small>PACIENTE</small>
          <strong>
            {patient.firstName} {patient.lastName}
          </strong>
          <span>DNI {Number(patient.dni).toLocaleString('es-AR')}</span>
          <span>{patient.email}</span>
        </div>
        <button type="button" className="edit-button" onClick={() => onEdit(0)}>
          Modificar<span className="sr-only"> datos personales</span>
        </button>
      </div>
      <div className="review-row">
        <div>
          <small>ESPECIALIDAD Y PROFESIONAL</small>
          <strong>{doctor.name}</strong>
          <span>{specialty.name}</span>
        </div>
        <button type="button" className="edit-button" onClick={() => onEdit(1)}>
          Modificar<span className="sr-only"> especialidad y profesional</span>
        </button>
      </div>
      <div className="review-row">
        <div>
          <small>DÍA Y HORARIO</small>
          <strong>{formatFullDate(booking.date)}</strong>
          <span className="review-time">{booking.time} h</span>
        </div>
        <button type="button" className="edit-button" onClick={() => onEdit(3)}>
          Modificar<span className="sr-only"> día y horario</span>
        </button>
      </div>
      <div className="review-place">
        <MapPin size={20} />
        <span>
          <strong>{site.name}</strong>
          {site.address} · Ubicación ficticia
        </span>
      </div>
    </div>
  );
}
