import { useState } from 'react';
import { COORDENACAO } from '../config';
import { BottomSheet } from './BottomSheet';
import { Icone } from './Icone';
import { Logo } from './Logo';

export type Origem = 'PARCEIRA' | 'EXTERNA';

const dataBr = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

export function SourceBadge({ origem, fonte, consultadaEm }: { origem: Origem; fonte?: string; consultadaEm?: string }) {
  const [aberta, setAberta] = useState(false);
  const parceira = origem === 'PARCEIRA';
  const detalhe = [fonte, consultadaEm && `consultada em ${dataBr(consultadaEm)}`].filter(Boolean).join(' · ');
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAberta(true);
        }}
        className={
          parceira
            ? 'inline-flex max-w-full items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-on-brand'
            : 'inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-ink-3 ring-1 ring-line-strong'
        }
      >
        {parceira ? (
          <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0" aria-hidden="true">
            <path d="M8 56V24A16 16 0 0 1 24 8h30" stroke="currentColor" strokeWidth={10} />
            <path d="M27 56V39a12 12 0 0 1 12-12h15" className="stroke-terracotta-300" strokeWidth={10} />
          </svg>
        ) : (
          <Icone nome="externo" className="h-3 w-3 shrink-0" />
        )}
        <span className="truncate">{parceira ? 'Parceira do Passo Aberto' : `Fonte externa${detalhe ? ` · ${detalhe}` : ''}`}</span>
      </button>
      <BottomSheet titulo="O que isso significa" aberta={aberta} fechar={() => setAberta(false)}>
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-sand text-brand-ink">
            {parceira ? <Logo className="h-5 w-5" /> : <Icone nome="externo" className="h-5 w-5" />}
          </div>
          <div className="space-y-2 text-sm text-ink-2">
            <p className="text-base font-semibold text-ink">{parceira ? 'Parceira do Passo Aberto' : 'Fonte externa'}</p>
            {parceira ? (
              <p>Oportunidade direta: apresentada pela própria empresa ao projeto e revisada por {COORDENACAO}.</p>
            ) : (
              <p>Encontrada em fonte pública; não significa que a empresa seja parceira do projeto.</p>
            )}
            {!parceira && detalhe && <p className="text-ink-3">{detalhe.charAt(0).toUpperCase() + detalhe.slice(1)}</p>}
            <p className="text-ink-3">O selo não indica que a oportunidade é melhor para você. Na dúvida, peça ajuda a {COORDENACAO}.</p>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
