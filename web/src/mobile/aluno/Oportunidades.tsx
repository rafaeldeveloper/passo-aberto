import { STATUS_ESTAGIO, TIPOS_VAGA } from '../../tipos';
import Empresas from './Empresas';
import type { EmpresaArea, FichaPortal } from './tipos';
import { STATUS_AMIGAVEL } from './tipos';
import { Bloco, Pilula, Progresso, Vazio, dataCurta } from './ui';

const corEstagio = { EM_ANDAMENTO: 'bg-sky-100 text-sky-800', CONCLUIDO: 'bg-emerald-100 text-emerald-800', CANCELADO: 'bg-slate-100 text-slate-600' };

export default function Oportunidades({
  ficha,
  empresas,
  alternarInteresse,
}: {
  ficha: FichaPortal;
  empresas?: EmpresaArea[];
  alternarInteresse: (empresa: EmpresaArea) => void;
}) {
  return (
    <div className="space-y-4">
      <h1 className="px-1 text-2xl font-bold text-slate-800">Oportunidades</h1>

      <Bloco titulo="Suas indicações">
        {ficha.indicacoes.length === 0 ? (
          <Vazio>Quando a coordenação te indicar para uma vaga, ela aparece aqui.</Vazio>
        ) : (
          <ul className="space-y-3">
            {ficha.indicacoes.map((i) => (
              <li key={i.id} className="rounded-2xl border border-slate-100 p-4">
                {i.vaga && (
                  <>
                    <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                      {TIPOS_VAGA[i.vaga.tipo]} · {i.vaga.empresa.nome}
                    </p>
                    <p className="mb-2 font-semibold text-slate-800">{i.vaga.titulo}</p>
                  </>
                )}
                <Pilula cor={STATUS_AMIGAVEL[i.status].cor}>{STATUS_AMIGAVEL[i.status].texto}</Pilula>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Bloco titulo="Meus estágios">
        {ficha.estagios.length === 0 ? (
          <Vazio>Você ainda não tem estágios registrados.</Vazio>
        ) : (
          <ul className="space-y-3">
            {ficha.estagios.map((e) => (
              <li key={e.id} className="space-y-3 rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{e.empresa.nome}</p>
                    <p className="text-sm text-slate-500">
                      {dataCurta(e.inicio)}
                      {e.fim ? ` a ${dataCurta(e.fim)}` : ' até hoje'}
                    </p>
                    {e.supervisorNome && <p className="text-sm text-slate-500">Supervisão: {e.supervisorNome}</p>}
                  </div>
                  <Pilula cor={corEstagio[e.status]}>{STATUS_ESTAGIO[e.status]}</Pilula>
                </div>
                <Progresso atual={e.cargaHorariaCumprida} total={e.cargaHorariaPrevista} />
                {(e.avaliacaoNota != null || e.avaliacaoComentario) && (
                  <div className="rounded-2xl bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-900">
                      Avaliação do supervisor{e.avaliacaoNota != null && `: ${e.avaliacaoNota}/10`}
                    </p>
                    {e.avaliacaoComentario && <p className="mt-1 text-sm text-amber-900/80">"{e.avaliacaoComentario}"</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Empresas empresas={empresas} alternarInteresse={alternarInteresse} />
    </div>
  );
}
