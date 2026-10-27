import { Link } from 'react-router';
import { useApi } from '../api';
import type { Aluno, Evento, Situacao } from '../tipos';
import { SITUACOES, TIPOS_EVENTO } from '../tipos';
import { Card, dataHora, Titulo } from '../ui';

interface Resumo {
  cursos: { id: string; nome: string; total: number; situacoes: Partial<Record<Situacao, number>> }[];
  terceiroSemEstagio: Aluno[];
  proximosEventos: Evento[];
  vagasAbertas: number;
  pedidosEmpresas: { id: string; aluno: Aluno; vaga: { id: string; titulo: string; empresa: { nome: string } } }[];
  egressos: { total: number; empregados: number };
}

const coresBarra: Record<Situacao, string> = {
  SEM_ESTAGIO: 'bg-amber-400',
  ESTAGIANDO: 'bg-sky-500',
  CONCLUIDO: 'bg-violet-500',
  EMPREGADO: 'bg-emerald-500',
};

export default function Painel() {
  const { dados } = useApi<Resumo>('/painel');
  if (!dados) return null;

  const alunos = dados.cursos.reduce((s, c) => s + c.total, 0);
  const colocados = dados.cursos.reduce((s, c) => s + (c.total - (c.situacoes.SEM_ESTAGIO ?? 0)), 0);

  return (
    <>
      <Titulo>Painel da coordenação</Titulo>
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Numero rotulo="Alunos matriculados" valor={alunos} />
        <Numero rotulo="Com estágio ou emprego" valor={alunos ? `${Math.round((colocados / alunos) * 100)}%` : '-'} />
        <Numero rotulo="Vagas abertas" valor={dados.vagasAbertas} />
        <Numero rotulo="Egressos empregados" valor={`${dados.egressos.empregados} de ${dados.egressos.total}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Situação por curso">
          <div className="space-y-4">
            {dados.cursos.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{c.nome}</span>
                  <span className="text-slate-500">{c.total} {c.total === 1 ? 'aluno' : 'alunos'}</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                  {(Object.keys(SITUACOES) as Situacao[]).map((s) =>
                    c.situacoes[s] ? (
                      <div key={s} className={coresBarra[s]} style={{ width: `${(c.situacoes[s]! / c.total) * 100}%` }} title={`${SITUACOES[s]}: ${c.situacoes[s]}`} />
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
            {(Object.keys(SITUACOES) as Situacao[]).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className={`h-2.5 w-2.5 rounded-full ${coresBarra[s]}`} /> {SITUACOES[s]}
              </span>
            ))}
          </div>
        </Card>

        <Card titulo={`3º ano sem estágio (${dados.terceiroSemEstagio.length})`}>
          <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto text-sm">
            {dados.terceiroSemEstagio.map((a) => (
              <li key={a.id} className="flex justify-between py-2">
                <Link to={`/alunos/${a.id}`} className="text-sky-700 hover:underline">
                  {a.nome}
                </Link>
                <span className="text-slate-500">
                  {a.curso.nome} · {a.turma}
                </span>
              </li>
            ))}
            {!dados.terceiroSemEstagio.length && <li className="py-2 text-slate-500">Todos colocados.</li>}
          </ul>
        </Card>

        {!!dados.pedidosEmpresas.length && (
          <Card titulo={`Pedidos das empresas (${dados.pedidosEmpresas.length})`} className="lg:col-span-2">
            <p className="mb-2 text-sm text-slate-500">Empresas pediram para conhecer estes perfis anônimos. Avalie e mude a indicação para "Encaminhado" se fizer sentido.</p>
            <ul className="divide-y divide-slate-100 text-sm">
              {dados.pedidosEmpresas.map((p) => (
                <li key={p.id} className="flex flex-wrap justify-between gap-2 py-2">
                  <Link to={`/vagas/${p.vaga.id}`} className="text-sky-700 hover:underline">
                    {p.vaga.empresa.nome}: {p.vaga.titulo}
                  </Link>
                  <Link to={`/alunos/${p.aluno.id}`} className="text-slate-600 hover:underline">
                    {p.aluno.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card titulo="Próximos eventos" className="lg:col-span-2">
          <ul className="divide-y divide-slate-100 text-sm">
            {dados.proximosEventos.map((e) => (
              <li key={e.id} className="flex justify-between py-2">
                <Link to={`/eventos/${e.id}`} className="text-sky-700 hover:underline">
                  {TIPOS_EVENTO[e.tipo]}: {e.titulo}
                </Link>
                <span className="text-slate-500">
                  {dataHora(e.data)} {e.mentor && `· ${e.mentor.nome}`}
                </span>
              </li>
            ))}
            {!dados.proximosEventos.length && <li className="py-2 text-slate-500">Nenhum evento agendado.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: string | number }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{rotulo}</p>
      <p className="mt-1 text-3xl font-semibold text-slate-800">{valor}</p>
    </Card>
  );
}
