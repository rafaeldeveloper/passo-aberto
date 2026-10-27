import { useState } from 'react';
import { api, enviar, useApi } from '../../api';
import { CartaoCandidato } from './Candidatos';
import { COORDENACAO } from '../../config';
import { Badge, btnFantasma, EmptyState } from '../../ds';
import { AvisoAnonimo, CartaoTalento, ORDEM } from './Talentos';
import type { PainelEmpresa, TalentosVaga } from './tipos';

const NO_INICIO = 3;
const INDICADOS_NO_INICIO = 3;

export default function Inicio({
  token,
  painel,
  recarregar,
  verCandidatos,
  verVagas,
}: {
  token: string;
  painel: PainelEmpresa;
  recarregar: () => void;
  verCandidatos: () => void;
  verVagas: () => void;
}) {
  const { dados: pool, recarregar: recarregarPool } = useApi<TalentosVaga[]>(`/portal/empresa/${token}/talentos`);
  const [enviados, setEnviados] = useState<string[]>([]);

  if (!pool) return <p className="py-10 text-center text-sm text-ink-3">Carregando...</p>;

  const todos = pool
    .flatMap(({ vaga, talentos }) => talentos.map((talento) => ({ vaga, talento })))
    .sort((a, b) => ORDEM[a.talento.compatibilidade] - ORDEM[b.talento.compatibilidade]);
  const destaque = todos.slice(0, NO_INICIO);
  const chave = (vagaId: string, alunoId: string) => `${vagaId}:${alunoId}`;
  const indicados = painel.vagas.flatMap((vaga) => vaga.indicacoes.filter((i) => i.status === 'ENCAMINHADO').map((indicacao) => ({ vaga, indicacao })));
  const atualizarTudo = () => {
    recarregar();
    recarregarPool();
  };

  const pedir = (vagaId: string, alunoId: string) =>
    enviar(
      () => api(`/portal/empresa/${token}/vagas/${vagaId}/pedidos`, 'POST', { alunoId }),
      () => setEnviados((e) => [...e, chave(vagaId, alunoId)]),
    );

  return (
    <div className="space-y-6">
      {indicados.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              Apresentados por {COORDENACAO} <Badge tom="accent">{indicados.length}</Badge>
            </h2>
            <p className="mt-1 text-sm text-ink-3">Perfis que eles apresentaram para suas vagas e que aguardam sua resposta.</p>
          </div>
          {indicados.slice(0, INDICADOS_NO_INICIO).map(({ vaga, indicacao }) => (
            <div key={indicacao.id} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-ink">Para: {vaga.titulo}</p>
              <CartaoCandidato token={token} indicacao={indicacao} recarregar={atualizarTudo} />
            </div>
          ))}
          {indicados.length > INDICADOS_NO_INICIO && (
            <button onClick={verCandidatos} className={`${btnFantasma} w-full`}>
              Ver todos os apresentados ({indicados.length})
            </button>
          )}
        </section>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-bold">Perfis próximos das suas vagas</h2>
          <p className="mt-1 text-sm text-ink-3">Jovens disponíveis com perfil próximo das suas vagas abertas.</p>
          <div className="mt-2">
            <AvisoAnonimo />
          </div>
        </div>

        {!pool.length ? (
          <EmptyState icone="vagas" titulo="Nenhuma vaga aberta" acao={{ rotulo: 'Apresentar uma vaga', onClick: verVagas }}>
            Apresente uma vaga para ver perfis próximos. {COORDENACAO} revisam e levam aos jovens.
          </EmptyState>
        ) : !destaque.length ? (
          <EmptyState icone="candidatos" titulo="Nenhum outro perfil no momento">
            Quando surgirem jovens com perfil próximo das suas vagas, eles aparecem aqui.
          </EmptyState>
        ) : (
          <>
            {destaque.map(({ vaga, talento }, i) => (
              <CartaoTalento
                key={chave(vaga.id, talento.id)}
                indice={i + 1}
                talento={talento}
                curso={vaga.curso}
                vaga={vaga.titulo}
                enviado={enviados.includes(chave(vaga.id, talento.id))}
                pedir={() => pedir(vaga.id, talento.id)}
              />
            ))}
            {todos.length > NO_INICIO && (
              <button onClick={verCandidatos} className={`${btnFantasma} w-full`}>
                Ver todos os perfis ({todos.length})
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
