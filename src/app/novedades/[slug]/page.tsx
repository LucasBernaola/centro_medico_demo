import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { news } from '@/data/news';
import { formatDate } from '@/lib/schedule';
export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  return { title: item?.title || 'Novedades', description: item?.excerpt };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();
  return (
    <article className="section article-page">
      <div className="container article-container">
        <Link className="back-link" href="/#novedades">
          <ArrowLeft size={15} />
          Volver a novedades
        </Link>
        <span className="eyebrow">
          {item.category} · {formatDate(item.date)}
        </span>
        <h1>{item.title}</h1>
        <p className="article-lead">{item.excerpt}</p>
        <div className="article-image">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 767px) 90vw, 800px"
            preload
          />
        </div>
        <div className="article-body">
          {item.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Link href="/turnos" className="button">
          Solicitar un turno
          <ArrowUpRight size={17} />
        </Link>
        <p className="illustration-note">
          Contenido ficticio de demostración. No constituye información médica.
        </p>
      </div>
    </article>
  );
}
