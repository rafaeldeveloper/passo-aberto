import type { FormEvent, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useApi } from './api';
import { Badge, EmptyState, SourceBadge as DsSourceBadge, type TomBadge } from './ds';
import type { Empresa, Escola, Situacao } from './tipos';
import { SITUACOES } from './tipos';

export { Badge, Logo } from './ds';

export const EscolaContext = createContext<Escola | undefined>(undefined);
export const useEscola = () => useContext(EscolaContext);

export function useEscolaCarregada() {
  return useApi<Escola>('/escola');
}

export const data = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '');

export const dataHora = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const caminhos = {
  painel: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  jovens: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2.5 3 5',
  vagas: 'M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M4 6h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 12h18',
  empresas: 'M4 20V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14M14 10h5a1 1 0 0 1 1 1v9M3 20h18M8 9h2M8 13h2M8 17h2',
  bussola: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  agenda: 'M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  registros: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 17h6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6 6 18',
};

export type NomeIcone = keyof typeof caminhos;

export function Icone({ nome, className = 'h-4 w-4' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={caminhos[nome]} />
    </svg>
  );
}

export function Titulo({ children, acao, subtitulo }: { children: ReactNode; acao?: ReactNode; subtitulo?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-ink">{children}</h1>
        {subtitulo && <p className="mt-1 text-sm text-ink-3">{subtitulo}</p>}
      </div>
      {acao}
    </div>
  );
}

export function Card({ titulo, acao, children, className = '' }: { titulo?: ReactNode; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-card bg-surface p-5 shadow-card ring-1 ring-line ${className}`}>
      {(titulo || acao) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {titulo && <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">{titulo}</h2>}
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

export type Tom = TomBadge;

export function Selo({ children, tom = 'neutral' }: { children: ReactNode; tom?: Tom }) {
  return <Badge tom={tom}>{children}</Badge>;
}

export const tonsSituacao: Record<Situacao, Tom> = {
  SEM_ESTAGIO: 'warning',
  ESTAGIANDO: 'info',
  CONCLUIDO: 'neutral',
  EMPREGADO: 'success',
};

export function SeloSituacao({ situacao }: { situacao: Situacao }) {
  return <Badge tom={tonsSituacao[situacao]}>{SITUACOES[situacao]}</Badge>;
}

export function SourceBadge({ origem }: { origem: Empresa['origem'] }) {
  return <DsSourceBadge origem={origem === 'PARCEIRA' ? 'PARCEIRA' : 'EXTERNA'} />;
}

export const inputCls =
  'w-full min-h-10 rounded-sm bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 ring-1 ring-line outline-none focus:ring-2 focus:ring-ring';
export const botaoCls =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-50';
export const botaoSecCls =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-surface px-3 text-sm font-medium text-ink ring-1 ring-line-strong hover:bg-surface-2 disabled:opacity-50';
export const linkCls = 'font-semibold text-brand-ink hover:underline';
export const acaoCls = 'text-sm font-semibold text-accent-ink hover:underline';
export const perigoCls = 'text-xs font-semibold text-danger hover:underline';
export const resumoCls = 'cursor-pointer text-sm font-semibold text-accent-ink';

export function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink-2">{rotulo}</span>
      {children}
    </label>
  );
}

export function Formulario({ onSubmit, children, enviar = 'Salvar' }: { onSubmit: (dados: FormData) => void; children: ReactNode; enviar?: string }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    onSubmit(new FormData(form));
    form.reset();
  };
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      {children}
      <div className="sm:col-span-2">
        <button className={botaoCls}>{enviar}</button>
      </div>
    </form>
  );
}

export function SelectCurso({ name = 'cursoId', obrigatorio = true }: { name?: string; obrigatorio?: boolean }) {
  const escola = useEscola();
  return (
    <select name={name} required={obrigatorio} className={inputCls} defaultValue="">
      <option value="">{obrigatorio ? 'Selecione' : 'Todos'}</option>
      {escola?.cursos.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nome}
        </option>
      ))}
    </select>
  );
}

export function Tabela({ cabecalho, children, vazio }: { cabecalho: string[]; children: ReactNode; vazio?: boolean | string }) {
  return (
    <div className="overflow-x-auto rounded-card bg-surface shadow-card ring-1 ring-line">
      <table className="w-full text-left text-sm text-ink">
        <thead className="sticky top-0 bg-surface-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
          <tr>
            {cabecalho.map((c, i) => (
              <th key={`${c}${i}`} className="px-4 py-2.5 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr]:h-12 [&>tr]:border-t [&>tr]:border-line [&>tr:hover]:bg-sand/60 [&_td]:px-4 [&_td]:py-2">{children}</tbody>
      </table>
      {vazio && (
        <div className="p-4">
          <EmptyState titulo={typeof vazio === 'string' ? vazio : 'Nada cadastrado ainda.'} />
        </div>
      )}
    </div>
  );
}

export const lista = (texto: FormDataEntryValue | null) =>
  String(texto ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

export const opcional = (valor: FormDataEntryValue | null) => (valor ? String(valor) : undefined);
