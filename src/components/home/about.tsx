import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
export function AboutSection() {
  return (
    <section className="section about-section" id="nosotros">
      <div className="container about-grid">
        <div className="about-visual">
          <div className="about-image">
            <Image
              src="/images/facilities/reception.webp"
              alt="Recepción ilustrativa de Nova, con madera cálida, plantas y espacios luminosos."
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
          <div className="about-image-label">
            <span className="tiny-cross">+</span>
            <span>
              Un espacio pensado
              <br />
              <strong>para sentirte bien.</strong>
            </span>
          </div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">CONOCÉ CENTRO MÉDICO NOVA</span>
          <h2>
            Buena medicina.
            <br />
            Cercanía de verdad.
          </h2>
          <p>
            Creemos que cuidar también es escuchar, explicar y acompañar. Por eso reunimos a un
            equipo de distintas especialidades que comparte una misma forma de entender la atención.
          </p>
          <p>
            Un centro cómodo, una consulta sin apuros y una experiencia simple desde el primer
            turno.
          </p>
          <ul className="about-values">
            <li>
              <Check size={16} />
              Un equipo que trabaja junto a vos
            </li>
            <li>
              <Check size={16} />
              Espacios modernos y cálidos
            </li>
            <li>
              <Check size={16} />
              Turnos simples, desde donde estés
            </li>
          </ul>
          <Link href="/nosotros" className="text-link">
            Más sobre nuestra forma de cuidar <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
