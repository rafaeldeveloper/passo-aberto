import { useState } from 'react';
import { Link } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Estagio } from '../tipos';
import { STATUS_ESTAGIO } from '../tipos';
import { botaoSecCls, Card, data, inputCls, Tabela, Titulo } from '../ui';

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
      >
        Estágios
      </Titulo>
      <p className="-mt-2 mb-4 text-sm text-slate-500">Para registrar um estágio novo, abra a ficha do aluno.</p>
      <Card>
        <Tabela cabecalho={['Aluno', 'Empresa', 'Período', 'Horas', 'Status', '']} vazio={!estagios.length}>
          {estagios.map((e) =>
            editando === e.id ? (
              <tr key={e.id}>
                <td colSpan={6} className="py-3">
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
                    <input name="avaliacaoNota" type="number" min={0} max={10} placeholder="Nota (0 a 10)" defaultValue={e.avaliacaoNota ?? ''} className={inputCls} />
                    <input name="avaliacaoComentario" placeholder="Avaliação do supervisor" defaultValue={e.avaliacaoComentario ?? ''} className={inputCls} />
                    <div className="flex gap-2">
                      <button className={botaoSecCls}>Salvar</button>
                      <button type="button" className={botaoSecCls} onClick={() => setEditando(undefined)}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ) : (
              <tr key={e.id}>
                <td className="py-2 pr-4">
                  <Link to={`/alunos/${e.aluno.id}`} className="text-sky-700 hover:underline">
                    {e.aluno.nome}
                  </Link>
                  <p className="text-xs text-slate-500">{e.aluno.curso.nome}</p>
                </td>
                <td className="pr-4">{e.empresa.nome}</td>
                <td className="pr-4">
                  {data(e.inicio)} {e.fim && `a ${data(e.fim)}`}
                </td>
                <td className="pr-4">
                  {e.cargaHorariaCumprida}/{e.cargaHorariaPrevista}h
                </td>
                <td className="pr-4">{STATUS_ESTAGIO[e.status]}</td>
                <td>
                  <button className="text-sky-700 hover:underline" onClick={() => setEditando(e.id)}>
                    atualizar
                  </button>
                </td>
              </tr>
            ),
          )}
        </Tabela>
      </Card>
    </>
  );
}
