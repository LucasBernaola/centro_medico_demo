export interface Specialty {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  areas: string[];
  icon: 'heart' | 'cross' | 'baby' | 'skin' | 'bone' | 'flower';
}
export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialtyId: string;
  image: string;
  introduction: string;
  days: number[];
  start: number;
  end: number;
}
export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  cancelled?: boolean;
}
export interface Exception {
  doctorId: string;
  date: string;
  reason: string;
  start?: number;
  end?: number;
}
export interface PatientData {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
}
export interface Booking {
  specialtyId: string;
  doctorId: string;
  date: string;
  time: string;
}
export interface Reservation extends Booking {
  id: string;
  code: string;
  patient: PatientData;
}
export interface News {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  date: string;
}
