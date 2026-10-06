'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useNovaMotion } from '@/components/ui/motion-provider';

const notices = [
  { text: 'Turnos online disponibles las 24 horas', link: 'Solicitar turno', href: '/turnos' },
  {
    text: 'Pediatría · Conocé a la Dra. Julieta Fernández',
    link: 'Ver profesional',
    href: '/profesionales/julieta-fernandez',
  },
  {
    text: '6 especialidades, un mismo compromiso',
    link: 'Ver especialidades',
    href: '/especialidades',
  },
  {
    text: 'Recordá llegar 10 minutos antes de tu consulta',
    link: 'Prepará tu visita',
    href: '/novedades/organiza-tu-visita',
  },
];

export function Announcements() {
  const { reduced, ease } = useNovaMotion();
  const [index, setIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const band = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    if (band.current) observer.observe(band.current);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (focused || !visible || !pageVisible) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % notices.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [focused, visible, pageVisible]);
  const notice = notices[index];
  return (
    <section
      ref={band}
      className="announcement-band"
      aria-label="Avisos de Nova"
      aria-roledescription="carrusel"
      data-announcement-index={index}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="container announcement-inner">
        <div className="announcement-label">
          <Plus size={18} aria-hidden="true" />
          <span>NOVA INFORMA</span>
        </div>
        <div className="announcement-viewport">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={index}
              className="announcement-slide"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${notices.length}`}
              variants={{
                enter: { opacity: 0, x: reduced ? 0 : 20 },
                exit: { opacity: 0, x: reduced ? 0 : -20 },
              }}
              initial="enter"
              animate={{ opacity: 1, x: 0 }}
              exit="exit"
              transition={{ duration: reduced ? 0 : 0.3, ease }}
            >
              <p>{notice.text}</p>
              <Link href={notice.href}>{notice.link}</Link>
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="announcement-count" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(notices.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
