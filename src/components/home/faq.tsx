'use client';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
const questions = [
  {
    question: '¿Cómo solicito un turno?',
    answer:
      'Ingresá en “Solicitar turno”, completá tus datos ficticios y elegí especialidad, profesional, día y horario. Al finalizar vas a ver una confirmación de demostración.',
  },
  {
    question: '¿Puedo elegir a mi profesional?',
    answer:
      'Sí. Podés solicitar el turno desde su ficha y continuar con ese profesional preseleccionado. También podés elegirlo dentro del proceso de reserva.',
  },
  {
    question: '¿La reserva de esta web es real?',
    answer:
      'No. Nova es una institución ficticia y esta web es una demo. No se envían correos ni mensajes. Usá únicamente datos ficticios.',
  },
  {
    question: '¿Cómo cambio o cancelo un turno?',
    answer:
      'En un centro real, deberías comunicarte con recepción. Esta demo no realiza cancelaciones ni comunicaciones reales.',
  },
];
export function FaqAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="faq-grid">
      {questions.map((q, index) => (
        <Accordion.Item value={`question-${index}`} className="faq-item" key={q.question}>
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              <span className="faq-index" aria-hidden="true">
                0{index + 1}
              </span>
              <span>{q.question}</span>
              <Plus size={19} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="faq-content">
            <p>{q.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
