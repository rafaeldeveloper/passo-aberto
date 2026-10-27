import type { ReactNode } from 'react';

export type TomCard = 'default' | 'brand' | 'sand';

const tons: Record<TomCard, string> = {
  default: 'rounded-card bg-surface p-4 shadow-card ring-1 ring-line',
  brand: 'rounded-card bg-brand p-5 text-on-brand',
  sand: 'rounded-card bg-sand p-4',
};

export function Card({
  titulo,
  acao,
  tom = 'default',
  children,
  className = '',
}: {
  titulo?: ReactNode;
  acao?: ReactNode;
  tom?: TomCard;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${tons[tom]} ${className}`}>
      {(titulo || acao) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {titulo && <h2 className="text-lg font-semibold">{titulo}</h2>}
          {acao && <div className="shrink-0 text-sm font-semibold text-accent-ink">{acao}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
