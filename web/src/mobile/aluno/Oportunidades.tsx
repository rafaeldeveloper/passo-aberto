import { useState } from 'react';
import { COORDENACAO, COORDENACAO_OU } from '../../config';
import { Card, EmptyState, Icone, StatusTimeline, btnFantasma } from '../../ds';
import { TIPOS_VAGA } from '../../tipos';
import Empresas from './Empresas';
import type { EmpresaArea, FichaPortal, PedirAjuda } from './tipos';
import { linhaIndicacao } from './tipos';

export default function Oportunidades({
  ficha,
  empresas,
  alternarInteresse,
  pedirAjuda,
}: {
  ficha: FichaPortal;
  empresas?: EmpresaArea[];
  alternarInteresse: (empresa: EmpresaArea) => void;
  pedirAjuda: PedirAjuda;
}) {
  const [modo, setModo] = useState<'lista' | 'mapa'>('lista');

  return (
    <div className="space-y-6">
      {modo === 'lista' && (
        <>
          <header>
            <h1 className="text-2xl font-bold">Trabalhar</h1>
            <p className="mt-2 flex gap-2 text-sm text-ink-3">
              <Icone nome="escudo" className="h-5 w-5 shrink-0 text-brand-ink" />
              Toda oportunidade passa pela revisão de {COORDENACAO} antes de aparecer aqui.
            </p>
          </header>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Suas indicações</h2>
            {ficha.indicacoes.length === 0 ? (
              <EmptyState icone="trabalhar" titulo="Nenhuma indicação ainda">
                Quando {COORDENACAO_OU} te apresentarem a uma oportunidade, ela aparece aqui.
              </EmptyState>
            ) : (
              <ul className="space-y-3">
                {ficha.indicacoes.map((i) => {
                  const linha = linhaIndicacao(i.status);
                  const contexto = i.vaga ? `Sobre a oportunidade ${i.vaga.titulo} (${i.vaga.empresa.nome}).` : undefined;
                  return (
                    <li key={i.id}>
                      <Card>
                        {i.vaga && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold tracking-wide text-ink-3 uppercase">
                              {TIPOS_VAGA[i.vaga.tipo]} · {i.vaga.empresa.nome}
                            </p>
                            <p className="text-lg font-semibold">{i.vaga.titulo}</p>
                          </div>
                        )}
                        <StatusTimeline {...linha} pedirAjuda={() => pedirAjuda('oportunidade', contexto)} />
                        {!linha.encerrado && (
                          <button onClick={() => pedirAjuda('oportunidade', contexto)} className={`${btnFantasma} -ml-3 mt-2`}>
                            <Icone nome="ajuda" className="h-4 w-4" />
                            Tirar dúvida sobre esta oportunidade
                          </button>
                        )}
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      <Empresas empresas={empresas} alternarInteresse={alternarInteresse} modo={modo} setModo={setModo} />
    </div>
  );
}
