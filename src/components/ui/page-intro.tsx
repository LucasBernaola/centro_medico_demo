import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} />
          Volver a Nova
        </Link>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
