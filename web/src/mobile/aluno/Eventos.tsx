import { TIPOS_EVENTO } from '../../tipos';
import type { FichaPortal } from './tipos';
import { Bloco, DataEvento, Pilula, Vazio, dataCurta, dataHora } from './ui';

export default function Eventos({ ficha }: { ficha: FichaPortal }) {
  return (
    <div className="space-y-4">
      <h1 className="px-1 text-2xl font-bold text-slate-800">Eventos</h1>

      <Bloco titulo="Próximos eventos">
        {ficha.proximosEventos.length === 0 ? (
          <Vazio>Nenhum evento marcado por enquanto.</Vazio>
        ) : (
          <ul className="space-y-5">
            {ficha.proximosEventos.map((e) => (
              <li key={e.id} className="flex gap-4">
                <DataEvento iso={e.data} />
                <div className="min-w-0 flex-1">
                  <Pilula cor="bg-sky-50 text-sky-800">{TIPOS_EVENTO[e.tipo]}</Pilula>
                  <p className="mt-1 font-semibold text-slate-800">{e.titulo}</p>
                  <p className="text-sm text-slate-500">
                    {dataHora(e.data)}
                    {e.local && ` · ${e.local}`}
                  </p>
                  {e.mentor && (
                    <p className="mt-1 text-sm text-slate-600">
                      Com <strong className="font-medium">{e.mentor.nome}</strong>, {e.mentor.profissao}
                    </p>
                  )}
                  {e.descricao && <p className="mt-2 text-sm text-slate-600">{e.descricao}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Bloco titulo="Eventos que participei">
        {ficha.presencas.length === 0 ? (
          <Vazio>Sua participação aparece aqui depois de cada evento.</Vazio>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ficha.presencas.map(({ evento }) => (
              <li key={evento.id} className="py-3">
                <p className="font-medium text-slate-800">{evento.titulo}</p>
                <p className="text-sm text-slate-500">
                  {TIPOS_EVENTO[evento.tipo]} · {dataCurta(evento.data)}
                  {evento.local && ` · ${evento.local}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Bloco>
    </div>
  );
}
