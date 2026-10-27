import { useState } from 'react';
import type { Carreira, Carreiras as DadosCarreiras, FichaPortal, Novidade } from './tipos';
import { Bloco, Icone, Pilula, Vazio, dataCurta, normalizar } from './ui';

export function ItemNovidade({ novidade, comCarreira = true }: { novidade: Novidade; comCarreira?: boolean }) {
  return (
    <article className="space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span>{dataCurta(novidade.publicadaEm)}</span>
        {comCarreira && novidade.carreira && <Pilula cor="bg-sky-50 text-sky-800">{novidade.carreira.titulo}</Pilula>}
      </div>
      <p className="font-semibold text-slate-800">{novidade.titulo}</p>
      <p className="text-sm text-slate-600">{novidade.texto}</p>
      {novidade.link && (
        <a href={novidade.link} target="_blank" rel="noreferrer" className="inline-block pt-1 text-sm font-semibold text-teal-700">
          Saiba mais
        </a>
      )}
    </article>
  );
}

function Detalhe({ carreira, ficha, novidades, voltar }: { carreira: Carreira; ficha: FichaPortal; novidades: Novidade[]; voltar: () => void }) {
  const minhas = new Set(ficha.competencias.map(normalizar));
  const tenho = carreira.competencias.filter((c) => minhas.has(normalizar(c))).length;
  const daCarreira = novidades.filter((n) => n.carreira?.id === carreira.id);

  return (
    <div className="space-y-4">
      <button onClick={voltar} className="-ml-1 flex items-center gap-1 py-1 text-sm font-semibold text-teal-700">
        <Icone nome="voltar" className="h-5 w-5" />
        Carreiras
      </button>

      <header className="rounded-3xl bg-gradient-to-br from-sky-600 to-teal-600 p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">{carreira.titulo}</h1>
        <p className="mt-2 text-sky-50">{carreira.resumo}</p>
      </header>

      {carreira.ondeTrabalhar && (
        <Bloco titulo="Onde trabalhar">
          <p className="text-sm text-slate-600">{carreira.ondeTrabalhar}</p>
        </Bloco>
      )}

      {carreira.formacao && (
        <Bloco titulo="Formação para seguir">
          <p className="text-sm text-slate-600">{carreira.formacao}</p>
        </Bloco>
      )}

      {carreira.competencias.length > 0 && (
        <Bloco
          titulo="Competências"
          acao={
            <span className="text-sm font-semibold text-teal-700">
              Você já tem {tenho} de {carreira.competencias.length}
            </span>
          }
        >
          <div className="flex flex-wrap gap-2">
            {carreira.competencias.map((c) =>
              minhas.has(normalizar(c)) ? (
                <span key={c} className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1.5 text-sm font-medium text-white">
                  <Icone nome="check" className="h-3.5 w-3.5" />
                  {c}
                </span>
              ) : (
                <span key={c} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                  {c}
                </span>
              ),
            )}
          </div>
          {tenho < carreira.competencias.length && (
            <p className="mt-3 text-xs text-slate-500">Já sabe alguma dessas? Adicione na sua ficha.</p>
          )}
        </Bloco>
      )}

      {daCarreira.length > 0 && (
        <Bloco titulo="Novidades desta carreira">
          <div className="space-y-5">
            {daCarreira.map((n) => (
              <ItemNovidade key={n.id} novidade={n} comCarreira={false} />
            ))}
          </div>
        </Bloco>
      )}
    </div>
  );
}

export default function Carreiras({ ficha, dados }: { ficha: FichaPortal; dados?: DadosCarreiras }) {
  const [abertaId, setAbertaId] = useState<string>();
  const [todasNovidades, setTodasNovidades] = useState(false);

  if (!dados) return <Vazio>Carregando carreiras...</Vazio>;

  const aberta = dados.carreiras.find((c) => c.id === abertaId);
  const abrir = (id?: string) => {
    setAbertaId(id);
    window.scrollTo({ top: 0 });
  };

  if (aberta) return <Detalhe carreira={aberta} ficha={ficha} novidades={dados.novidades} voltar={() => abrir(undefined)} />;

  const novidades = todasNovidades ? dados.novidades : dados.novidades.slice(0, 3);

  return (
    <div className="space-y-4">
      <h1 className="px-1 text-2xl font-bold text-slate-800">Carreiras</h1>

      <Bloco titulo="Novidades">
        {dados.novidades.length === 0 ? (
          <Vazio>Nenhuma novidade por enquanto.</Vazio>
        ) : (
          <>
            <div className="space-y-5">
              {novidades.map((n) => (
                <ItemNovidade key={n.id} novidade={n} />
              ))}
            </div>
            {!todasNovidades && dados.novidades.length > novidades.length && (
              <button onClick={() => setTodasNovidades(true)} className="mt-4 w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 active:bg-slate-200">
                Ver todas as novidades
              </button>
            )}
          </>
        )}
      </Bloco>

      <section>
        <h2 className="mb-3 px-1 text-base font-semibold text-slate-800">Caminhos para {ficha.curso.nome}</h2>
        {dados.carreiras.length === 0 ? (
          <Vazio>A coordenação ainda não cadastrou carreiras para o seu curso.</Vazio>
        ) : (
          <ul className="space-y-3">
            {dados.carreiras.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => abrir(c.id)}
                  className="flex w-full items-center gap-3 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 active:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{c.titulo}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.resumo}</p>
                  </div>
                  <Icone nome="seta" className="h-5 w-5 shrink-0 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
