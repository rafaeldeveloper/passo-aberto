import { useState } from 'react';
import { api, enviar, useApi } from '../../api';
import { CartaoCandidato } from './Candidatos';
import { CartaoTalento, ORDEM } from './Talentos';
import type { PainelEmpresa, TalentosVaga } from './tipos';
import { Bloco, secundarioCls } from './ui';

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

  if (!pool) return <p className="py-10 text-center text-sm text-slate-500">Carregando...</p>;

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
    <div className="space-y-3">
      {indicados.length > 0 && (
        <>
          <div className="px-1">
            <h2 className="text-lg font-semibold text-slate-800">Indicados pela coordenação ({indicados.length})</h2>
            <p className="text-sm text-slate-500">Perfis que a coordenação encaminhou para suas vagas e aguardam sua resposta.</p>
          </div>
          {indicados.slice(0, INDICADOS_NO_INICIO).map(({ vaga, indicacao }) => (
            <div key={indicacao.id} className="space-y-1.5">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Para: {vaga.titulo}</p>
              <CartaoCandidato token={token} indicacao={indicacao} recarregar={atualizarTudo} />
            </div>
          ))}
          {indicados.length > INDICADOS_NO_INICIO && (
            <button onClick={verCandidatos} className="w-full py-2 text-sm font-semibold text-indigo-600">
              Ver todos os indicados ({indicados.length})
            </button>
          )}
        </>
      )}

      <div className={`px-1 ${indicados.length ? 'pt-3' : ''}`}>
        <h2 className="text-lg font-semibold text-slate-800">Talentos em destaque</h2>
        <p className="text-sm text-slate-500">Alunos disponíveis com perfil próximo das suas vagas abertas. Os perfis são anônimos até a coordenação encaminhar.</p>
      </div>

      {!pool.length ? (
        <Bloco className="text-center">
          <p className="text-sm text-slate-600">Publique uma vaga para ver os talentos disponíveis.</p>
          <button onClick={verVagas} className={`${secundarioCls} mt-3 border-indigo-200 text-indigo-700`}>
            Publicar vaga
          </button>
        </Bloco>
      ) : !destaque.length ? (
        <Bloco className="text-center text-sm text-slate-600">No momento não há outros talentos disponíveis para suas vagas.</Bloco>
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
            <button onClick={verCandidatos} className="w-full py-2 text-sm font-semibold text-indigo-600">
              Ver todos os talentos ({todos.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}
