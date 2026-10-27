import { COORDENACAO } from '../../config';
import { Card, Checklist, ListRow, SourceBadge, StatusTimeline, avatarCls, btnFantasma, listaCls } from '../../ds';
import { TIPOS_EVENTO } from '../../tipos';
import type { Aba, Carreiras, EmpresaArea, FichaPortal, PedirAjuda } from './tipos';
import { linhaIndicacao } from './tipos';
import { DataEvento, bairro, dataHora, origemFonte } from './ui';
import { BotaoInteresse } from './Empresas';

const NA_PREVIA = 3;

const prioridade = (e: EmpresaArea) => (e.origem === 'PARCEIRA' ? 0 : e.interessado ? 1 : e.site || e.endereco ? 2 : 3);

export default function Inicio({
  ficha,
  empresas,
  carreiras,
  irPara,
  alternarInteresse,
  pedirAjuda,
}: {
  ficha: FichaPortal;
  empresas?: EmpresaArea[];
  carreiras?: Carreiras;
  irPara: (aba: Aba) => void;
  alternarInteresse: (empresa: EmpresaArea) => void;
  pedirAjuda: PedirAjuda;
}) {
  const evento = ficha.proximosEventos[0];
  const irParaEu = () => irPara('eu');
  const checklist = [
    { texto: 'Escreva um resumo sobre você', feito: !!ficha.resumo?.trim(), onClick: irParaEu },
    { texto: 'Adicione pelo menos 3 competências', feito: ficha.competencias.length >= 3, onClick: irParaEu },
    { texto: 'Cadastre 1 certificação', feito: ficha.certificacoes.length > 0, onClick: irParaEu },
    { texto: 'Mostre 1 projeto seu', feito: ficha.projetos.length > 0, onClick: irParaEu },
  ];
  const perfilCompleto = checklist.every((i) => i.feito);
  const indicacao = ficha.indicacoes.find((i) => i.status !== 'DESCARTADO' && i.status !== 'CONTRATADO');
  const previa = [...(empresas ?? [])].sort((a, b) => prioridade(a) - prioridade(b)).slice(0, NA_PREVIA);
  const novidade = carreiras?.novidades[0];
  const iniciais = COORDENACAO.split(' e ').map((n) => n.charAt(0));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Olá, {ficha.nome.split(' ')[0]}</h1>
        <p className="text-sm text-ink-3">
          {ficha.curso.nome} · conclusão {ficha.anoConclusao}
        </p>
      </header>

      {indicacao ? (
        <Card
          titulo="Seu próximo passo"
          acao={
            <button onClick={() => irPara('trabalhar')} className="text-sm font-semibold text-accent-ink">
              Ver em Trabalhar
            </button>
          }
        >
          {indicacao.vaga && (
            <p className="mb-3 text-sm text-ink-2">
              <span className="font-semibold text-ink">{indicacao.vaga.titulo}</span> · {indicacao.vaga.empresa.nome}
            </p>
          )}
          <StatusTimeline {...linhaIndicacao(indicacao.status)} compacto />
        </Card>
      ) : (
        !perfilCompleto && (
          <Card>
            <Checklist titulo="Prepare seu perfil" itens={checklist} />
            <p className="mt-2 text-sm text-ink-3">Com o perfil completo, {COORDENACAO} conseguem te apresentar às oportunidades certas.</p>
          </Card>
        )
      )}

      <Card tom="brand">
        <div className="mb-3 flex -space-x-2" aria-hidden="true">
          {iniciais.map((l) => (
            <span key={l} className="grid h-9 w-9 place-items-center rounded-full bg-petrol-600 text-sm font-bold ring-2 ring-brand">
              {l}
            </span>
          ))}
        </div>
        <p className="text-lg font-semibold">Ajuda de gente de verdade</p>
        <p className="mt-1 text-sm opacity-90">Quer ajuda com currículo, entrevista ou para entender uma vaga? Fale com {COORDENACAO}.</p>
        <button onClick={() => pedirAjuda()} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-canvas px-5 font-bold text-brand-ink">
          Pedir ajuda
        </button>
      </Card>

      <Card titulo="Oportunidades para você">
        {!empresas ? (
          <p className="text-sm text-ink-3">Carregando oportunidades...</p>
        ) : !previa.length ? (
          <p className="text-sm text-ink-3">Ainda não encontramos empresas da sua área. {COORDENACAO} seguem buscando.</p>
        ) : (
          <>
            <ul className={listaCls}>
              {previa.map((e) => (
                <li key={e.id}>
                  <ListRow
                    inicio={
                      <span className={`${avatarCls} ${e.origem === 'PARCEIRA' ? 'bg-brand text-on-brand' : 'bg-surface-2 text-ink-2'}`}>
                        {e.nome.charAt(0).toUpperCase()}
                      </span>
                    }
                    titulo={e.nome}
                    meta={[e.setor, bairro(e.endereco)].filter(Boolean).join(' · ')}
                    badges={<SourceBadge origem={origemFonte(e.origem)} />}
                    fim={<BotaoInteresse empresa={e} alternar={alternarInteresse} curto />}
                  />
                </li>
              ))}
            </ul>
            <button onClick={() => irPara('trabalhar')} className={`${btnFantasma} -ml-3 mt-1`}>
              Ver todas em Trabalhar
            </button>
          </>
        )}
      </Card>

      {novidade && (
        <Card tom="sand">
          <p className="text-xs font-semibold tracking-wide text-accent-ink uppercase">Para descobrir{novidade.carreira && ` · ${novidade.carreira.titulo}`}</p>
          <p className="mt-1 font-semibold">{novidade.titulo}</p>
          <p className="mt-1 line-clamp-2 text-sm text-ink-2">{novidade.texto}</p>
          <button onClick={() => irPara('caminhos')} className={`${btnFantasma} -ml-3 mt-1`}>
            Ver caminhos
          </button>
        </Card>
      )}

      <Card
        titulo="Próximo encontro"
        acao={
          ficha.proximosEventos.length > 1 && (
            <button onClick={() => irPara('agenda')} className="text-sm font-semibold text-accent-ink">
              Ver agenda
            </button>
          )
        }
      >
        {evento ? (
          <ListRow
            inicio={<DataEvento iso={evento.data} />}
            titulo={evento.titulo}
            meta={[TIPOS_EVENTO[evento.tipo], dataHora(evento.data), evento.local].filter(Boolean).join(' · ')}
          />
        ) : (
          <p className="text-sm text-ink-3">Nenhum encontro marcado por enquanto. Quando houver, ele aparece aqui.</p>
        )}
      </Card>
    </div>
  );
}
