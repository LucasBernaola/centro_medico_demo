'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container error-page">
      <h1>No pudimos cargar esta sección.</h1>
      <p>Intentá nuevamente para continuar tu visita a Nova.</p>
      <button className="button" onClick={reset}>
        Volver a intentar
      </button>
    </div>
  );
}
