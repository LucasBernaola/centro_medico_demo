'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useNovaMotion } from '@/components/ui/motion-provider';
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Clock3 } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { specialties } from '@/data/specialties';
import { DEMO_DATE } from '@/data/availability';
import { formatDate } from '@/lib/schedule';
import { validatePatient, type PatientErrors } from '@/lib/patient-validation';
import type { Booking, PatientData, Reservation } from '@/types';
import { useBooking } from '@/components/appointments/booking-provider';
import { PatientDataStep } from '@/components/appointments/patient-data-step';
import { SpecialtyStep, ProfessionalStep } from '@/components/appointments/selection-steps';
import { DateTimeStep } from '@/components/appointments/calendar';
import { AppointmentReview } from '@/components/appointments/review';
import { AppointmentSuccess } from '@/components/appointments/success';
const steps = ['Tus datos', 'Especialidad', 'Profesional', 'Día y horario', 'Confirmación'];
const headings = [
  'Comencemos con tus datos',
  '¿Con qué especialidad necesitás atenderte?',
  'Elegí tu profesional',
  'Encontrá un momento para vos',
  'Revisá los datos de tu turno',
];
const descriptions = [
  'Contanos cómo te llamás y cómo contactarte.',
  'Una atención pensada para lo que necesitás.',
  'Conocé al equipo y elegí quién te va a acompañar.',
  'Seleccioná un día y el horario que mejor te convenga.',
  'Todo listo. Revisá la información antes de confirmar.',
];
const emptyPatient: PatientData = { firstName: '', lastName: '', dni: '', phone: '', email: '' };
export function AppointmentFlow({ preset }: { preset: Partial<Booking> }) {
  const { reserve } = useBooking();
  const { reduced, ease } = useNovaMotion();
  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState<PatientData>(emptyPatient);
  const [booking, setBooking] = useState<Booking>({
    specialtyId: preset.specialtyId || '',
    doctorId: preset.doctorId || '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState<PatientErrors>({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (hasNavigated.current) {
      heading.current?.focus({ preventScroll: true });
      document
        .getElementById('booking-card')
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    hasNavigated.current = true;
  }, [step]);
  useEffect(() => {
    if (reservation) {
      document.getElementById('success-title')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [reservation]);
  const selectedDoctor = doctors.find((d) => d.id === booking.doctorId);
  const selectedSpecialty = specialties.find((s) => s.id === booking.specialtyId);
  const canContinue = [
    true,
    !!booking.specialtyId,
    !!booking.doctorId,
    !!booking.date && !!booking.time,
    true,
  ][step];
  function move(next: number) {
    setError('');
    setStep(next);
  }
  async function next() {
    if (step === 0) {
      const issues = validatePatient(patient);
      setErrors(issues);
      if (Object.keys(issues).length) {
        document.getElementById(`patient-${Object.keys(issues)[0]}`)?.focus();
        return;
      }
    }
    if (step < 4) {
      move(step + 1);
      return;
    }
    if (pending) return;
    setPending(true);
    try {
      const result = await reserve(booking, patient);
      if (result.reservation) setReservation(result.reservation);
      else {
        setError(result.error);
        setStep(3);
        setBooking({ ...booking, time: '' });
      }
    } catch {
      setError('No pudimos registrar tu turno. Intentá nuevamente.');
    } finally {
      setPending(false);
    }
  }
  if (reservation)
    return (
      <AppointmentSuccess
        reservation={reservation}
        onRestart={() => {
          setReservation(null);
          setPatient(emptyPatient);
          setBooking({ specialtyId: '', doctorId: '', date: '', time: '' });
          setErrors({});
          setError('');
          setStep(0);
          hasNavigated.current = false;
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />
    );
  return (
    <section className="booking-page">
      <div className="container booking-container">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} />
          Volver a Nova
        </Link>
        <div className="booking-page-heading">
          <span className="eyebrow">TU PRÓXIMA CONSULTA EMPIEZA ACÁ</span>
          <h1>Solicitá tu turno online.</h1>
          <p>Unos pocos pasos para encontrar un espacio para vos.</p>
        </div>
        <div className="booking-layout">
          <div className="booking-card" id="booking-card">
            <ol className="stepper" aria-label="Pasos para solicitar un turno">
              {steps.map((label, i) => (
                <li key={label} className={i === step ? 'current' : i < step ? 'completed' : ''}>
                  <button
                    type="button"
                    disabled={i > step || pending}
                    onClick={() => move(i)}
                    aria-current={i === step ? 'step' : undefined}
                    aria-label={`Paso ${i + 1}: ${label}`}
                  >
                    <span>{i < step ? <Check size={15} /> : i + 1}</span>
                    <strong>{label}</strong>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mobile-step-label">
              <span>Paso {step + 1} de 5</span>
              <strong>{steps[step]}</strong>
            </div>
            <div
              className="step-progress"
              role="progressbar"
              aria-label="Progreso de tu solicitud"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={5}
            >
              <motion.span
                initial={false}
                animate={{ scaleX: (step + 1) / 5 }}
                transition={{ duration: reduced ? 0 : 0.22, ease }}
              />
            </div>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (canContinue) void next();
              }}
            >
              <div className="step-body">
                <h2 ref={heading} tabIndex={-1}>
                  {headings[step]}
                </h2>
                <p className="step-description">{descriptions[step]}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduced ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.16 }}
                  >
                    {step === 0 && (
                      <PatientDataStep
                        value={patient}
                        errors={errors}
                        onChange={(value) => {
                          setPatient(value);
                          setErrors({});
                        }}
                      />
                    )}
                    {step === 1 && (
                      <SpecialtyStep
                        value={booking.specialtyId}
                        onChange={(id) =>
                          setBooking({
                            ...booking,
                            specialtyId: id,
                            ...(id !== booking.specialtyId
                              ? { doctorId: '', date: '', time: '' }
                              : {}),
                          })
                        }
                      />
                    )}
                    {step === 2 && (
                      <ProfessionalStep
                        specialtyId={booking.specialtyId}
                        value={booking.doctorId}
                        onChange={(id) =>
                          setBooking({
                            ...booking,
                            doctorId: id,
                            ...(id !== booking.doctorId ? { date: '', time: '' } : {}),
                          })
                        }
                      />
                    )}
                    {step === 3 && (
                      <DateTimeStep
                        doctorId={booking.doctorId}
                        date={booking.date}
                        time={booking.time}
                        onDate={(date) => setBooking({ ...booking, date, time: '' })}
                        onTime={(time) => setBooking({ ...booking, time })}
                      />
                    )}
                    {step === 4 && (
                      <AppointmentReview booking={booking} patient={patient} onEdit={move} />
                    )}
                  </motion.div>
                </AnimatePresence>
                {error && (
                  <p role="alert" className="booking-error">
                    {error}
                  </p>
                )}
              </div>
              <div className="step-actions">
                {step > 0 ? (
                  <button
                    type="button"
                    className="button button-outline"
                    disabled={pending}
                    onClick={() => move(step - 1)}
                  >
                    <ArrowLeft size={16} />
                    Atrás
                  </button>
                ) : (
                  <span className="step-action-note">
                    <LockKeyhole size={14} />
                    Solo datos ficticios
                  </span>
                )}
                <button className="button" type="submit" disabled={!canContinue || pending}>
                  {pending ? 'Confirmando…' : step === 4 ? 'Confirmar turno' : 'Continuar'}
                  {step === 4 ? <Check size={17} /> : <ArrowRight size={17} />}
                </button>
              </div>
            </form>
          </div>
          <aside className="booking-aside">
            <span className="eyebrow">TE ACOMPAÑAMOS</span>
            <h3>
              Una consulta.
              <br />
              Un espacio para vos.
            </h3>
            <p>
              Elegí con tranquilidad. Podés volver a un paso anterior para modificar tu selección.
            </p>
            {selectedSpecialty && (
              <div className="booking-context">
                <small>TU SELECCIÓN</small>
                <strong>{selectedSpecialty.name}</strong>
                {selectedDoctor && <span>{selectedDoctor.name}</span>}
                {booking.date && (
                  <span>
                    {formatDate(booking.date)}
                    {booking.time && ` · ${booking.time} h`}
                  </span>
                )}
              </div>
            )}
            <div className="booking-aside-note">
              <Clock3 size={19} />
              <p>Recordá llegar 10 minutos antes de tu consulta.</p>
            </div>
            <p className="booking-demo-date">
              Demo con fecha simulada: {formatDate(DEMO_DATE)}.<br />
              No ingreses información real.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
