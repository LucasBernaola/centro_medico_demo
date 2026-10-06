import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { ProfessionalCard } from './professional-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { EditorialCarousel } from '@/components/ui/carousel';
import { Reveal } from '@/components/ui/reveal';
export function ProfessionalsGrid() {
  return (
    <section id="profesionales" className="section professionals-section">
      <div className="container">
        <Reveal direction="left">
          <SectionHeading
            eyebrow="PERSONAS QUE CUIDAN PERSONAS"
            title={
              <>
                Conocé a tu <br />
                <em>equipo médico.</em>
              </>
            }
            text="Profesionales con una mirada cercana y un compromiso compartido."
            action={
              <Link href="/profesionales" className="text-link">
                Ver todo el equipo <ArrowUpRight size={17} />
              </Link>
            }
          />
        </Reveal>
      </div>
      <Reveal className="container-edge-right professionals-content" direction="right">
        <EditorialCarousel
          id="professionals"
          label="Equipo médico de Nova"
          labels={doctors.map((d) => d.name)}
          previousLabel="Profesional anterior"
          nextLabel="Profesional siguiente"
        >
          {doctors.map((d) => (
            <ProfessionalCard doctor={d} key={d.id} />
          ))}
        </EditorialCarousel>
      </Reveal>
      <div className="container">
        <p className="illustration-note">
          Profesionales ficticios · Fotografías generadas e ilustrativas
        </p>
      </div>
    </section>
  );
}
