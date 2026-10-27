import { useState } from 'react';
import { COORDENACAO } from '../../config';
import { Badge, Card, EmptyState, Icone, ListRow, avatarCls, btnFantasma, btnSecundario, listaCls } from '../../ds';
import type { Carreira, Carreiras as DadosCarreiras, FichaPortal, Novidade, PedirAjuda } from './tipos';
import { dataCurta, normalizar } from './ui';

export function ItemNovidade({ novidade, comCarreira = true }: { novidade: Novidade; comCarreira?: boolean }) {
  return (
    <article className="space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
        <span>{dataCurta(novidade.publicadaEm)}</span>
        {comCarreira && novidade.carreira && <Badge tom="brand">{novidade.carreira.titulo}</Badge>}
      </div>
      <p className="font-semibold">{novidade.titulo}</p>
      <p className="text-sm text-ink-2">{novidade.texto}</p>
      {novidade.link && (
        <a href={novidade.link} target="_blank" rel="noreferrer" className={`${btnFantasma} -ml-3`}>
          Saiba mais
          <Icone nome="externo" className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}

const quantasTenho = (carreira: Carreira, minhas: Set<string>) => carreira.competencias.filter((c) => minhas.has(normalizar(c))).length;

function Detalhe({
  carreira,
  ficha,
  novidades,
  voltar,
  pedirAjuda,
}: {
  carreira: Carreira;
  ficha: FichaPortal;
  novidades: Novidade[];
  voltar: () => void;
  pedirAjuda: PedirAjuda;
}) {
  const minhas = new Set(ficha.competencias.map(normalizar));
  const tenho = quantasTenho(carreira, minhas);
  const daCarreira = novidades.filter((n) => n.carreira?.id === carreira.id);

  return (
    <div className="space-y-4">
      <button onClick={voltar} className={`${btnFantasma} -ml-3`}>
        <Icone nome="voltar" className="h-5 w-5" />
        Caminhos
      </button>

      <Card tom="sand">
        <h1 className="text-2xl font-bold">{carreira.titulo}</h1>
        <p className="mt-2 text-ink-2">{carreira.resumo}</p>
      </Card>

      {carreira.ondeTrabalhar && (
        <Card titulo="Onde trabalhar">
          <p className="text-sm text-ink-2">{carreira.ondeTrabalhar}</p>
        </Card>
      )}

      {carreira.formacao && (
        <Card titulo="Como chegar lá">
          <p className="text-sm text-ink-2">{carreira.formacao}</p>
        </Card>
      )}

      {carreira.competencias.length > 0 && (
        <Card
          titulo="Competências"
          acao={
            <span className="text-ink-3">
              Você já tem {tenho} de {carreira.competencias.length}
            </span>
          }
        >
          <div className="flex flex-wrap gap-2">
            {carreira.competencias.map((c) =>
              minhas.has(normalizar(c)) ? (
                <span key={c} className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand-ink">
                  <Icone nome="check" className="h-3.5 w-3.5" />
                  {c}
                </span>
              ) : (
                <span key={c} className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 ring-1 ring-line">
                  {c}
                </span>
              ),
            )}
          </div>
          {tenho < carreira.competencias.length && <p className="mt-3 text-xs text-ink-3">Já sabe alguma dessas? Adicione no seu perfil, na aba Eu.</p>}
        </Card>
      )}

      {daCarreira.length > 0 && (
        <Card titulo="Novidades deste caminho">
          <div className="space-y-5">
            {daCarreira.map((n) => (
              <ItemNovidade key={n.id} novidade={n} comCarreira={false} />
            ))}
          </div>
        </Card>
      )}

      <button onClick={() => pedirAjuda('outra', `Quero entender melhor o caminho ${carreira.titulo}.`)} className={`${btnFantasma} -ml-3`}>
        <Icone nome="ajuda" className="h-4 w-4" />
        Pedir ajuda para entender este caminho
      </button>
    </div>
  );
}

function Descobrir({ ficha, dados, abrir }: { ficha: FichaPortal; dados: DadosCarreiras; abrir: (id: string) => void }) {
  const [todasNovidades, setTodasNovidades] = useState(false);
  const minhas = new Set(ficha.competencias.map(normalizar));
  const novidades = todasNovidades ? dados.novidades : dados.novidades.slice(0, 3);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold">Caminhos para {ficha.curso.nome}</h2>
        <p className="mb-3 text-sm text-ink-3">Caminhos para investigar, cada um com seus requisitos. Não são ofertas.</p>
        {dados.carreiras.length === 0 ? (
          <EmptyState icone="bussola" titulo="Nenhum caminho cadastrado ainda">
            {COORDENACAO} estão preparando os caminhos do seu curso. Eles aparecem aqui.
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {dados.carreiras.map((c) => {
              const tenho = quantasTenho(c, minhas);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => abrir(c.id)}
                    className="flex w-full items-center gap-3 rounded-card bg-surface p-4 text-left shadow-card ring-1 ring-line active:bg-surface-2"
                  >
                    <span className="block min-w-0 flex-1">
                      <span className="block text-lg font-semibold">{c.titulo}</span>
                      <span className="mt-1 line-clamp-2 text-sm text-ink-2">{c.resumo}</span>
                      {c.competencias.length > 0 && (
                        <span className="mt-2 block">
                          <Badge tom="brand">
                            Você já tem {tenho} de {c.competencias.length} competências
                          </Badge>
                        </span>
                      )}
                    </span>
                    <Icone nome="seta" className="h-5 w-5 shrink-0 text-ink-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Card titulo="Novidades">
        {dados.novidades.length === 0 ? (
          <p className="text-sm text-ink-3">Nenhuma novidade por enquanto. {COORDENACAO} publicam aqui o que acontece em cada caminho.</p>
        ) : (
          <>
            <div className="space-y-5">
              {novidades.map((n) => (
                <ItemNovidade key={n.id} novidade={n} />
              ))}
            </div>
            {!todasNovidades && dados.novidades.length > novidades.length && (
              <button onClick={() => setTodasNovidades(true)} className={`${btnSecundario} mt-4 w-full`}>
                Ver todas as novidades
              </button>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

function Estudar({ dados, abrir, pedirAjuda }: { dados: DadosCarreiras; abrir: (id: string) => void; pedirAjuda: PedirAjuda }) {
  const comFormacao = dados.carreiras.filter((c) => c.formacao);
  return (
    <div className="space-y-6">
      {comFormacao.length > 0 && (
        <Card titulo="Formação por caminho">
          <ul className={listaCls}>
            {comFormacao.map((c) => (
              <li key={c.id}>
                <ListRow
                  inicio={
                    <span className={`${avatarCls} bg-sand text-brand-ink`}>
                      <Icone nome="estudar" className="h-5 w-5" />
                    </span>
                  }
                  titulo={c.titulo}
                  meta={c.formacao}
                  onClick={() => abrir(c.id)}
                  fim={<Icone nome="seta" className="h-4 w-4 text-ink-3" />}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}
      <EmptyState
        icone="estudar"
        titulo="Cursos e bolsas"
        acao={{ rotulo: 'Pedir ajuda para escolher um curso', onClick: () => pedirAjuda('outra', 'Quero ajuda para escolher um curso.') }}
      >
        Cursos, acesso à universidade e bolsas vão aparecer aqui, com critérios e prazos claros. O projeto não tem bolsas garantidas.
      </EmptyState>
    </div>
  );
}

export default function Carreiras({ ficha, dados, pedirAjuda }: { ficha: FichaPortal; dados?: DadosCarreiras; pedirAjuda: PedirAjuda }) {
  const [abertaId, setAbertaId] = useState<string>();
  const [segmento, setSegmento] = useState<'descobrir' | 'estudar'>('descobrir');

  if (!dados) return <p className="py-10 text-center text-sm text-ink-3">Carregando caminhos...</p>;

  const aberta = dados.carreiras.find((c) => c.id === abertaId);
  const abrir = (id?: string) => {
    setAbertaId(id);
    window.scrollTo({ top: 0 });
  };

  if (aberta) return <Detalhe carreira={aberta} ficha={ficha} novidades={dados.novidades} voltar={() => abrir(undefined)} pedirAjuda={pedirAjuda} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Caminhos</h1>

      <div className="grid grid-cols-2 rounded-full bg-surface-2 p-1" role="tablist">
        {(
          [
            ['descobrir', 'Descobrir'],
            ['estudar', 'Estudar'],
          ] as const
        ).map(([id, rotulo]) => (
          <button
            key={id}
            role="tab"
            aria-selected={segmento === id}
            onClick={() => setSegmento(id)}
            className={`min-h-10 rounded-full text-sm font-semibold ${segmento === id ? 'bg-surface text-brand-ink shadow-card' : 'text-ink-3'}`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {segmento === 'descobrir' ? <Descobrir ficha={ficha} dados={dados} abrir={abrir} /> : <Estudar dados={dados} abrir={abrir} pedirAjuda={pedirAjuda} />}
    </div>
  );
}
