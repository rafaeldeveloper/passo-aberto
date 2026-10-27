import type { ReactNode } from 'react';

export const campoCls =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
export const primarioCls =
  'w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white active:bg-indigo-700 disabled:opacity-50';
export const secundarioCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 active:bg-slate-50';

export function Bloco({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</section>;
}

export function Chip({ children, cor = 'bg-slate-100 text-slate-700' }: { children: ReactNode; cor?: string }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${cor}`}>{children}</span>;
}

export function Chips({ itens, cor }: { itens: string[]; cor?: string }) {
  if (!itens.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {itens.map((c) => (
        <Chip key={c} cor={cor}>
          {c}
        </Chip>
      ))}
    </div>
  );
}

export function Rotulo({ texto, children }: { texto: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600">{texto}</span>
      {children}
    </label>
  );
}

export function Vazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center">
      <p className="font-semibold text-slate-700">{titulo}</p>
      {children && <p className="mt-1 text-sm text-slate-500">{children}</p>}
    </div>
  );
}

export const dataCurta = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '');
