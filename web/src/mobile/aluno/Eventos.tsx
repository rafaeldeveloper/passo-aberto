import { COORDENACAO } from '../../config';
import { Badge, Card, EmptyState, listaCls } from '../../ds';
import { TIPOS_EVENTO } from '../../tipos';
import type { FichaPortal } from './tipos';
import { DataEvento, dataCurta, dataHora } from './ui';

export default function Eventos({ ficha }: { ficha: FichaPortal }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-sm text-ink-3">Encontros presenciais, visitas e mentorias do projeto.</p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Próximos encontros</h2>
        {ficha.proximosEventos.length === 0 ? (
          <EmptyState icone="agenda" titulo="Nenhum encontro marcado">
            Quando {COORDENACAO} marcarem um encontro ou mentoria, ele aparece aqui.
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {ficha.proximosEventos.map((e) => (
              <li key={e.id}>
                <Card className="flex gap-4">
                  <DataEvento iso={e.data} />
                  <div className="min-w-0 flex-1">
                    <Badge tom="brand">{TIPOS_EVENTO[e.tipo]}</Badge>
                    <p className="mt-1 text-lg font-semibold">{e.titulo}</p>
                    <p className="text-sm text-ink-3">
                      {dataHora(e.data)}
                      {e.local && ` · ${e.local}`}
                    </p>
                    {e.mentor && (
                      <p className="mt-1 text-sm text-ink-2">
                        Com <strong className="font-semibold">{e.mentor.nome}</strong>, {e.mentor.profissao}
                      </p>
                    )}
                    {e.descricao && <p className="mt-2 text-sm text-ink-2">{e.descricao}</p>}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Card titulo="Encontros que participei">
        {ficha.presencas.length === 0 ? (
          <p className="text-sm text-ink-3">Sua participação aparece aqui depois de cada encontro.</p>
        ) : (
          <ul className={listaCls}>
            {ficha.presencas.map(({ evento }) => (
              <li key={evento.id} className="py-3">
                <p className="font-semibold">{evento.titulo}</p>
                <p className="text-sm text-ink-3">
                  {TIPOS_EVENTO[evento.tipo]} · {dataCurta(evento.data)}
                  {evento.local && ` · ${evento.local}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
