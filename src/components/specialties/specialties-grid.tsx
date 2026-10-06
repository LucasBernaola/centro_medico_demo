import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { specialties } from '@/data/specialties';
import { SpecialtyIcon } from '@/components/ui/specialty-icon';
import { SectionHeading } from '@/components/ui/section-heading';
import { bookingHref } from '@/lib/schedule';
export function SpecialtiesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section id="especialidades" className="section specialties-section">
      <div className="container">
        {heading && (
          <SectionHeading
            eyebrow="DISTINTAS ESPECIALIDADES. UN MISMO CUIDADO."
            title={
              <>
                La atención que necesitás,
                <br />
                en un mismo lugar.
              </>
            }
            text="Elegí tu especialidad. Nosotros te acompañamos en el siguiente paso."
            action={
              <Link href="/especialidades" className="text-link">
                Conocer todas
                <ArrowUpRight size={17} />
              </Link>
            }
          />
        )}
        <div className="specialties-grid">
          {specialties.map((s, index) => (
            <article className="specialty-card" key={s.id}>
              <div className="specialty-card-top">
                <span className="specialty-icon">
                  <SpecialtyIcon type={s.icon} />
                </span>
                <span className="specialty-index">0{index + 1}</span>
              </div>
              <Link href={`/especialidades/${s.slug}`} className="specialty-title">
                <h3>{s.name}</h3>
                <ArrowUpRight size={19} />
              </Link>
              <p>{s.summary}</p>
              <div className="specialty-links">
                <Link href={`/especialidades/${s.slug}`} className="text-link">
                  Ver profesionales
                  <ArrowRight size={15} />
                </Link>
                <Link
                  className="specialty-book"
                  href={bookingHref({ specialtyId: s.id })}
                  aria-label={`Solicitar turno en ${s.name}`}
                >
                  <CalendarIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="16" height="15" rx="3" />
      <path d="M8 3v6m8-6v6M4 11h16m-8 3v4m-2-2h4" />
    </svg>
  );
}
