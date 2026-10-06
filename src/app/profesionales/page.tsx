import { doctors } from '@/data/professionals';
import { ProfessionalCard } from '@/components/professionals/professional-card';
import { PageIntro } from '@/components/ui/page-intro';
import { AppointmentCTA } from '@/components/home/appointment-cta';
export const metadata = { title: 'Nuestro equipo médico' };
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="PERSONAS QUE CUIDAN PERSONAS"
        title="Un equipo cerca tuyo."
        text="Conocé a los profesionales de Nova. Distintas especialidades y una misma forma de acompañarte."
      />
      <section className="section directory-section">
        <div className="container">
          <div className="professionals-grid full-team">
            {doctors.map((d) => (
              <ProfessionalCard key={d.id} doctor={d} />
            ))}
          </div>
          <p className="illustration-note">
            Profesionales ficticios · Fotografías generadas e ilustrativas
          </p>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
