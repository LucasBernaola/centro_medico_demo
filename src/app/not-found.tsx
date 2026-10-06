import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container error-page">
      <h1>Esta página no está disponible.</h1>
      <Link className="button" href="/">
        Volver al inicio
      </Link>
    </div>
  );
}
