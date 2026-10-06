import { AppointmentFlow } from '@/features/appointment-flow';
import { doctors } from '@/data/professionals';
import { specialties } from '@/data/specialties';
export const metadata = {
  title: 'Solicitá tu turno online',
  description:
    'Elegí tu especialidad, profesional, día y horario. Solicitud de turnos online en Centro Médico Nova.',
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const doctor = doctors.find((d) => d.id === params.profesional);
  const specialtyId =
    doctor?.specialtyId || specialties.find((s) => s.id === params.especialidad)?.id;
  const preset = { specialtyId, doctorId: doctor?.id };
  return (
    <AppointmentFlow key={`${preset.specialtyId || ''}-${preset.doctorId || ''}`} preset={preset} />
  );
}
