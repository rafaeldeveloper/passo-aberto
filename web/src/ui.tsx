import type { FormEvent, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useApi } from './api';
import type { Escola, Situacao } from './tipos';
import { SITUACOES } from './tipos';

export const EscolaContext = createContext<Escola | undefined>(undefined);
export const useEscola = () => useContext(EscolaContext);

export function useEscolaCarregada() {
  return useApi<Escola>('/escola');
}

export const data = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '');

export const dataHora = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function Titulo({ children, acao }: { children: ReactNode; acao?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-2xl font-semibold text-slate-800">{children}</h1>
      {acao}
    </div>
  );
}

export function Card({ titulo, children, className = '' }: { titulo?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {titulo && <h2 className="mb-3 font-semibold text-slate-700">{titulo}</h2>}
      {children}
    </section>
  );
}

const coresSituacao: Record<Situacao, string> = {
  SEM_ESTAGIO: 'bg-amber-100 text-amber-800',
  ESTAGIANDO: 'bg-sky-100 text-sky-800',
  CONCLUIDO: 'bg-violet-100 text-violet-800',
  EMPREGADO: 'bg-emerald-100 text-emerald-800',
};

export function Selo({ children, cor = 'bg-slate-100 text-slate-700' }: { children: ReactNode; cor?: string }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cor}`}>{children}</span>;
}

export function SeloSituacao({ situacao }: { situacao: Situacao }) {
  return <Selo cor={coresSituacao[situacao]}>{SITUACOES[situacao]}</Selo>;
}

export const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none';
export const botaoCls = 'rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-50';
export const botaoSecCls = 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50';

export function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-600">{rotulo}</span>
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

export function Tabela({ cabecalho, children, vazio }: { cabecalho: string[]; children: ReactNode; vazio?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            {cabecalho.map((c) => (
              <th key={c} className="py-2 pr-4 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {vazio && <p className="py-4 text-sm text-slate-500">Nada cadastrado ainda.</p>}
    </div>
  );
}

export const lista = (texto: FormDataEntryValue | null) =>
  String(texto ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

export const opcional = (valor: FormDataEntryValue | null) => (valor ? String(valor) : undefined);
