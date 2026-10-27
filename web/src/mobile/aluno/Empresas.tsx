import { lazy, Suspense, useState } from 'react';
import { COORDENACAO } from '../../config';
import { Chip, EmptyState, Icone, ListRow, SourceBadge, avatarCls, btnFantasma, btnPeq, btnSecundario, campo, chipsCls, listaCls } from '../../ds';
import type { EmpresaArea } from './tipos';
import { bairro, normalizar, origemFonte } from './ui';

const filtros = [
  ['TODAS', 'Todas'],
  ['PARCEIRA', 'Parceiras'],
  ['SCOUT', 'Fontes externas'],
  ['INTERESSE', 'Com interesse'],
] as const;

type Filtro = (typeof filtros)[number][0];

const MapaEmpresas = lazy(() => import('./MapaEmpresas'));

const POR_PAGINA = 20;

const urlSite = (site: string) => (/^https?:\/\//i.test(site) ? site : `https://${site}`);

const urlMapa = (lat: number, lon: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;

const passa = (e: EmpresaArea, filtro: Filtro) => filtro === 'TODAS' || (filtro === 'INTERESSE' ? e.interessado : e.origem === filtro);

export function BotaoInteresse({ empresa, alternar, curto }: { empresa: EmpresaArea; alternar: (empresa: EmpresaArea) => void; curto?: boolean }) {
  return (
    <button
      onClick={() => alternar(empresa)}
      aria-pressed={empresa.interessado}
      className={
        empresa.interessado
          ? 'inline-flex min-h-9 items-center gap-1 rounded-full bg-brand-soft px-3 text-sm font-semibold text-brand-ink'
          : `${btnSecundario} ${btnPeq}`
      }
    >
      {empresa.interessado && <Icone nome="check" className="h-4 w-4" />}
      {empresa.interessado ? (curto ? 'Enviado' : 'Interesse enviado') : 'Tenho interesse'}
    </button>
  );
}

export function FiltrosEmpresas({ filtro, setFiltro, empresas }: { filtro: Filtro; setFiltro: (f: Filtro) => void; empresas: EmpresaArea[] }) {
  return (
    <div className={chipsCls}>
      {filtros.map(([id, rotulo]) => (
        <Chip key={id} ativo={filtro === id} onClick={() => setFiltro(id)} contador={empresas.filter((e) => passa(e, id)).length}>
          {rotulo}
        </Chip>
      ))}
    </div>
  );
}

export default function Empresas({
  empresas,
  alternarInteresse,
  modo,
  setModo,
}: {
  empresas?: EmpresaArea[];
  alternarInteresse: (empresa: EmpresaArea) => void;
  modo: 'lista' | 'mapa';
  setModo: (modo: 'lista' | 'mapa') => void;
}) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODAS');
  const [limite, setLimite] = useState(POR_PAGINA);

  const termo = normalizar(busca);
  const daBusca = (empresas ?? []).filter((e) => !termo || normalizar(`${e.nome} ${e.endereco ?? ''}`).includes(termo));
  const visiveis = daBusca.filter((e) => passa(e, filtro));
  const temScout = empresas?.some((e) => e.origem === 'SCOUT');

  const filtrar = (f: Filtro) => {
    setFiltro(f);
    setLimite(POR_PAGINA);
  };

  const alternarModo = () => {
    setModo(modo === 'lista' ? 'mapa' : 'lista');
    window.scrollTo({ top: 0 });
  };

  const toggle = !!empresas?.length && (
    <button
      onClick={alternarModo}
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-30 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-canvas shadow-raised"
    >
      <Icone nome={modo === 'lista' ? 'mapa' : 'lista'} className="h-4 w-4" />
      {modo === 'lista' ? 'Mapa' : 'Lista'}
    </button>
  );

  if (modo === 'mapa')
    return (
      <>
        <Suspense fallback={<p className="py-10 text-center text-sm text-ink-3">Carregando mapa...</p>}>
          <MapaEmpresas
            empresas={visiveis}
            alternarInteresse={alternarInteresse}
            filtros={<FiltrosEmpresas filtro={filtro} setFiltro={filtrar} empresas={daBusca} />}
          />
        </Suspense>
        {toggle}
      </>
    );

  return (
    <section className="pb-16">
      <h2 className="mb-1 text-lg font-semibold">Oportunidades e empresas</h2>
      <p className="mb-4 text-sm text-ink-3">Seu interesse ajuda {COORDENACAO} a buscar novas parcerias. O contato com as empresas é feito por eles.</p>

      <div className="relative mb-3">
        <Icone nome="busca" className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-3" />
        <input
          type="search"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setLimite(POR_PAGINA);
          }}
          placeholder="Buscar por nome ou bairro"
          aria-label="Buscar empresas"
          className={`${campo} pl-11`}
        />
      </div>

      <div className="mb-4">
        <FiltrosEmpresas filtro={filtro} setFiltro={filtrar} empresas={daBusca} />
      </div>

      {!empresas ? (
        <p className="py-6 text-center text-sm text-ink-3">Carregando empresas...</p>
      ) : visiveis.length === 0 ? (
        <EmptyState icone="busca" titulo={empresas.length ? 'Nenhuma empresa encontrada' : 'Ainda não há empresas da sua área'}>
          {empresas.length
            ? 'Tente outro nome, bairro ou filtro.'
            : `Quando ${COORDENACAO} encontrarem empresas e oportunidades do seu curso, elas aparecem aqui.`}
        </EmptyState>
      ) : (
        <>
          <ul className={`${listaCls} rounded-card bg-surface px-4 shadow-card ring-1 ring-line`}>
            {visiveis.slice(0, limite).map((e) => (
              <li key={e.id} className="py-1">
                <ListRow
                  inicio={
                    <span className={`${avatarCls} ${e.origem === 'PARCEIRA' ? 'bg-brand text-on-brand' : 'bg-surface-2 text-ink-2'}`}>
                      {e.nome.charAt(0).toUpperCase()}
                    </span>
                  }
                  titulo={e.nome}
                  meta={[e.setor, bairro(e.endereco)].filter(Boolean).join(' · ')}
                  badges={<SourceBadge origem={origemFonte(e.origem)} />}
                />
                <div className="-mt-1 flex flex-wrap items-center gap-x-1 gap-y-2 pb-3 pl-13">
                  <BotaoInteresse empresa={e} alternar={alternarInteresse} />
                  {e.site && (
                    <a href={urlSite(e.site)} target="_blank" rel="noreferrer" className={btnFantasma}>
                      Site
                    </a>
                  )}
                  {e.latitude != null && e.longitude != null && (
                    <a href={urlMapa(e.latitude, e.longitude)} target="_blank" rel="noreferrer" className={btnFantasma}>
                      Ver no mapa
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {limite < visiveis.length && (
            <button onClick={() => setLimite(limite + POR_PAGINA)} className={`${btnSecundario} mt-4 w-full`}>
              Ver mais ({visiveis.length - limite} restantes)
            </button>
          )}
        </>
      )}

      {temScout && <p className="mt-4 text-center text-xs text-ink-3">Dados de empresas: © OpenStreetMap contributors</p>}
      {toggle}
    </section>
  );
}
