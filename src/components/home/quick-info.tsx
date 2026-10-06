import { Clock3, CalendarCheck2, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { site } from '@/data/site';
export function QuickInfo() {
  return (
    <div className="container">
      <section className="quick-info" aria-label="Información del centro">
        <div>
          <Clock3 size={23} />
          <span>
            <strong>Estamos para vos</strong>
            <small>{site.shortHours}</small>
          </span>
        </div>
        <Link href="/turnos">
          <CalendarCheck2 size={23} />
          <span>
            <strong>Turnos online</strong>
            <small>Reservá cuando lo necesites</small>
          </span>
          <ArrowUpRight className="quick-arrow" size={16} />
        </Link>
        <a href="#contacto">
          <MapPin size={23} />
          <span>
            <strong>Un lugar cerca tuyo</strong>
            <small>{site.address}</small>
          </span>
        </a>
        <a href="#contacto">
          <Phone size={22} />
          <span>
            <strong>Hablemos</strong>
            <small>{site.phone} · Ilustrativo</small>
          </span>
        </a>
      </section>
    </div>
  );
}
