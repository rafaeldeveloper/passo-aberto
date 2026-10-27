import type { ReactNode } from 'react';
import { Icone } from './Icone';

export type ItemChecklist = { texto: ReactNode; feito: boolean; onClick?: () => void };

export function Checklist({ titulo, itens }: { titulo?: ReactNode; itens: ItemChecklist[] }) {
  const feitos = itens.filter((i) => i.feito).length;
  return (
    <div>
      {titulo && <h3 className="text-lg font-semibold">{titulo}</h3>}
      <div className="mt-2 flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {itens.map((i, n) => (
            <span key={n} className={`h-1.5 flex-1 rounded-full ${i.feito ? 'bg-brand' : 'bg-line'}`} />
          ))}
        </div>
        <span className="text-xs font-semibold text-ink-3 tabular-nums">
          {feitos} de {itens.length}
        </span>
      </div>
      <ul className="mt-2 -mx-2">
        {itens.map((i, n) => {
          const conteudo = (
            <>
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${i.feito ? 'bg-brand text-on-brand' : 'ring-2 ring-line-strong'}`}
              >
                {i.feito && <Icone nome="check" className="h-4 w-4" />}
              </span>
              <span className={`flex-1 ${i.feito ? 'text-ink-3' : ''}`}>{i.texto}</span>
              {i.onClick && !i.feito && <Icone nome="seta" className="h-4 w-4 text-ink-3" />}
            </>
          );
          return (
            <li key={n}>
              {i.onClick ? (
                <button type="button" onClick={i.onClick} className="flex min-h-12 w-full items-center gap-3 rounded-md px-2 text-left active:bg-surface-2">
                  {conteudo}
                </button>
              ) : (
                <div className="flex min-h-12 items-center gap-3 rounded-md px-2">{conteudo}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
