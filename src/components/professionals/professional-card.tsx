import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import type { Doctor } from '@/types';
import { specialties } from '@/data/specialties';
import { bookingHref } from '@/lib/schedule';
export function ProfessionalCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="professional-card">
      <Link href={`/profesionales/${doctor.slug}`} className="professional-photo">
        <Image
          src={doctor.image}
          alt={`Retrato ilustrativo de ${doctor.name}, profesional ficticio de Nova.`}
          fill
          sizes="(max-width: 600px) 90vw, (max-width: 1023px) 45vw, 300px"
        />
        <span className="profile-link">
          <ArrowUpRight size={19} />
          <span className="sr-only">Conocer a {doctor.name}</span>
        </span>
      </Link>
      <div className="professional-copy">
        <span>{specialties.find((s) => s.id === doctor.specialtyId)?.name}</span>
        <Link href={`/profesionales/${doctor.slug}`}>
          <h3>{doctor.name}</h3>
        </Link>
        <Link
          href={bookingHref({ specialtyId: doctor.specialtyId, doctorId: doctor.id })}
          className="professional-cta"
        >
          <CalendarDays size={15} />
          Solicitar turno
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
