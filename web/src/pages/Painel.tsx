import { Link } from 'react-router';
import { useApi } from '../api';
import type { Aluno, Evento, Situacao } from '../tipos';
import { SITUACOES, TIPOS_EVENTO } from '../tipos';
import { Badge, botaoSecCls, Card, dataHora, linkCls, Titulo } from '../ui';

interface Resumo {
  cursos: { id: string; nome: string; total: number; situacoes: Partial<Record<Situacao, number>> }[];
  terceiroSemEstagio: Aluno[];
  proximosEventos: Evento[];
  vagasAbertas: number;
  pedidosEmpresas: { id: string; aluno: Aluno; vaga: { id: string; titulo: string; empresa: { nome: string } } }[];
  egressos: { total: number; empregados: number };
}

const coresBarra: Record<Situacao, string> = {
  SEM_ESTAGIO: 'bg-terracotta-300',
  ESTAGIANDO: 'bg-petrol-400',
  CONCLUIDO: 'bg-petrol-200',
  EMPREGADO: 'bg-success',
};

const hoje = () => new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default function Painel() {
  const { dados } = useApi<Resumo>('/painel');
  if (!dados) return null;

  const alunos = dados.cursos.reduce((s, c) => s + c.total, 0);
  const colocados = dados.cursos.reduce((s, c) => s + (c.total - (c.situacoes.SEM_ESTAGIO ?? 0)), 0);

  return (
    <>
      <Titulo subtitulo={hoje()}>Painel</Titulo>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Numero rotulo="Jovens participantes" valor={alunos} />
        <Numero rotulo="Com trabalho ou estágio" valor={alunos ? `${Math.round((colocados / alunos) * 100)}%` : '-'} />
        <Numero rotulo="Oportunidades abertas" valor={dados.vagasAbertas} />
        <Numero rotulo="Egressos empregados" valor={`${dados.egressos.empregados} de ${dados.egressos.total}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {!!dados.pedidosEmpresas.length && (
          <Card
            titulo={
              <>
                Aguardando vocês <Badge tom="accent">{dados.pedidosEmpresas.length}</Badge>
              </>
            }
            className="lg:col-span-2"
          >
            <p className="mb-2 text-sm text-ink-3">
              Pedidos das empresas: elas pediram para conhecer estes perfis anônimos. Avalie e mude a indicação para "Encaminhado" se fizer sentido.
            </p>
            <ul className="divide-y divide-line text-sm">
              {dados.pedidosEmpresas.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link to={`/alunos/${p.aluno.id}`} className={linkCls}>
                      {p.aluno.nome}
                    </Link>
                    <p className="truncate text-xs text-ink-3">
                      {p.vaga.empresa.nome} · {p.vaga.titulo}
                    </p>
                  </div>
                  <Link to={`/vagas/${p.vaga.id}`} className={botaoSecCls}>
                    Revisar
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card titulo="Situação por curso">
          <div className="space-y-4">
            {dados.cursos.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-ink">{c.nome}</span>
                  <span className="tabular-nums text-ink-3">
                    {c.total} {c.total === 1 ? 'jovem' : 'jovens'}
                  </span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2">
                  {(Object.keys(SITUACOES) as Situacao[]).map((s) =>
                    c.situacoes[s] ? (
                      <div
                        key={s}
                        className={coresBarra[s]}
                        style={{ width: `${(c.situacoes[s]! / c.total) * 100}%` }}
                        title={`${SITUACOES[s]}: ${c.situacoes[s]}`}
                      />
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-2">
            {(Object.keys(SITUACOES) as Situacao[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${coresBarra[s]}`} /> {SITUACOES[s]}
              </span>
            ))}
          </div>
        </Card>

        <Card titulo={`Ainda buscando trabalho ou estágio (${dados.terceiroSemEstagio.length})`}>
          <ul className="max-h-72 divide-y divide-line overflow-y-auto text-sm">
            {dados.terceiroSemEstagio.map((a) => (
              <li key={a.id} className="flex justify-between gap-3 py-2">
                <Link to={`/alunos/${a.id}`} className={linkCls}>
                  {a.nome}
                </Link>
                <span className="text-ink-3">
                  {a.curso.nome} · {a.turma}
                </span>
              </li>
            ))}
            {!dados.terceiroSemEstagio.length && <li className="py-2 text-ink-3">Todos com trabalho ou estágio.</li>}
          </ul>
        </Card>

        <Card titulo="Próximos encontros" className="lg:col-span-2">
          <ul className="divide-y divide-line text-sm">
            {dados.proximosEventos.map((e) => (
              <li key={e.id} className="flex flex-wrap justify-between gap-2 py-2">
                <Link to={`/eventos/${e.id}`} className={linkCls}>
                  {TIPOS_EVENTO[e.tipo]}: {e.titulo}
                </Link>
                <span className="text-ink-3">
                  {dataHora(e.data)} {e.mentor && `· ${e.mentor.nome}`}
                </span>
              </li>
            ))}
            {!dados.proximosEventos.length && <li className="py-2 text-ink-3">Nenhum encontro agendado.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: string | number }) {
  return (
    <div className="rounded-card bg-surface p-5 shadow-card ring-1 ring-line">
      <p className="text-sm text-ink-3">{rotulo}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-ink">{valor}</p>
    </div>
  );
}
