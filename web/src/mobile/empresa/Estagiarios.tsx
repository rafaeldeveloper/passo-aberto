import type { FormEvent } from 'react';
import { useState } from 'react';
import { api, enviar } from '../../api';
import type { EstagioEmpresa, PainelEmpresa } from './tipos';
import { Bloco, Rotulo, Vazio, campoCls, dataCurta, primarioCls, secundarioCls } from './ui';

function Acompanhamento({ token, estagio, fechar }: { token: string; estagio: EstagioEmpresa; fechar: (salvou: boolean) => void }) {
  const [horas, setHoras] = useState(String(estagio.cargaHorariaCumprida));
  const [nota, setNota] = useState<number | undefined>(estagio.avaliacaoNota ?? undefined);
  const [comentario, setComentario] = useState(estagio.avaliacaoComentario ?? '');
  const [salvando, setSalvando] = useState(false);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    await enviar(
      () =>
        api(`/portal/empresa/${token}/estagios/${estagio.id}`, 'PATCH', {
          cargaHorariaCumprida: Number(horas),
          avaliacaoNota: nota,
          avaliacaoComentario: comentario.trim() || undefined,
        }),
      () => fechar(true),
    );
    setSalvando(false);
  };

  return (
    <form onSubmit={salvar} className="mt-4 space-y-4 border-t border-slate-100 pt-4">
      <Rotulo texto={`Horas cumpridas (de ${estagio.cargaHorariaPrevista}h)`}>
        <input required type="number" inputMode="numeric" min={0} value={horas} onChange={(e) => setHoras(e.target.value)} className={campoCls} />
      </Rotulo>
      <div>
        <span className="mb-1 block text-sm font-medium text-slate-600">Nota de avaliação (0 a 10)</span>
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(nota === n ? undefined : n)}
              className={`rounded-lg border py-2 text-sm font-semibold ${
                nota === n ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <Rotulo texto="Comentário">
        <textarea
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Como tem sido o desempenho do estagiário?"
          className={campoCls}
        />
      </Rotulo>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => fechar(false)} className={secundarioCls}>
          Cancelar
        </button>
        <button disabled={salvando} className={primarioCls}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

function CartaoEstagio({ token, estagio, recarregar }: { token: string; estagio: EstagioEmpresa; recarregar: () => void }) {
  const [editando, setEditando] = useState(false);
  const pct = estagio.cargaHorariaPrevista ? Math.min(100, Math.round((estagio.cargaHorariaCumprida / estagio.cargaHorariaPrevista) * 100)) : 0;

  return (
    <Bloco>
      <h3 className="font-semibold text-slate-800">{estagio.aluno.nome}</h3>
      <p className="text-sm text-slate-500">
        {estagio.aluno.curso.nome} · Turma {estagio.aluno.turma}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Desde {dataCurta(estagio.inicio)}
        {estagio.fim && ` até ${dataCurta(estagio.fim)}`}
        {estagio.supervisorNome && ` · Supervisor: ${estagio.supervisorNome}`}
      </p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-slate-600">
            {estagio.cargaHorariaCumprida}h de {estagio.cargaHorariaPrevista}h
          </span>
          <span className="font-semibold text-indigo-700">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {estagio.avaliacaoNota != null && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
          <span className="font-semibold text-slate-800">Nota {estagio.avaliacaoNota}/10</span>
          {estagio.avaliacaoComentario && <p className="mt-0.5 text-slate-600">{estagio.avaliacaoComentario}</p>}
        </div>
      )}

      {editando ? (
        <Acompanhamento
          token={token}
          estagio={estagio}
          fechar={(salvou) => {
            setEditando(false);
            if (salvou) recarregar();
          }}
        />
      ) : (
        <button onClick={() => setEditando(true)} className={`${secundarioCls} mt-4`}>
          Atualizar horas e avaliação
        </button>
      )}
    </Bloco>
  );
}

export default function Estagiarios({ token, painel, recarregar }: { token: string; painel: PainelEmpresa; recarregar: () => void }) {
  if (painel.estagios.length === 0)
    return <Vazio titulo="Nenhum estagiário ativo">Os estágios em andamento na sua empresa aparecem aqui.</Vazio>;

  return (
    <div className="space-y-3">
      {painel.estagios.map((e) => (
        <CartaoEstagio key={e.id} token={token} estagio={e} recarregar={recarregar} />
      ))}
    </div>
  );
}
