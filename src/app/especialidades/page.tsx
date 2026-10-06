import { SpecialtiesGrid } from '@/components/specialties/specialties-grid';
import { PageIntro } from '@/components/ui/page-intro';
import { AppointmentCTA } from '@/components/home/appointment-cta';
export const metadata = { title: 'Especialidades médicas' };
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="UNA MIRADA INTEGRAL"
        title="La atención que necesitás."
        text="Seis especialidades para acompañarte. Encontrá tu profesional y reservá tu próxima consulta."
      />
      <SpecialtiesGrid heading={false} />
      <AppointmentCTA />
    </>
  );
}
