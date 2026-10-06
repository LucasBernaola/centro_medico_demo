import Link from 'next/link';
import { ArrowUpRight, Clock3, Check, CalendarDays } from 'lucide-react';
export function AppointmentCTA() {
  return (
    <section className="appointment-cta-section">
      <div className="container">
        <div className="appointment-cta">
          <div>
            <span className="eyebrow">MÁS SIMPLE. MÁS CERCA.</span>
            <h2>
              Tu turno, sin llamadas
              <br />
              ni esperas.
            </h2>
            <p>
              Elegí tu especialidad, encontrá a tu profesional y reservá
              <br className="desktop-break" /> el día y horario que mejor te convenga.
            </p>
            <div className="cta-benefits">
              <span>
                <Clock3 size={15} />
                Disponible las 24 horas
              </span>
              <span>
                <Check size={16} />
                Confirmación en pantalla
              </span>
            </div>
          </div>
          <div className="cta-right">
            <span className="cta-calendar">
              <CalendarDays size={56} strokeWidth={1} />
            </span>
            <Link href="/turnos" className="button button-white">
              Solicitar turno online
              <ArrowUpRight size={18} />
            </Link>
            <small>Unos pocos pasos. Todo desde acá.</small>
          </div>
          <span className="cta-decoration" aria-hidden="true">
            +
          </span>
        </div>
      </div>
    </section>
  );
}
