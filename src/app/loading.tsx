export default function Loading() {
  return (
    <div className="container loading-page" role="status" aria-label="Cargando página">
      <div className="skeleton skeleton-heading" />
      <div className="skeleton" />
      <span className="sr-only">Cargando información de Nova.</span>
    </div>
  );
}
