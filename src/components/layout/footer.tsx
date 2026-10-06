import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Brand } from './brand';
import { navigation, site } from '@/data/site';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
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
            <nav className="footer-links" aria-label="Navegación del pie de página">
              {navigation.map((n) => (
                <Link key={n.label} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3>Estamos para vos</h3>
            <div className="footer-details">
              <span>{site.address}</span>
              <span>{site.phone}</span>
              <span className="footer-email">{site.email}</span>
              <span>{site.shortHours}</span>
            </div>
          </div>
          <div className="footer-booking">
            <h3>Tu próxima consulta</h3>
            <p>Elegí tu profesional y encontrá un horario para vos.</p>
            <Link href="/turnos">
              Solicitar turno <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-disclaimer">
            <p>© 2026 Centro Médico Nova. {site.demoNotice}</p>
            <p className="legal-note">
              No se realizan reservas reales ni se envían comunicaciones. Usá únicamente datos
              ficticios al probar el sitio.
            </p>
          </div>
          <span>
            Demo desarrollada por <strong>Anduril Tech</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
