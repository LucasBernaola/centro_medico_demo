import Link from 'next/link';
import type { MouseEventHandler } from 'react';
export function Brand({
  light = false,
  onClick,
}: {
  light?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`brand ${light ? 'brand-light' : ''}`}
      aria-label="Centro Médico Nova · Inicio"
    >
      <svg className="brand-symbol" viewBox="0 0 36 36" aria-hidden="true">
        <path d="M18 3v30M3 18h30" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
        <path
          d="M18 9v18M9 18h18"
          stroke="var(--brand-cutout,white)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="brand-word">
        nova<span>.</span>
      </span>
      <span className="brand-description">
        CENTRO
        <br />
        MÉDICO
      </span>
    </Link>
  );
}
