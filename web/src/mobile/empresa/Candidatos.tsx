import { useState } from 'react';
import { api, enviar, useApi } from '../../api';
import { TIPOS_VAGA } from '../../tipos';
import Talentos from './Talentos';
import type { IndicacaoEmpresa, PainelEmpresa, TalentosVaga } from './tipos';
import { Bloco, Chip, Chips, Vazio, campoCls, dataCurta, primarioCls, secundarioCls } from './ui';

export function CartaoCandidato({ token, indicacao, recarregar }: { token: string; indicacao: IndicacaoEmpresa; recarregar: () => void }) {
  const [descartando, setDescartando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const { aluno } = indicacao;
  const contratado = indicacao.status === 'CONTRATADO';

  const responder = async (status: 'CONTRATADO' | 'DESCARTADO') => {
    if (status === 'CONTRATADO' && !window.confirm(`Confirmar a contratação de ${aluno.nome}?`)) return;
    setSalvando(true);
    await enviar(
      () => api(`/portal/empresa/${token}/indicacoes/${indicacao.id}`, 'PATCH', { status, observacao: motivo.trim() || undefined }),
      recarregar,
    );
    setSalvando(false);
  };

  return (
    <Bloco>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
          {aluno.nome
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800">{aluno.nome}</h3>
          <p className="text-sm text-slate-500">
            {aluno.curso.nome} · Turma {aluno.turma} · Conclusão {aluno.anoConclusao}
          </p>
        </div>
        {contratado && <Chip cor="bg-emerald-50 text-emerald-700">Contratado</Chip>}
      </div>

      {aluno.resumo && <p className="mt-3 text-sm leading-relaxed text-slate-700">{aluno.resumo}</p>}

      {aluno.competencias.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Competências</p>
          <Chips itens={aluno.competencias} cor="bg-indigo-50 text-indigo-700" />
        </div>
      )}

      {aluno.certificacoes.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Certificações</p>
          <ul className="space-y-1 text-sm text-slate-700">
            {aluno.certificacoes.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.nome}</span>
                {(c.instituicao || c.data) && (
                  <span className="text-slate-500">
                    {' '}
                    · {[c.instituicao, dataCurta(c.data)].filter(Boolean).join(' · ')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {aluno.projetos.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Projetos</p>
          <ul className="space-y-2">
            {aluno.projetos.map((p) => (
              <li key={p.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-800">{p.titulo}</p>
                {p.descricao && <p className="mt-0.5 text-slate-600">{p.descricao}</p>}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="mt-1 inline-block font-medium text-indigo-600 break-all">
                    Ver projeto ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!contratado && !descartando && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button disabled={salvando} onClick={() => setDescartando(true)} className={secundarioCls}>
            Não seguir
          </button>
          <button disabled={salvando} onClick={() => responder('CONTRATADO')} className={primarioCls}>
            Contratar
          </button>
        </div>
      )}

      {!contratado && descartando && (
        <div className="mt-4 space-y-2">
          <textarea
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo (opcional, visível apenas para a coordenação)"
            className={campoCls}
          />
          <div className="grid grid-cols-2 gap-2">
            <button disabled={salvando} onClick={() => setDescartando(false)} className={secundarioCls}>
              Voltar
            </button>
            <button
              disabled={salvando}
              onClick={() => responder('DESCARTADO')}
              className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white active:bg-rose-700 disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </Bloco>
  );
}

export default function Candidatos({ token, painel, recarregar }: { token: string; painel: PainelEmpresa; recarregar: () => void }) {
  const { dados: pool, recarregar: recarregarPool } = useApi<TalentosVaga[]>(`/portal/empresa/${token}/talentos`);
  const talentosDa = (vagaId: string) => pool?.find((p) => p.vaga.id === vagaId)?.talentos ?? [];
  const vagas = painel.vagas.filter((v) => v.indicacoes.length > 0 || talentosDa(v.id).length > 0);
  const atualizar = () => {
    recarregar();
    recarregarPool();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900">
        <p className="font-semibold">Perfis selecionados pela coordenação</p>
        <p className="mt-1 text-indigo-800">
          Por proteção dos alunos, os dados de contato não são exibidos. Para entrevistas e próximos passos, fale com a coordenação do Passo Aberto.
        </p>
      </div>

      {vagas.length === 0 && <Vazio titulo="Nenhum candidato no momento">Quando a coordenação encaminhar jovens para suas vagas, eles aparecem aqui.</Vazio>}

      {vagas.map((v) => (
        <div key={v.id} className="space-y-3">
          <div className="px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {TIPOS_VAGA[v.tipo]} · {v.curso.nome}
            </p>
            <h2 className="font-semibold text-slate-800">{v.titulo}</h2>
          </div>
          {v.indicacoes.length === 0 && (
            <p className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">A coordenação ainda não encaminhou candidatos para esta vaga.</p>
          )}
          {v.indicacoes.map((i) => (
            <CartaoCandidato key={i.id} token={token} indicacao={i} recarregar={atualizar} />
          ))}
          {talentosDa(v.id).length > 0 && <Talentos token={token} vagaId={v.id} curso={v.curso.nome} talentos={talentosDa(v.id)} />}
        </div>
      ))}
    </div>
  );
}
