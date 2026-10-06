'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { news } from '@/data/news';
import { SectionHeading } from '@/components/ui/section-heading';
export function NewsCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function move(delta: number) {
    const element = track.current;
    if (!element) return;
    const card = element.children[0] as HTMLElement;
    element.scrollBy({
      left: delta * (card.offsetWidth + 24),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
  return (
    <section id="novedades" className="section news-section">
      <div className="container">
        <SectionHeading
          eyebrow="NOVEDADES Y VIDA EN NOVA"
          title="Información para vos."
          text="Conocé lo que pasa en nuestro centro."
          action={
            <div className="carousel-controls">
              <button
                className="icon-button"
                aria-label="Novedad anterior"
                disabled={active === 0}
                onClick={() => move(-1)}
              >
                <ArrowLeft size={19} />
              </button>
              <button
                className="icon-button"
                aria-label="Novedad siguiente"
                disabled={active === news.length - 1}
                onClick={() => move(1)}
              >
                <ArrowRight size={19} />
              </button>
            </div>
          }
        />
        <div
          className="news-track"
          ref={track}
          aria-label="Carrusel de novedades"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              move(e.key === 'ArrowRight' ? 1 : -1);
            }
          }}
          onScroll={() => {
            const el = track.current;
            if (el) {
              const width = (el.children[0] as HTMLElement).offsetWidth + 24;
              setActive(Math.min(news.length - 1, Math.round(el.scrollLeft / width)));
            }
          }}
        >
          {news.map((n) => (
            <article className="news-card" key={n.slug}>
              <Link className="news-image" href={`/novedades/${n.slug}`}>
                <Image
                  src={n.image}
                  alt={n.imageAlt}
                  fill
                  style={{
                    objectPosition: n.image.includes('/professionals/') ? '50% 18%' : '50% 50%',
                  }}
                  sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 390px"
                />
              </Link>
              <div className="news-copy">
                <span className="eyebrow">{n.category}</span>
                <Link href={`/novedades/${n.slug}`}>
                  <h3>{n.title}</h3>
                </Link>
                <p>{n.excerpt}</p>
                <Link href={`/novedades/${n.slug}`} className="text-link">
                  Leer novedad
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="carousel-dots" aria-label="Posición del carrusel">
          {news.map((n, i) => (
            <button
              key={n.slug}
              aria-label={`Ver novedad ${i + 1}: ${n.title}`}
              aria-current={active === i ? 'true' : undefined}
              onClick={() => {
                const el = track.current;
                if (el)
                  el.scrollTo({
                    left: i * ((el.children[0] as HTMLElement).offsetWidth + 24),
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                      ? 'instant'
                      : 'smooth',
                  });
              }}
            >
              <span className={active === i ? 'active' : ''} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
