import { useState } from 'react';
import { api, enviar, useApi } from '../../api';
import { COORDENACAO, CONTATO_EMAIL, mailtoAjuda } from '../../config';
import { Card, EmptyState, Icone, StatusTimeline } from '../../ds';
import { TIPOS_VAGA } from '../../tipos';
import Talentos from './Talentos';
import type { IndicacaoEmpresa, PainelEmpresa, TalentosVaga } from './tipos';
import { campoCls, dataCurta, Etiquetas, iniciais, primarioCls, secundarioCls } from './ui';

const PASSOS = [{ rotulo: `Apresentado por ${COORDENACAO}` }, { rotulo: 'Aguardando você', quem: 'A decisão é da sua empresa' }, { rotulo: 'Contratado' }];

function Subtitulo({ children }: { children: string }) {
  return <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">{children}</p>;
}

export function CartaoCandidato({ token, indicacao, recarregar }: { token: string; indicacao: IndicacaoEmpresa; recarregar: () => void }) {
  const [descartando, setDescartando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const { aluno } = indicacao;
  const contratado = indicacao.status === 'CONTRATADO';

  const responder = async (status: 'CONTRATADO' | 'DESCARTADO') => {
    if (status === 'CONTRATADO' && !window.confirm(`Confirmar a contratação de ${aluno.nome}?`)) return;
    setSalvando(true);
    await enviar(() => api(`/portal/empresa/${token}/indicacoes/${indicacao.id}`, 'PATCH', { status, observacao: motivo.trim() || undefined }), recarregar);
    setSalvando(false);
  };

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand-ink">{iniciais(aluno.nome)}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">{aluno.nome}</h3>
          <p className="text-sm text-ink-3">
            {aluno.curso.nome} · conclusão {aluno.anoConclusao}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-surface-2 px-3 py-3">
        <StatusTimeline compacto passos={PASSOS} atual={1} encerrado={contratado ? 'sucesso' : undefined} />
      </div>

      {aluno.resumo && <p className="mt-4 text-sm leading-relaxed text-ink-2">{aluno.resumo}</p>}

      {aluno.competencias.length > 0 && (
        <div className="mt-4">
          <Subtitulo>Competências</Subtitulo>
          <Etiquetas itens={aluno.competencias} />
        </div>
      )}

      {aluno.certificacoes.length > 0 && (
        <div className="mt-4">
          <Subtitulo>Certificações</Subtitulo>
          <ul className="space-y-1 text-sm">
            {aluno.certificacoes.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.nome}</span>
                {(c.instituicao || c.data) && <span className="text-ink-3"> · {[c.instituicao, dataCurta(c.data)].filter(Boolean).join(' · ')}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {aluno.projetos.length > 0 && (
        <div className="mt-4">
          <Subtitulo>Projetos</Subtitulo>
          <ul className="space-y-2">
            {aluno.projetos.map((p) => (
              <li key={p.id} className="rounded-md bg-sand p-3 text-sm">
                <p className="font-semibold">{p.titulo}</p>
                {p.descricao && <p className="mt-0.5 text-ink-2">{p.descricao}</p>}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold break-all text-accent-ink">
                    Ver projeto
                    <Icone nome="externo" className="h-3.5 w-3.5 shrink-0" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!contratado && !descartando && (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button disabled={salvando} onClick={() => setDescartando(true)} className={secundarioCls}>
            Não seguir
          </button>
          <button disabled={salvando} onClick={() => responder('CONTRATADO')} className={primarioCls}>
            Contratar
          </button>
        </div>
      )}

      {!contratado && descartando && (
        <div className="mt-5 space-y-2">
          <textarea
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={`Motivo (opcional, só ${COORDENACAO} veem)`}
            className={campoCls}
          />
          <div className="grid grid-cols-2 gap-2">
            <button disabled={salvando} onClick={() => setDescartando(false)} className={secundarioCls}>
              Voltar
            </button>
            <button
              disabled={salvando}
              onClick={() => responder('DESCARTADO')}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-danger px-5 text-base font-bold text-canvas disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </Card>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Candidatos</h1>
        <p className="mt-1 text-sm text-ink-3">A seleção e a contratação são da sua empresa.</p>
      </div>

      <Card tom="sand">
        <p className="flex items-center gap-2 font-semibold text-brand-ink">
          <Icone nome="escudo" className="h-5 w-5 shrink-0" />
          Perfis apresentados por {COORDENACAO}
        </p>
        <p className="mt-1 text-sm text-ink-2">
          Para proteger os jovens, os dados de contato não aparecem aqui. Para entrevistas e próximos passos, fale com {COORDENACAO} em{' '}
          <a href={mailtoAjuda(`Próximos passos: ${painel.empresa.nome}`)} className="font-semibold break-all text-accent-ink underline">
            {CONTATO_EMAIL}
          </a>
          .
        </p>
      </Card>

      {vagas.length === 0 && (
        <EmptyState icone="candidatos" titulo="Nenhum candidato no momento">
          Quando {COORDENACAO} apresentarem jovens para suas vagas, eles aparecem aqui.
        </EmptyState>
      )}

      {vagas.map((v) => (
        <section key={v.id} className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
              {TIPOS_VAGA[v.tipo]} · {v.curso.nome}
            </p>
            <h2 className="text-lg font-semibold">{v.titulo}</h2>
          </div>
          {v.indicacoes.length === 0 && (
            <p className="rounded-md bg-surface-2 px-4 py-3 text-sm text-ink-3">{COORDENACAO} ainda não apresentaram candidatos para esta vaga.</p>
          )}
          {v.indicacoes.map((i) => (
            <CartaoCandidato key={i.id} token={token} indicacao={i} recarregar={atualizar} />
          ))}
          {talentosDa(v.id).length > 0 && <Talentos token={token} vagaId={v.id} curso={v.curso.nome} talentos={talentosDa(v.id)} />}
        </section>
      ))}
    </div>
  );
}
