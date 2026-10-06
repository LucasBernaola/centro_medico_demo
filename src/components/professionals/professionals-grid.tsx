import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { ProfessionalCard } from './professional-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal, RevealGroup } from '@/components/ui/reveal';
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
        <RevealGroup className="professionals-grid" stagger={0.08}>
          {doctors.map((d) => (
            <ProfessionalCard doctor={d} key={d.id} />
          ))}
        </RevealGroup>
        <p className="illustration-note">
          Profesionales ficticios · Fotografías generadas e ilustrativas
        </p>
      </div>
    </section>
  );
}
