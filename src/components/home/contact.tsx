import { MapPin, Phone, Mail, Clock3, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { site } from '@/data/site';
export function ContactSection() {
  return (
    <section id="contacto" className="section contact-section">
      <div className="container contact-grid">
        <div>
          <span className="eyebrow">UN LUGAR PARA ENCONTRARNOS</span>
          <h2>
            Estamos cerca.
            <br />
            Estamos para vos.
          </h2>
          <p className="contact-intro">Encontrá toda la información para tu próxima visita.</p>
          <div className="contact-details">
            <div>
              <MapPin size={22} />
              <span>
                <small>DIRECCIÓN</small>
                <strong>{site.address}</strong>
                <span>{site.city}</span>
              </span>
            </div>
            <div>
              <Phone size={21} />
              <span>
                <small>TELÉFONO ILUSTRATIVO</small>
                <strong>{site.phone}</strong>
              </span>
            </div>
            <div>
              <Mail size={21} />
              <span>
                <small>EMAIL ILUSTRATIVO</small>
                <strong>{site.email}</strong>
              </span>
            </div>
            <div>
              <Clock3 size={21} />
              <span>
                <small>HORARIO DE ATENCIÓN</small>
                <strong>{site.hours}</strong>
              </span>
            </div>
          </div>
          <Link href="/turnos" className="text-link">
            Organizá tu próxima consulta
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div
          className="illustrative-map"
          role="img"
          aria-label="Plano ilustrativo de la ubicación ficticia de Centro Médico Nova. No representa una dirección real."
        >
          <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="600" height="480" fill="#edf1ec" />
            <g fill="#e0e7df">
              <rect x="30" y="20" width="150" height="105" rx="9" />
              <rect x="215" y="20" width="125" height="105" rx="9" />
              <rect x="400" y="20" width="180" height="105" rx="9" />
              <rect x="30" y="163" width="150" height="115" rx="9" />
              <rect x="215" y="163" width="125" height="115" rx="9" />
              <rect x="400" y="163" width="180" height="115" rx="9" />
              <rect x="30" y="323" width="150" height="135" rx="9" />
              <rect x="215" y="323" width="125" height="135" rx="9" />
              <rect x="400" y="323" width="180" height="135" rx="9" />
            </g>
            <path d="M365 0v480M0 300h600" stroke="#fff" strokeWidth="34" />
            <path d="M0 142h600M197 0v480" stroke="#fafcf8" strokeWidth="16" />
            <path d="M0 300h600" stroke="#bfcfc4" strokeWidth="1" strokeDasharray="5 8" />
            <rect x="440" y="183" width="100" height="70" rx="35" fill="#cbdac8" />
            <g fill="#bcd0b8">
              <circle cx="460" cy="212" r="16" />
              <circle cx="488" cy="220" r="21" />
              <circle cx="520" cy="206" r="14" />
            </g>
            <text
              x="350"
              y="432"
              transform="rotate(-90 350 432)"
              fill="#9caca2"
              fontSize="11"
              letterSpacing="3"
            >
              AVENIDA CENTRAL
            </text>
          </svg>
          <div className="map-pin">
            <MapPin size={32} fill="currentColor" stroke="white" />
            <span>
              <strong>nova.</strong>Centro Médico
            </span>
          </div>
          <div className="map-caption">
            <MapPin size={15} />
            Ubicación ficticia · Plano ilustrativo
          </div>
        </div>
      </div>
    </section>
  );
}
