import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Brand } from './brand';
import { navigation, site } from '@/data/site';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand light />
            <p>
              Una atención más cercana.
              <br />
              Un equipo que te acompaña.
            </p>
          </div>
          <div>
            <h3>Conocé Nova</h3>
            {navigation.map((n) => (
              <Link key={n.label} href={n.href}>
                {n.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Estamos para vos</h3>
            <span>{site.address}</span>
            <span>{site.phone}</span>
            <span className="footer-email">{site.email}</span>
            <span>{site.shortHours}</span>
          </div>
          <div className="footer-booking">
            <h3>Tu próxima consulta</h3>
            <p>
              Elegí tu profesional y encontrá
              <br />
              un horario para vos.
            </p>
            <Link href="/turnos">
              Solicitar turno <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Centro Médico Nova. {site.demoNotice}</p>
          <span>
            Demo desarrollada por <strong>Anduril Tech</strong>
          </span>
        </div>
        <p className="legal-note">
          No se realizan reservas reales ni se envían comunicaciones. Usá únicamente datos ficticios
          al probar el sitio.
        </p>
      </div>
    </footer>
  );
}
