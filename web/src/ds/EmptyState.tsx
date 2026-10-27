import type { ReactNode } from 'react';
import { btnFantasma } from './botoes';
import { Icone, type NomeIcone } from './Icone';

export function EmptyState({
  icone,
  titulo,
  children,
  acao,
}: {
  icone?: NomeIcone;
  titulo: ReactNode;
  children?: ReactNode;
  acao?: { rotulo: string; onClick?: () => void; href?: string };
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface/60 px-6 py-8 text-center">
      {icone && (
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-sand text-brand-ink">
          <Icone nome={icone} className="h-5 w-5" />
        </div>
      )}
      <p className="font-semibold">{titulo}</p>
      {children && <div className="mt-1 text-sm text-ink-3">{children}</div>}
      {acao &&
        (acao.href ? (
          <a href={acao.href} className={`${btnFantasma} mt-3`}>
            {acao.rotulo}
          </a>
        ) : (
          <button type="button" onClick={acao.onClick} className={`${btnFantasma} mt-3`}>
            {acao.rotulo}
          </button>
        ))}
    </div>
  );
}
