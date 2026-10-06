import Link from 'next/link';
import { ArrowUpRight, Clock3, Check } from 'lucide-react';
import { AppointmentPreview } from './appointment-preview';
import { Reveal } from '@/components/ui/reveal';
export function AppointmentCTA() {
  return (
    <section className="appointment-cta-section">
      <div className="container">
        <div className="appointment-cta">
          <Reveal className="cta-copy" direction="left">
            <span className="eyebrow">MÁS SIMPLE. MÁS CERCA.</span>
            <h2>
              Tu turno, sin llamadas
              <br />
              <em>ni esperas.</em>
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
          </Reveal>
          <Reveal className="cta-right" direction="right" delay={0.08}>
            <AppointmentPreview />
            <Link href="/turnos" className="button button-white">
              Solicitar turno online
              <ArrowUpRight size={18} />
            </Link>
            <small>Unos pocos pasos. Todo desde acá.</small>
          </Reveal>
          <span className="cta-decoration" aria-hidden="true">
            +
          </span>
        </div>
      </div>
    </section>
  );
}
