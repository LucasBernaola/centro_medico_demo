import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check } from 'lucide-react';
import { specialties } from '@/data/specialties';
import { doctors } from '@/data/professionals';
import { PageIntro } from '@/components/ui/page-intro';
import { ProfessionalCard } from '@/components/professionals/professional-card';
import { SpecialtyIcon } from '@/components/ui/specialty-icon';
import { bookingHref } from '@/lib/schedule';
export function generateStaticParams() {
  return specialties.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = specialties.find((s) => s.slug === slug);
  return { title: s?.name || 'Especialidad', description: s?.description };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const specialty = specialties.find((s) => s.slug === slug);
  if (!specialty) notFound();
  return (
    <>
      <PageIntro
        eyebrow="NUESTRAS ESPECIALIDADES"
        title={specialty.name}
        text={specialty.summary}
      />
      <section className="section">
        <div className="container specialty-detail-grid">
          <div className="specialty-detail">
            <span className="specialty-icon">
              <SpecialtyIcon type={specialty.icon} size={34} />
            </span>
            <h2>Atención con una mirada cercana.</h2>
            <p>{specialty.description}</p>
            <ul>
              {specialty.areas.map((a) => (
                <li key={a}>
                  <Check size={16} />
                  {a}
                </li>
              ))}
            </ul>
            <Link className="button" href={bookingHref({ specialtyId: specialty.id })}>
              Solicitar turno
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div>
            <span className="eyebrow">EL EQUIPO QUE TE ACOMPAÑA</span>
            <h2>Conocé a tu profesional.</h2>
            <div className="specialty-team">
              {doctors
                .filter((d) => d.specialtyId === specialty.id)
                .map((d) => (
                  <ProfessionalCard key={d.id} doctor={d} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
