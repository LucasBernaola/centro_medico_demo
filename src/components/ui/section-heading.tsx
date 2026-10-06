import type { ReactNode } from 'react';
export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="section-heading-detail">
        {text && <p>{text}</p>}
        {action}
      </div>
    </div>
  );
}
