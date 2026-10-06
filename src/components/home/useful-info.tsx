import { Clock3, ContactRound, CalendarX2, Files } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { FaqAccordion } from './faq';
import { Reveal, RevealGroup } from '@/components/ui/reveal';
const tips = [
  {
    icon: Clock3,
    title: 'Unos minutos para vos',
    text: 'Llegá 10 minutos antes para completar tu recepción con tranquilidad.',
  },
  {
    icon: ContactRound,
    title: 'Tu documentación',
    text: 'Traé tu DNI y la documentación administrativa de tu consulta.',
  },
  {
    icon: CalendarX2,
    title: 'Si no podés venir',
    text: 'Avisá al centro con anticipación para liberar el horario.',
  },
  {
    icon: Files,
    title: 'Prepará tu visita',
    text: 'Consultá previamente qué documentación necesitás llevar.',
  },
];
export function UsefulInfo() {
  return (
    <section className="section useful-section">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="TE ACOMPAÑAMOS DESDE ANTES"
            title="Antes de tu consulta."
            text="Pequeños detalles para una visita más tranquila."
          />
        </Reveal>
        <RevealGroup className="tips-grid">
          {tips.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <span className="tip-number" aria-hidden="true">
                0{index + 1}
              </span>
              <Icon size={25} strokeWidth={1.5} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </RevealGroup>
        <Reveal className="faq-layout">
          <div className="faq-intro">
            <span className="eyebrow">PREGUNTAS FRECUENTES</span>
            <h3>
              Para venir
              <br />
              <em>con tranquilidad.</em>
            </h3>
          </div>
          <FaqAccordion />
        </Reveal>
      </div>
    </section>
  );
}
