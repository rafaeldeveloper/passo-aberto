import { Link, useParams } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Situacao, Vaga } from '../tipos';
import { STATUS_INDICACAO, TIPOS_VAGA } from '../tipos';
import { botaoSecCls, Card, inputCls, Selo, SeloSituacao, Titulo } from '../ui';

interface Sugestao {
  aluno: { id: string; nome: string; turma: string; situacao: Situacao };
  pontuacao: number;
  motivos: string[];
  jaIndicado: boolean;
  bloqueadoLgpd: boolean;
}

export default function VagaDetalhe() {
  const { id } = useParams();
  const { dados: vaga, recarregar: recarregarVaga } = useApi<Vaga>(`/vagas/${id}`);
  const { dados: sugestoes = [], recarregar: recarregarSugestoes } = useApi<Sugestao[]>(`/vagas/${id}/sugestoes`);
  if (!vaga) return null;

  const recarregar = () => {
    recarregarVaga();
    recarregarSugestoes();
  };

  return (
    <>
      <Titulo
        acao={
          <button className={botaoSecCls} onClick={() => enviar(() => api(`/vagas/${id}`, 'PATCH', { aberta: !vaga.aberta }), recarregar)}>
            {vaga.aberta ? 'Fechar vaga' : 'Reabrir vaga'}
          </button>
        }
      >
        {vaga.titulo}
      </Titulo>
      <p className="-mt-3 mb-2 text-sm text-slate-500">
        {vaga.empresa.nome} · {vaga.curso.nome} · {TIPOS_VAGA[vaga.tipo]}
      </p>
      <div className="mb-4 flex flex-wrap gap-1">
        {vaga.competencias.map((c) => (
          <Selo key={c}>{c}</Selo>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Sugestões de alunos">
          <ul className="divide-y divide-slate-100 text-sm">
            {sugestoes.map((s) => (
              <li key={s.aluno.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/alunos/${s.aluno.id}`} className="font-medium text-sky-700 hover:underline">
                      {s.aluno.nome}
                    </Link>
                    <SeloSituacao situacao={s.aluno.situacao} />
                  </div>
                  <p className="text-xs text-slate-500">{s.aluno.turma}</p>
                  {s.motivos.map((m) => (
                    <p key={m} className="text-xs text-slate-600">
                      {m}
                    </p>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-700">{s.pontuacao}</p>
                  {s.jaIndicado ? (
                    <Selo>indicado</Selo>
                  ) : s.bloqueadoLgpd ? (
                    <Selo cor="bg-red-100 text-red-700">sem consentimento</Selo>
                  ) : (
                    <button className={botaoSecCls} onClick={() => enviar(() => api(`/vagas/${id}/indicacoes`, 'POST', { alunoId: s.aluno.id }), recarregar)}>
                      Indicar
                    </button>
                  )}
                </div>
              </li>
            ))}
            {!sugestoes.length && <li className="py-2 text-slate-500">Nenhum aluno disponível para esta vaga.</li>}
          </ul>
        </Card>

        <Card titulo="Indicações">
          <ul className="divide-y divide-slate-100 text-sm">
            {vaga.indicacoes?.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/alunos/${i.aluno.id}`} className="text-sky-700 hover:underline">
                    {i.aluno.nome}
                  </Link>
                  {i.pedidaPelaEmpresa && <Selo cor="bg-indigo-100 text-indigo-800">pedido da empresa</Selo>}
                </div>
                <select
                  className={`${inputCls} w-auto`}
                  value={i.status}
                  onChange={(e) => enviar(() => api(`/indicacoes/${i.id}`, 'PATCH', { status: e.target.value }), recarregar)}
                >
                  {Object.entries(STATUS_INDICACAO).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </li>
            ))}
            {!vaga.indicacoes?.length && <li className="py-2 text-slate-500">Ninguém indicado ainda.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}
