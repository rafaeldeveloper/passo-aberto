import { useState } from 'react';
import { Link } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Estagio } from '../tipos';
import { STATUS_ESTAGIO } from '../tipos';
import type { Tom } from '../ui';
import { acaoCls, Badge, botaoCls, botaoSecCls, data, inputCls, linkCls, Tabela, Titulo } from '../ui';

const tonsEstagio: Record<Estagio['status'], Tom> = { EM_ANDAMENTO: 'info', CONCLUIDO: 'success', CANCELADO: 'neutral' };

export default function Estagios() {
  const [status, setStatus] = useState('EM_ANDAMENTO');
  const { dados: estagios = [], recarregar } = useApi<Estagio[]>(`/estagios${status ? `?status=${status}` : ''}`);
  const [editando, setEditando] = useState<string>();

  return (
    <>
      <Titulo
        acao={
          <select className={`${inputCls} w-auto`} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(STATUS_ESTAGIO).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        }
        subtitulo="Registro dos estágios das empresas. Para registrar um estágio novo, abra a ficha do jovem."
      >
        Estágios
      </Titulo>
      <Tabela
        cabecalho={['Jovem', 'Empresa', 'Período', 'Horas', 'Status', '']}
        vazio={!estagios.length && 'Nenhum estágio com este status. Para registrar um, abra a ficha do jovem.'}
      >
        {estagios.map((e) =>
          editando === e.id ? (
            <tr key={e.id}>
              <td colSpan={6} className="py-3!">
                <form
                  className="grid gap-2 sm:grid-cols-5"
                  onSubmit={(ev) => {
                    ev.preventDefault();
                    const f = new FormData(ev.currentTarget);
                    const nota = f.get('avaliacaoNota');
                    enviar(
                      () =>
                        api(`/estagios/${e.id}`, 'PATCH', {
                          cargaHorariaCumprida: Number(f.get('cargaHorariaCumprida')),
                          status: f.get('status'),
                          avaliacaoNota: nota === '' ? undefined : Number(nota),
                          avaliacaoComentario: f.get('avaliacaoComentario') || undefined,
                        }),
                      () => {
                        setEditando(undefined);
                        recarregar();
                      },
                    );
                  }}
                >
                  <input name="cargaHorariaCumprida" type="number" min={0} defaultValue={e.cargaHorariaCumprida} title="Horas cumpridas" className={inputCls} />
                  <select name="status" defaultValue={e.status} className={inputCls}>
                    {Object.entries(STATUS_ESTAGIO).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <input
                    name="avaliacaoNota"
                    type="number"
                    min={0}
                    max={10}
                    placeholder="Nota (0 a 10)"
                    defaultValue={e.avaliacaoNota ?? ''}
                    className={inputCls}
                  />
                  <input name="avaliacaoComentario" placeholder="Avaliação do supervisor" defaultValue={e.avaliacaoComentario ?? ''} className={inputCls} />
                  <div className="flex gap-2">
                    <button className={botaoCls}>Salvar</button>
                    <button type="button" className={botaoSecCls} onClick={() => setEditando(undefined)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </td>
            </tr>
          ) : (
            <tr key={e.id}>
              <td>
                <Link to={`/alunos/${e.aluno.id}`} className={linkCls}>
                  {e.aluno.nome}
                </Link>
                <p className="text-xs text-ink-3">{e.aluno.curso.nome}</p>
              </td>
              <td>{e.empresa.nome}</td>
              <td>
                {data(e.inicio)} {e.fim && `a ${data(e.fim)}`}
              </td>
              <td className="text-right tabular-nums">
                {e.cargaHorariaCumprida}/{e.cargaHorariaPrevista}h
              </td>
              <td>
                <Badge tom={tonsEstagio[e.status]}>{STATUS_ESTAGIO[e.status]}</Badge>
              </td>
              <td className="text-right">
                <button className={acaoCls} onClick={() => setEditando(e.id)}>
                  Atualizar
                </button>
              </td>
            </tr>
          ),
        )}
      </Tabela>
    </>
  );
}
