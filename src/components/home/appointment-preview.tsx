'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, CalendarDays } from 'lucide-react';
import { useNovaMotion } from '@/components/ui/motion-provider';
export function AppointmentPreview() {
  const [time, setTime] = useState('10:30');
  const { reduced, ease } = useNovaMotion();
  return (
    <div className="appointment-preview">
      <div className="preview-caption">
        <CalendarDays size={16} />
        <span>Un momento para vos</span>
        <span className="preview-plus" aria-hidden="true">
          +
        </span>
      </div>
      <div className="preview-body">
        <div className="preview-date">
          <small>OCTUBRE</small>
          <strong>13</strong>
          <span>Martes</span>
        </div>
        <div className="preview-times" aria-label="Ejemplo ilustrativo de horarios">
          {['09:00', '10:30', '11:00'].map((value, index) => (
            <motion.button
              type="button"
              key={value}
              aria-pressed={time === value}
              aria-label={`Ejemplo visual: ${value}`}
              className={time === value ? 'selected' : ''}
              onClick={() => setTime(value)}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : index * 0.06, ease }}
            >
              <span>{value}</span>
              {time === value ? <Check size={15} /> : <span className="preview-time-dot" />}
            </motion.button>
          ))}
        </div>
      </div>
      <p>Ejemplo visual · No realiza una reserva</p>
    </div>
  );
}
