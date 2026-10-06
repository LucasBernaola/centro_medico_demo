import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { ProfessionalCard } from './professional-card';
import { SectionHeading } from '@/components/ui/section-heading';
export function ProfessionalsGrid() {
  return (
    <section id="profesionales" className="section professionals-section">
      <div className="container">
        <SectionHeading
          eyebrow="PERSONAS QUE CUIDAN PERSONAS"
          title="Conocé a tu equipo médico."
          text="Profesionales con una mirada cercana y un compromiso compartido."
          action={
            <Link href="/profesionales" className="text-link">
              Ver todo el equipo <ArrowUpRight size={17} />
            </Link>
          }
        />
        <div className="professionals-grid">
          {doctors.slice(0, 4).map((d) => (
            <ProfessionalCard doctor={d} key={d.id} />
          ))}
        </div>
        <p className="illustration-note">
          Profesionales ficticios · Fotografías generadas e ilustrativas
        </p>
      </div>
    </section>
  );
}
