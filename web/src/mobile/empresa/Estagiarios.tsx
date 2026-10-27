import type { FormEvent } from 'react';
import { useState } from 'react';
import { api, enviar } from '../../api';
import type { EstagioEmpresa, PainelEmpresa } from './tipos';
import { Card, EmptyState } from '../../ds';
import { campoCls, dataCurta, iniciais, primarioCls, Rotulo, secundarioCls } from './ui';

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
    <form onSubmit={salvar} className="mt-4 space-y-4 border-t border-line pt-4">
      <Rotulo texto={`Horas cumpridas (de ${estagio.cargaHorariaPrevista}h)`}>
        <input required type="number" inputMode="numeric" min={0} value={horas} onChange={(e) => setHoras(e.target.value)} className={campoCls} />
      </Rotulo>
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-ink-2">Nota de avaliação (0 a 10)</span>
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(nota === n ? undefined : n)}
              aria-pressed={nota === n}
              className={`min-h-11 rounded-md text-sm font-semibold tabular-nums ${nota === n ? 'bg-brand text-on-brand' : 'bg-surface text-ink-2 ring-1 ring-line'}`}
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
          placeholder="Como tem sido o desempenho no estágio?"
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
    <Card>
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand-ink">{iniciais(estagio.aluno.nome)}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">{estagio.aluno.nome}</h3>
          <p className="text-sm text-ink-3">{estagio.aluno.curso.nome}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-3">
        Desde {dataCurta(estagio.inicio)}
        {estagio.fim && ` até ${dataCurta(estagio.fim)}`}
        {estagio.supervisorNome && ` · Supervisor: ${estagio.supervisorNome}`}
      </p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-ink-2 tabular-nums">
            {estagio.cargaHorariaCumprida}h de {estagio.cargaHorariaPrevista}h
          </span>
          <span className="font-semibold text-brand-ink tabular-nums">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {estagio.avaliacaoNota != null && (
        <div className="mt-3 rounded-md bg-sand p-3 text-sm">
          <span className="font-semibold tabular-nums">Nota {estagio.avaliacaoNota}/10</span>
          {estagio.avaliacaoComentario && <p className="mt-0.5 text-ink-2">{estagio.avaliacaoComentario}</p>}
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
        <button onClick={() => setEditando(true)} className={`${primarioCls} mt-4`}>
          Registrar avaliação
        </button>
      )}
    </Card>
  );
}

export default function Estagiarios({ token, painel, recarregar }: { token: string; painel: PainelEmpresa; recarregar: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Estagiários</h1>
        <p className="mt-1 text-sm text-ink-3">Acompanhe as horas e registre a avaliação de quem estagia na sua empresa.</p>
      </div>
      {painel.estagios.length === 0 ? (
        <EmptyState icone="estagiarios" titulo="Nenhum estagiário ativo">
          Os estágios em andamento na sua empresa aparecem aqui.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {painel.estagios.map((e) => (
            <CartaoEstagio key={e.id} token={token} estagio={e} recarregar={recarregar} />
          ))}
        </div>
      )}
    </div>
  );
}
