import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Check, Heart, Clock3 } from 'lucide-react';
import { specialties } from '@/data/specialties';
import { HeroCopy, HeroVisual } from './hero-entrance';
export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <HeroCopy>
          <div className="hero-eyebrow">
            <span /> MEDICINA CON UNA MIRADA MÁS HUMANA
          </div>
          <h1>
            Tu salud,
            <br />
            <span>más cerca.</span>
          </h1>
          <p>
            Un equipo que te escucha. Distintas especialidades en un mismo lugar. Y una forma más
            simple de pedir tu turno.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/turnos">
              Solicitar un turno <ArrowUpRight size={19} />
            </Link>
            <Link className="button button-outline hero-secondary" href="#especialidades">
              Conocer especialidades
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-assurance">
            <span>
              <Check size={15} />
              Atención personalizada
            </span>
            <span>
              <Check size={15} />
              Turnos online
            </span>
          </div>
        </HeroCopy>
        <HeroVisual>
          <div className="hero-image-frame">
            <div className="hero-image">
              <Image
                src="/images/hero/consultation.webp"
                alt="Una médica escucha a una paciente en un consultorio luminoso. Escena ficticia e ilustrativa."
                fill
                sizes="(max-width: 767px) 92vw, (max-width: 1280px) 52vw, 680px"
                preload
              />
              <span className="image-caption">EL CUIDADO EMPIEZA CON ESCUCHARTE</span>
            </div>
          </div>
          <div className="hero-online">
            <Clock3 size={17} />
            <span>
              <strong>Turnos online</strong>Disponible las 24 horas
            </span>
          </div>
          <div className="hero-note">
            <span className="hero-note-icon">
              <Heart size={24} strokeWidth={1.6} />
            </span>
            <div>
              <strong>Personas que cuidan personas.</strong>
              <span>{specialties.length} especialidades, un mismo compromiso.</span>
            </div>
          </div>
          <span className="hero-decoration" aria-hidden="true">
            +
          </span>
        </HeroVisual>
      </div>
    </section>
  );
}
