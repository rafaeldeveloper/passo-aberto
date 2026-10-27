import { TIPOS_EVENTO } from '../../tipos';
import { SeloSituacao } from '../../ui';
import type { Aba, Carreiras, EmpresaArea, FichaPortal } from './tipos';
import { Bloco, DataEvento, Icone, Pilula, Progresso, dataCurta, dataHora } from './ui';

const NA_PREVIA = 4;

const prioridade = (e: EmpresaArea) => (e.origem === 'PARCEIRA' ? 0 : e.interessado ? 1 : e.site || e.endereco ? 2 : 3);

const bairro = (endereco?: string | null) => endereco?.split(' - ').pop();

export default function Inicio({
  ficha,
  empresas,
  carreiras,
  irPara,
  alternarInteresse,
}: {
  ficha: FichaPortal;
  empresas?: EmpresaArea[];
  carreiras?: Carreiras;
  irPara: (aba: Aba) => void;
  alternarInteresse: (empresa: EmpresaArea) => void;
}) {
  const estagio = ficha.estagios.find((e) => e.status === 'EM_ANDAMENTO');
  const evento = ficha.proximosEventos[0];
  const checklist = [
    ['Escreva um resumo sobre você', !!ficha.resumo?.trim()],
    ['Adicione pelo menos 3 competências', ficha.competencias.length >= 3],
    ['Cadastre 1 certificação', ficha.certificacoes.length > 0],
    ['Mostre 1 projeto seu', ficha.projetos.length > 0],
  ] as const;
  const feitos = checklist.filter(([, ok]) => ok).length;
  const emAndamento = ficha.indicacoes.filter((i) => i.status !== 'DESCARTADO').length;
  const previa = [...(empresas ?? [])].sort((a, b) => prioridade(a) - prioridade(b)).slice(0, NA_PREVIA);
  const novidade = carreiras?.novidades[0];

  return (
    <div className="space-y-4">
      <header className="rounded-3xl bg-gradient-to-br from-teal-600 to-sky-700 p-6 text-white shadow-md">
        <p className="text-sm text-teal-100">Olá,</p>
        <h1 className="text-2xl font-bold">{ficha.nome.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-teal-50">
          {ficha.curso.nome} · Turma {ficha.turma} · {ficha.anoConclusao}
        </p>
        <div className="mt-3">
          <SeloSituacao situacao={ficha.situacao} />
        </div>
      </header>

      {estagio && (
        <Bloco titulo="Seu estágio">
          <p className="text-lg font-semibold text-slate-800">{estagio.empresa.nome}</p>
          <p className="mb-4 text-sm text-slate-500">
            Desde {dataCurta(estagio.inicio)}
            {estagio.supervisorNome && ` · Supervisão: ${estagio.supervisorNome}`}
          </p>
          <Progresso atual={estagio.cargaHorariaCumprida} total={estagio.cargaHorariaPrevista} />
        </Bloco>
      )}

      {feitos < checklist.length && (
        <Bloco titulo="Complete sua ficha" acao={<span className="text-sm font-semibold text-teal-700">{feitos}/{checklist.length}</span>}>
          <p className="mb-3 text-sm text-slate-500">Uma ficha completa ajuda a coordenação a te indicar para as vagas certas.</p>
          <ul className="space-y-1">
            {checklist.map(([texto, ok]) => (
              <li key={texto}>
                <button
                  onClick={() => irPara('ficha')}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left active:bg-slate-50"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ok ? 'bg-teal-500 text-white' : 'border-2 border-slate-200'}`}
                  >
                    {ok && <Icone nome="check" className="h-4 w-4" />}
                  </span>
                  <span className={`flex-1 text-sm ${ok ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{texto}</span>
                  {!ok && <Icone nome="seta" className="h-4 w-4 text-slate-300" />}
                </button>
              </li>
            ))}
          </ul>
        </Bloco>
      )}

      <Bloco
        titulo="Oportunidades para você"
        acao={
          !!empresas?.length && (
            <button onClick={() => irPara('oportunidades')} className="text-sm font-semibold text-teal-700">
              Ver todas
            </button>
          )
        }
      >
        {emAndamento > 0 && (
          <button
            onClick={() => irPara('oportunidades')}
            className="mb-3 flex w-full items-center justify-between rounded-2xl bg-teal-50 px-4 py-3 text-left text-sm font-medium text-teal-800 active:bg-teal-100"
          >
            {emAndamento === 1 ? '1 indicação em andamento' : `${emAndamento} indicações em andamento`}
            <Icone nome="seta" className="h-4 w-4" />
          </button>
        )}
        {!empresas ? (
          <p className="text-sm text-slate-500">Carregando empresas...</p>
        ) : !previa.length ? (
          <p className="text-sm text-slate-500">Ainda não encontramos empresas da sua área.</p>
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {previa.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${e.origem === 'PARCEIRA' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {e.nome.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">{e.nome}</p>
                    <p className="truncate text-xs text-slate-500">{[e.setor, bairro(e.endereco)].filter(Boolean).join(' · ')}</p>
                    {e.origem === 'PARCEIRA' && (
                      <div className="mt-1">
                        <Pilula cor="bg-teal-50 text-teal-700">Parceira do Passo Aberto</Pilula>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => alternarInteresse(e)}
                    aria-pressed={e.interessado}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${e.interessado ? 'bg-teal-600 text-white' : 'text-teal-700 ring-1 ring-teal-200 active:bg-teal-50'}`}
                  >
                    {e.interessado ? 'Interesse enviado' : 'Tenho interesse'}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => irPara('oportunidades')}
              className="mt-2 w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 active:bg-slate-200"
            >
              Ver todas as {empresas.length} empresas
            </button>
          </>
        )}
      </Bloco>

      {novidade && (
        <button onClick={() => irPara('carreiras')} className="block w-full rounded-3xl bg-sky-50 p-5 text-left active:bg-sky-100">
          <p className="text-xs font-semibold tracking-wide text-sky-700 uppercase">Novidade{novidade.carreira && ` · ${novidade.carreira.titulo}`}</p>
          <p className="font-semibold text-slate-800">{novidade.titulo}</p>
          <p className="mt-1 text-sm font-semibold text-teal-700">Ver carreiras</p>
        </button>
      )}

      <Bloco
        titulo="Próximo evento"
        acao={
          ficha.proximosEventos.length > 1 && (
            <button onClick={() => irPara('eventos')} className="text-sm font-semibold text-teal-700">
              Ver todos
            </button>
          )
        }
      >
        {evento ? (
          <div className="flex gap-4">
            <DataEvento iso={evento.data} />
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-sky-700 uppercase">{TIPOS_EVENTO[evento.tipo]}</p>
              <p className="font-semibold text-slate-800">{evento.titulo}</p>
              <p className="text-sm text-slate-500">
                {dataHora(evento.data)}
                {evento.local && ` · ${evento.local}`}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nenhum evento marcado por enquanto. Fique de olho!</p>
        )}
      </Bloco>
    </div>
  );
}
