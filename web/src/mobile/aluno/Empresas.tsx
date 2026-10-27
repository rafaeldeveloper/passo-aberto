import { lazy, Suspense, useState } from 'react';
import type { EmpresaArea } from './tipos';
import { Bloco, Icone, Pilula, Vazio, campoCls, normalizar } from './ui';

const filtros = [
  ['TODAS', 'Todas'],
  ['PARCEIRA', 'Parceiras'],
  ['SCOUT', 'Ainda não parceiras'],
] as const;

type Filtro = (typeof filtros)[number][0];

const MapaEmpresas = lazy(() => import('./MapaEmpresas'));

const POR_PAGINA = 20;

const urlSite = (site: string) => (/^https?:\/\//i.test(site) ? site : `https://${site}`);

const urlMapa = (lat: number, lon: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;

export default function Empresas({
  empresas,
  alternarInteresse,
}: {
  empresas?: EmpresaArea[];
  alternarInteresse: (empresa: EmpresaArea) => void;
}) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODAS');
  const [limite, setLimite] = useState(POR_PAGINA);
  const [modo, setModo] = useState<'lista' | 'mapa'>('lista');

  const termo = normalizar(busca);
  const visiveis = (empresas ?? []).filter(
    (e) => (filtro === 'TODAS' || e.origem === filtro) && (!termo || normalizar(`${e.nome} ${e.endereco ?? ''}`).includes(termo)),
  );
  const temScout = empresas?.some((e) => e.origem === 'SCOUT');

  return (
    <Bloco titulo="Empresas da sua área">
      <p className="mb-4 text-sm text-slate-500">
        Seu interesse ajuda a coordenação a buscar novas parcerias. O contato com as empresas é feito pela coordenação.
      </p>

      <div className="relative mb-3">
        <Icone nome="busca" className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setLimite(POR_PAGINA);
          }}
          placeholder="Buscar por nome ou bairro"
          className={`${campoCls} pl-11`}
        />
      </div>

      <div className="mb-3 grid grid-cols-2 rounded-full bg-slate-100 p-1">
        {(['lista', 'mapa'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModo(m)}
            className={`rounded-full py-2 text-sm font-semibold ${modo === m ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}
          >
            {m === 'lista' ? 'Lista' : 'Mapa'}
          </button>
        ))}
      </div>

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {filtros.map(([id, rotulo]) => (
          <button
            key={id}
            onClick={() => {
              setFiltro(id);
              setLimite(POR_PAGINA);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${filtro === id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 active:bg-slate-200'}`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {!empresas ? (
        <Vazio>Carregando empresas...</Vazio>
      ) : visiveis.length === 0 ? (
        <Vazio>Nenhuma empresa encontrada.</Vazio>
      ) : modo === 'mapa' ? (
        <Suspense fallback={<Vazio>Carregando mapa...</Vazio>}>
          <MapaEmpresas empresas={visiveis} alternarInteresse={alternarInteresse} />
        </Suspense>
      ) : (
        <>
          <p className="mb-2 text-xs text-slate-400">
            {visiveis.length} {visiveis.length === 1 ? 'empresa' : 'empresas'}
          </p>
          <ul className="space-y-3">
            {visiveis.slice(0, limite).map((e) => (
              <li key={e.id} className={`rounded-2xl border p-4 ${e.origem === 'PARCEIRA' ? 'border-teal-200 bg-teal-50/40' : 'border-slate-100'}`}>
                {e.origem === 'PARCEIRA' ? (
                  <Pilula cor="bg-teal-600 text-white">Parceira do Passo Aberto</Pilula>
                ) : (
                  <Pilula>Ainda não é parceira</Pilula>
                )}
                <p className="mt-2 font-semibold text-slate-800">{e.nome}</p>
                {e.setor && <p className="text-sm text-slate-600">{e.setor}</p>}
                {e.endereco && <p className="text-sm text-slate-500">{e.endereco}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button
                    onClick={() => alternarInteresse(e)}
                    aria-pressed={e.interessado}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${e.interessado ? 'bg-teal-600 text-white active:bg-teal-700' : 'bg-white text-teal-700 ring-1 ring-teal-200 active:bg-teal-50'}`}
                  >
                    {e.interessado ? 'Interesse enviado' : 'Tenho interesse'}
                  </button>
                  {e.site && (
                    <a href={urlSite(e.site)} target="_blank" rel="noreferrer" className="text-sm font-medium text-sky-700">
                      Site
                    </a>
                  )}
                  {e.latitude != null && e.longitude != null && (
                    <a href={urlMapa(e.latitude, e.longitude)} target="_blank" rel="noreferrer" className="text-sm font-medium text-sky-700">
                      Ver no mapa
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {limite < visiveis.length && (
            <button onClick={() => setLimite(limite + POR_PAGINA)} className="mt-4 w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 active:bg-slate-200">
              Ver mais ({visiveis.length - limite} restantes)
            </button>
          )}
        </>
      )}

      {temScout && <p className="mt-4 text-center text-xs text-slate-400">Dados de empresas: © OpenStreetMap contributors</p>}
    </Bloco>
  );
}
