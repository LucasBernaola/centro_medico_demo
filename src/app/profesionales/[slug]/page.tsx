import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import { doctors } from '@/data/professionals';
import { specialties } from '@/data/specialties';
import { weekdays } from '@/data/site';
import { bookingHref } from '@/lib/schedule';
export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = doctors.find((d) => d.slug === slug);
  return { title: d?.name || 'Profesional' };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) notFound();
  const specialty = specialties.find((s) => s.id === doctor.specialtyId)!;
  return (
    <section className="section profile-page">
      <div className="container">
        <Link className="back-link" href="/profesionales">
          <ArrowLeft size={15} />
          Ver todo el equipo
        </Link>
        <div className="profile-grid">
          <div className="profile-photo">
            <Image
              src={doctor.image}
              alt={`Retrato ilustrativo de ${doctor.name}`}
              fill
              sizes="(max-width: 767px) 90vw, 440px"
              preload
            />
          </div>
          <div className="profile-copy">
            <span className="eyebrow">{specialty.name}</span>
            <h1>{doctor.name}</h1>
            <p className="profile-quote">“{doctor.introduction}”</p>
            <h2>Un espacio de atención para vos</h2>
            <p>{specialty.description}</p>
            <div className="profile-hours">
              <div>
                <CalendarDays size={20} />
                <span>{doctor.days.map((d) => weekdays[d]).join(' · ')}</span>
              </div>
              <div>
                <Clock3 size={20} />
                <span>
                  {String(doctor.start).padStart(2, '0')}:00 a {doctor.end}:00 · Consultas de 30
                  minutos
                </span>
              </div>
            </div>
            <Link
              className="button"
              href={bookingHref({ specialtyId: specialty.id, doctorId: doctor.id })}
            >
              Solicitar turno con{' '}
              {doctor.name.replace('Dra. ', '').replace('Dr. ', '').split(' ')[0]}
              <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" href={`/especialidades/${specialty.slug}`}>
              Conocer más sobre {specialty.name}
              <ArrowUpRight size={16} />
            </Link>
            <p className="illustration-note">
              Presentación y fotografía ficticias e ilustrativas. Sin matrícula real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
