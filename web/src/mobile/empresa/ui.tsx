import type { ReactNode } from 'react';
import { btnPrimario, btnSecundario, campo } from '../../ds';

export const campoCls = campo;
export const primarioCls = btnPrimario;
export const secundarioCls = `${btnSecundario} w-full`;

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-2">{children}</span>;
}

export function Etiquetas({ itens }: { itens: string[] }) {
  if (!itens.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {itens.map((c) => (
        <Etiqueta key={c}>{c}</Etiqueta>
      ))}
    </div>
  );
}

export function Rotulo({ texto, children }: { texto: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-2">{texto}</span>
      {children}
    </label>
  );
}

export function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{titulo}</legend>
      {children}
    </fieldset>
  );
}

export const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

export const dataCurta = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '');
