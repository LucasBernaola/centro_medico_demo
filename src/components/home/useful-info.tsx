import { Clock3, ContactRound, CalendarX2, Files, ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
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
        <SectionHeading
          eyebrow="TE ACOMPAÑAMOS DESDE ANTES"
          title="Antes de tu consulta."
          text="Pequeños detalles para una visita más tranquila."
        />
        <div className="tips-grid">
          {tips.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={25} strokeWidth={1.5} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="faq-grid">
          <details>
            <summary>
              ¿Cómo solicito un turno?
              <ChevronDown size={18} />
            </summary>
            <p>
              Ingresá en “Solicitar turno”, completá tus datos ficticios y elegí especialidad,
              profesional, día y horario. Al finalizar vas a ver una confirmación de demostración.
            </p>
          </details>
          <details>
            <summary>
              ¿Puedo elegir a mi profesional?
              <ChevronDown size={18} />
            </summary>
            <p>
              Sí. Podés solicitar el turno desde su ficha y continuar con ese profesional
              preseleccionado. También podés elegirlo dentro del proceso de reserva.
            </p>
          </details>
          <details>
            <summary>
              ¿La reserva de esta web es real?
              <ChevronDown size={18} />
            </summary>
            <p>
              No. Nova es una institución ficticia y esta web es una demo. No se envían correos ni
              mensajes. Usá únicamente datos ficticios.
            </p>
          </details>
          <details>
            <summary>
              ¿Cómo cambio o cancelo un turno?
              <ChevronDown size={18} />
            </summary>
            <p>
              En un centro real, deberías comunicarte con recepción. Esta demo no realiza
              cancelaciones ni comunicaciones reales.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
