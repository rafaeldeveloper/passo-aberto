import type { ReactNode } from 'react';

export const campoCls =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none';
export const botaoCls =
  'w-full rounded-2xl bg-teal-600 px-4 py-3.5 text-base font-semibold text-white shadow-sm active:bg-teal-700 disabled:opacity-50';
export const botaoLeveCls = 'rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 active:bg-teal-100';

export const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const dataCurta = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

export const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export function Bloco({ titulo, acao, children, className = '' }: { titulo?: ReactNode; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 ${className}`}>
      {(titulo || acao) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {titulo && <h2 className="text-base font-semibold text-slate-800">{titulo}</h2>}
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

export function Pilula({ children, cor = 'bg-slate-100 text-slate-700' }: { children: ReactNode; cor?: string }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${cor}`}>{children}</span>;
}

export function Vazio({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">{children}</p>;
}

export function Progresso({ atual, total }: { atual: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((atual / total) * 100)) : 0;
  return (
    <div>
      <div className="h-3 overflow-hidden rounded-full bg-teal-100">
        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-sm text-slate-600">
        <strong className="text-slate-800">{atual}h</strong> de {total}h cumpridas ({pct}%)
      </p>
    </div>
  );
}

export function DataEvento({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-sky-50 text-sky-800">
      <span className="text-lg leading-none font-bold">{d.getDate()}</span>
      <span className="text-[11px] font-medium uppercase">{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
    </div>
  );
}

export function Folha({ titulo, aberta, fechar, children }: { titulo: string; aberta: boolean; fechar: () => void; children: ReactNode }) {
  if (!aberta) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button aria-label="Fechar" className="absolute inset-0 bg-slate-900/40" onClick={fechar} />
      <div className="relative w-full max-w-md rounded-t-3xl bg-white px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>
          <button onClick={fechar} className="text-sm font-medium text-slate-500">
            Cancelar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const caminhos: Record<string, string> = {
  inicio: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  ficha: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  eventos: 'M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  carreiras: 'M12 3 2 8l10 5 10-5zM6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5',
  oportunidades: 'M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-11 0h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm-1 6h18',
  check: 'M5 12.5 10 17l9-10',
  mais: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6 6 18',
  seta: 'M9 6l6 6-6 6',
  voltar: 'M15 6l-6 6 6 6',
  busca: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm5-2 4 4',
};

export function Icone({ nome, className = 'h-6 w-6' }: { nome: keyof typeof caminhos; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={caminhos[nome]} />
    </svg>
  );
}
