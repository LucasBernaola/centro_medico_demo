import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { news } from '@/data/news';
import { EditorialCarousel } from '@/components/ui/carousel';
import { Reveal } from '@/components/ui/reveal';
export function NewsCarousel() {
  return (
    <section id="novedades" className="section news-section">
      <div className="container">
        <Reveal className="news-intro" direction="right">
          <div className="news-heading">
            <span className="eyebrow">NOVEDADES Y VIDA EN NOVA</span>
            <h2>
              Información
              <br />
              <em>para vos.</em>
            </h2>
          </div>
          <div className="news-intro-detail">
            <p>Conocé lo que pasa en nuestro centro.</p>
            <span className="news-intro-rule" aria-hidden="true">
              +
            </span>
          </div>
        </Reveal>
      </div>
      <Reveal className="news-content container-edge-left" direction="left">
        <EditorialCarousel
          id="news"
          label="Carrusel de novedades"
          labels={news.map((n) => n.title)}
          previousLabel="Novedad anterior"
          nextLabel="Novedad siguiente"
          trackClassName="news-track"
          dots
        >
          {news.map((n, index) => (
            <article className="news-card" key={n.slug}>
              <Link className="news-image" href={`/novedades/${n.slug}`}>
                <Image
                  src={n.image}
                  alt={n.imageAlt}
                  fill
                  style={{
                    objectPosition: n.image.includes('/professionals/') ? '50% 14%' : '50% 50%',
                  }}
                  sizes="(max-width: 599px) 86vw, (max-width: 1023px) 60vw, 46vw"
                />
                <span className="news-image-index" aria-hidden="true">
                  0{index + 1}
                </span>
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
        </EditorialCarousel>
      </Reveal>
    </section>
  );
}
