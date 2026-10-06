'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DEMO_DATE, BOOKING_WINDOW_DAYS } from '@/data/availability';
import { formatDate, isBookableDate, shiftDate, slotsFor } from '@/lib/schedule';
import { useBooking } from './booking-provider';
export function DateTimeStep({
  doctorId,
  date,
  time,
  onDate,
  onTime,
}: {
  doctorId: string;
  date: string;
  time: string;
  onDate: (date: string) => void;
  onTime: (time: string) => void;
}) {
  const { appointments } = useBooking();
  const [month, setMonth] = useState((date || DEMO_DATE).slice(0, 7));
  const first = new Date(`${month}-01T12:00:00`);
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const end = shiftDate(DEMO_DATE, BOOKING_WINDOW_DAYS);
  const monthLabel = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(
    first,
  );
  const slots = date ? slotsFor(doctorId, date, appointments).filter((s) => s.available) : [];
  function changeMonth(delta: number) {
    const d = new Date(first);
    d.setMonth(d.getMonth() + delta);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return (
    <div className="date-time-step">
      <div className="calendar">
        <div className="calendar-header">
          <h3>{monthLabel}</h3>
          <div>
            <button
              type="button"
              className="icon-button"
              disabled={month <= DEMO_DATE.slice(0, 7)}
              aria-label="Mes anterior"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              disabled={month >= end.slice(0, 7)}
              aria-label="Mes siguiente"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="calendar-weekdays" aria-hidden="true">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="calendar-days">
          {Array.from({ length: offset }, (_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const day = `${month}-${String(i + 1).padStart(2, '0')}`;
            const available =
              isBookableDate(day) && slotsFor(doctorId, day, appointments).some((s) => s.available);
            return (
              <button
                type="button"
                key={day}
                disabled={!available}
                className={`${date === day ? 'selected' : ''} ${day === DEMO_DATE ? 'today' : ''}`}
                aria-label={`${formatDate(day, true)}${available ? ' · Disponible' : ' · Sin disponibilidad'}`}
                aria-pressed={date === day}
                title={
                  available ? 'Hay horarios disponibles' : 'Sin horarios disponibles para reservar'
                }
                onClick={() => onDate(day)}
              >
                {i + 1}
                {available && <i />}
              </button>
            );
          })}
        </div>
        <div className="calendar-legend">
          <span>
            <i />
            Días con horarios libres
          </span>
          <span>Próximos 30 días</span>
        </div>
      </div>
      <div className="time-picker">
        <h3>Horarios disponibles</h3>
        {date ? (
          <>
            <p className="selected-date">{formatDate(date, true)}</p>
            {slots.length ? (
              <fieldset className="time-options">
                <legend className="sr-only">Elegí un horario disponible</legend>
                {slots.map((s) => (
                  <label className={time === s.time ? 'selected' : ''} key={s.time}>
                    <input
                      type="radio"
                      name="time"
                      value={s.time}
                      checked={time === s.time}
                      onChange={() => onTime(s.time)}
                    />
                    {s.time}
                  </label>
                ))}
              </fieldset>
            ) : (
              <div className="booking-empty">
                <CalendarDays size={28} />
                <p>No quedan horarios disponibles para este día.</p>
                <button type="button" className="text-link" onClick={() => onDate('')}>
                  Elegir otra fecha
                </button>
              </div>
            )}
            <p className="form-caption">
              Solo se muestran espacios libres. Cada consulta tiene una duración de 30 minutos.
            </p>
          </>
        ) : (
          <div className="booking-empty">
            <CalendarDays size={28} />
            <p>Elegí un día en el calendario para ver los horarios.</p>
          </div>
        )}
      </div>
    </div>
  );
}
