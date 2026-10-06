'use client';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { specialties } from '@/data/specialties';
import { doctors } from '@/data/professionals';
import { weekdays } from '@/data/site';
import { SpecialtyIcon } from '@/components/ui/specialty-icon';
export function SpecialtyStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="selection-grid">
      <legend className="sr-only">Especialidad</legend>
      {specialties.map((s) => (
        <label className={`selection-card ${value === s.id ? 'selected' : ''}`} key={s.id}>
          <input
            type="radio"
            name="specialty"
            value={s.id}
            checked={value === s.id}
            onChange={() => onChange(s.id)}
          />
          <span className="selection-icon">
            <SpecialtyIcon type={s.icon} size={25} />
          </span>
          <strong>{s.name}</strong>
          <span>{s.summary}</span>
          <i className="selection-check">{value === s.id && <Check size={13} />}</i>
        </label>
      ))}
    </fieldset>
  );
}
export function ProfessionalStep({
  specialtyId,
  value,
  onChange,
}: {
  specialtyId: string;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="professional-options">
      <legend className="sr-only">Profesional</legend>
      {doctors
        .filter((d) => d.specialtyId === specialtyId)
        .map((d) => (
          <label className={`professional-option ${value === d.id ? 'selected' : ''}`} key={d.id}>
            <input
              type="radio"
              name="professional"
              value={d.id}
              checked={value === d.id}
              onChange={() => onChange(d.id)}
            />
            <div className="option-photo">
              <Image src={d.image} alt={`Retrato ilustrativo de ${d.name}`} fill sizes="80px" />
            </div>
            <div>
              <strong>{d.name}</strong>
              <span>{specialties.find((s) => s.id === d.specialtyId)?.name}</span>
              <small>Atiende {d.days.map((day) => weekdays[day]).join(' · ')}</small>
              <small>
                {String(d.start).padStart(2, '0')}:00 a {d.end}:00
              </small>
            </div>
            <i className="selection-check">{value === d.id && <Check size={13} />}</i>
          </label>
        ))}
    </fieldset>
  );
}
