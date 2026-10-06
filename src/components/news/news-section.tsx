import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { news } from '@/data/news';
import { Reveal, RevealGroup } from '@/components/ui/reveal';
export function NewsSection() {
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
        <RevealGroup className="news-grid" stagger={0.08}>
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
                  sizes={
                    index === 0 ? '(max-width: 767px) 92vw, 55vw' : '(max-width: 767px) 92vw, 24vw'
                  }
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
        </RevealGroup>
      </div>
    </section>
  );
}
