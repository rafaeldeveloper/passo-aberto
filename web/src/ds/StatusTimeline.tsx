import type { ReactNode } from 'react';
import { mailtoAjuda } from '../config';
import { btnFantasma } from './botoes';
import { Icone } from './Icone';

export type PassoTimeline = { rotulo: ReactNode; quem?: ReactNode };

type Estado = 'feito' | 'atual' | 'pendente' | 'sucesso';

function estados(total: number, atual: number, encerrado?: 'sucesso' | 'neutro'): Estado[] {
  return Array.from({ length: total }, (_, n) => {
    if (encerrado === 'sucesso') return n === total - 1 ? 'sucesso' : 'feito';
    if (encerrado === 'neutro') return n < atual ? 'feito' : 'pendente';
    return n < atual ? 'feito' : n === atual ? 'atual' : 'pendente';
  });
}

function Ponto({ estado, pequeno }: { estado: Estado; pequeno?: boolean }) {
  const tam = pequeno ? 'h-4 w-4' : 'h-6 w-6';
  if (estado === 'feito' || estado === 'sucesso')
    return (
      <span className={`grid ${tam} shrink-0 place-items-center rounded-full text-on-brand ${estado === 'sucesso' ? 'bg-success' : 'bg-brand'}`}>
        <Icone nome="check" className={pequeno ? 'h-3 w-3' : 'h-4 w-4'} />
      </span>
    );
  if (estado === 'atual')
    return (
      <span className={`grid ${tam} shrink-0 place-items-center rounded-full bg-surface ring-2 ring-accent`}>
        <span className={`${pequeno ? 'h-1.5 w-1.5' : 'h-2 w-2'} rounded-full bg-accent`} />
      </span>
    );
  return <span className={`${tam} shrink-0 rounded-full bg-surface ring-2 ring-line`} />;
}

export function StatusTimeline({
  passos,
  atual,
  encerrado,
  compacto,
  pedirAjuda,
}: {
  passos: PassoTimeline[];
  atual: number;
  encerrado?: 'sucesso' | 'neutro';
  compacto?: boolean;
  pedirAjuda?: () => void;
}) {
  const lista = estados(passos.length, atual, encerrado);
  const acaoAjuda = pedirAjuda ? (
    <button type="button" onClick={pedirAjuda} className={`${btnFantasma} -ml-3`}>
      Pedir ajuda para a próxima
    </button>
  ) : (
    <a href={mailtoAjuda('Pedir ajuda para a próxima oportunidade')} className={`${btnFantasma} -ml-3`}>
      Pedir ajuda para a próxima
    </a>
  );

  if (compacto) {
    const indice = encerrado === 'sucesso' ? passos.length - 1 : Math.min(atual, passos.length - 1);
    const passo = passos[indice];
    return (
      <div>
        <div className="flex items-center" aria-hidden="true">
          {lista.map((e, n) => (
            <div key={n} className={`flex items-center ${n < lista.length - 1 ? 'flex-1' : ''}`}>
              <Ponto estado={e} pequeno />
              {n < lista.length - 1 && <span className={`mx-1 h-0.5 flex-1 rounded-full ${lista[n + 1] === 'pendente' ? 'bg-line' : 'bg-brand'}`} />}
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold">{encerrado === 'neutro' ? 'Não foi dessa vez' : passo?.rotulo}</p>
        {!encerrado && passo?.quem && <p className="text-xs text-ink-3">{passo.quem}</p>}
      </div>
    );
  }

  return (
    <ol>
      {passos.map((p, n) => {
        const e = lista[n];
        const ultimo = n === passos.length - 1 && encerrado !== 'neutro';
        return (
          <li key={n} className={`relative pl-8 ${ultimo ? '' : 'pb-4'}`}>
            {!ultimo && (
              <span className={`absolute top-6 bottom-0 left-[11px] w-0.5 ${e === 'feito' && lista[n + 1] !== 'pendente' ? 'bg-brand' : 'bg-line'}`} />
            )}
            <span className="absolute top-0.5 left-0">
              <Ponto estado={e} />
            </span>
            <p className={`text-sm ${e === 'pendente' ? 'text-ink-3' : 'font-semibold'}`}>{p.rotulo}</p>
            {e === 'atual' && p.quem && <p className="text-xs text-ink-3">{p.quem}</p>}
          </li>
        );
      })}
      {encerrado === 'neutro' && (
        <li className="relative pl-8">
          <span className="absolute top-0.5 left-0 grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-ink-3">
            <Icone nome="x" className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm font-semibold text-ink-2">Não foi dessa vez</p>
          {acaoAjuda}
        </li>
      )}
    </ol>
  );
}
