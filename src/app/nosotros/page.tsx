import { PageIntro } from '@/components/ui/page-intro';
import { AboutSection } from '@/components/home/about';
import { ProfessionalsGrid } from '@/components/professionals/professionals-grid';
import { AppointmentCTA } from '@/components/home/appointment-cta';
export const metadata = { title: 'Nuestra forma de cuidar' };
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="SOMOS CENTRO MÉDICO NOVA"
        title="Cuidar es estar cerca."
        text="Imaginamos un centro donde la atención profesional y el trato humano van de la mano."
      />
      <AboutSection />
      <ProfessionalsGrid />
      <AppointmentCTA />
    </>
  );
}
