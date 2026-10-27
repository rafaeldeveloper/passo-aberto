import { Link, useParams } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Situacao, Vaga } from '../tipos';
import { STATUS_INDICACAO, TIPOS_VAGA } from '../tipos';
import { Badge, botaoCls, botaoSecCls, Card, inputCls, linkCls, Selo, SeloSituacao, Titulo } from '../ui';

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
        subtitulo={`${vaga.empresa.nome} · ${vaga.curso.nome} · ${TIPOS_VAGA[vaga.tipo]}`}
        acao={
          <button className={botaoSecCls} onClick={() => enviar(() => api(`/vagas/${id}`, 'PATCH', { aberta: !vaga.aberta }), recarregar)}>
            {vaga.aberta ? 'Fechar vaga' : 'Reabrir vaga'}
          </button>
        }
      >
        {vaga.titulo} {!vaga.aberta && <Badge>Fechada</Badge>}
      </Titulo>
      <div className="-mt-3 mb-6 flex flex-wrap gap-1">
        {vaga.competencias.map((c) => (
          <Selo key={c}>{c}</Selo>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Jovens com perfil próximo">
          <ul className="divide-y divide-line text-sm">
            {sugestoes.map((s) => (
              <li key={s.aluno.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/alunos/${s.aluno.id}`} className={linkCls}>
                      {s.aluno.nome}
                    </Link>
                    <SeloSituacao situacao={s.aluno.situacao} />
                  </div>
                  <p className="text-xs text-ink-3">{s.aluno.turma}</p>
                  {s.motivos.map((m) => (
                    <p key={m} className="text-xs text-ink-2">
                      {m}
                    </p>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums text-ink">{s.pontuacao}</p>
                  {s.jaIndicado ? (
                    <Badge tom="brand">Indicado</Badge>
                  ) : s.bloqueadoLgpd ? (
                    <Badge tom="danger">Sem consentimento</Badge>
                  ) : (
                    <button className={botaoCls} onClick={() => enviar(() => api(`/vagas/${id}/indicacoes`, 'POST', { alunoId: s.aluno.id }), recarregar)}>
                      Indicar
                    </button>
                  )}
                </div>
              </li>
            ))}
            {!sugestoes.length && <li className="py-2 text-ink-3">Nenhum jovem disponível para esta vaga.</li>}
          </ul>
        </Card>

        <Card titulo="Indicações">
          <ul className="divide-y divide-line text-sm">
            {vaga.indicacoes?.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/alunos/${i.aluno.id}`} className={linkCls}>
                    {i.aluno.nome}
                  </Link>
                  {i.pedidaPelaEmpresa && <Badge tom="accent">Pedido da empresa</Badge>}
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
            {!vaga.indicacoes?.length && <li className="py-2 text-ink-3">Ninguém indicado ainda.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}
