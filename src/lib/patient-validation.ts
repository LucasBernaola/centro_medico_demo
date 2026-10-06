import type { PatientData } from '@/types';
export type PatientErrors = Partial<Record<keyof PatientData, string>>;
export function validatePatient(data: PatientData): PatientErrors {
  const errors: PatientErrors = {};
  if (data.firstName.trim().length < 2)
    errors.firstName = 'Ingresá tu nombre (al menos 2 caracteres).';
  if (data.lastName.trim().length < 2)
    errors.lastName = 'Ingresá tu apellido (al menos 2 caracteres).';
  if (!/^\d{7,8}$/.test(data.dni.trim()))
    errors.dni = 'Ingresá un DNI válido, de 7 u 8 números, sin puntos.';
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15)
    errors.phone = 'Ingresá un teléfono válido, con código de área.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = 'Ingresá un email válido.';
  return errors;
}
