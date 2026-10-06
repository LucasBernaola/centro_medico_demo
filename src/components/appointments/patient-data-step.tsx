'use client';
import type { PatientData } from '@/types';
import type { PatientErrors } from '@/lib/patient-validation';
const fields: {
  name: keyof PatientData;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
  inputMode?: 'numeric' | 'tel' | 'email';
}[] = [
  {
    name: 'firstName',
    label: 'Nombre',
    placeholder: 'Ej.: Laura',
    type: 'text',
    autoComplete: 'given-name',
  },
  {
    name: 'lastName',
    label: 'Apellido',
    placeholder: 'Ej.: Gómez',
    type: 'text',
    autoComplete: 'family-name',
  },
  {
    name: 'dni',
    label: 'DNI',
    placeholder: 'Sin puntos ni espacios',
    type: 'text',
    autoComplete: 'off',
    inputMode: 'numeric',
  },
  {
    name: 'phone',
    label: 'Teléfono',
    placeholder: 'Ej.: 11 4000-0000',
    type: 'tel',
    autoComplete: 'tel',
    inputMode: 'tel',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Ej.: laura@example.com',
    type: 'email',
    autoComplete: 'email',
    inputMode: 'email',
  },
];
export function PatientDataStep({
  value,
  onChange,
  errors,
}: {
  value: PatientData;
  onChange: (value: PatientData) => void;
  errors: PatientErrors;
}) {
  return (
    <div className="patient-form">
      <p className="demo-form-note">Estás probando una demo. Ingresá únicamente datos ficticios.</p>
      <div className="patient-fields">
        {fields.map((field) => (
          <div
            className={`form-field ${field.name === 'email' ? 'field-wide' : ''}`}
            key={field.name}
          >
            <label htmlFor={`patient-${field.name}`}>
              {field.label}
              <span aria-hidden="true">*</span>
            </label>
            <input
              id={`patient-${field.name}`}
              name={field.name}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              value={value[field.name]}
              maxLength={field.name === 'dni' ? 8 : field.name === 'phone' ? 24 : 100}
              required
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
              onChange={(e) => onChange({ ...value, [field.name]: e.target.value })}
            />
            {errors[field.name] && (
              <span className="field-error" id={`error-${field.name}`}>
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="form-caption">
        No te pedimos información médica. Los campos marcados con * son obligatorios.
      </p>
    </div>
  );
}
