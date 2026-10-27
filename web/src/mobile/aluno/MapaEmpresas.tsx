import 'leaflet/dist/leaflet.css';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { Badge, Icone, ListRow, avatarCls } from '../../ds';
import { BotaoInteresse } from './Empresas';
import type { EmpresaArea } from './tipos';
import { bairro } from './ui';

const estilo = (e: EmpresaArea) =>
  e.origem === 'PARCEIRA'
    ? { radius: 10, pathOptions: { fillColor: e.interessado ? '#c4623f' : '#1d4b55', color: '#fffdf9', weight: 2, fillOpacity: 1 } }
    : { radius: 7, pathOptions: { fillColor: e.interessado ? '#c4623f' : '#fffdf9', color: '#5d6f72', weight: 2, fillOpacity: 1 } };

export default function MapaEmpresas({
  empresas,
  alternarInteresse,
  filtros,
}: {
  empresas: EmpresaArea[];
  alternarInteresse: (empresa: EmpresaArea) => void;
  filtros: ReactNode;
}) {
  const [selecionadaId, setSelecionadaId] = useState<string>();
  const noMapa = empresas.filter((e) => e.latitude != null && e.longitude != null);
  const selecionada = noMapa.find((e) => e.id === selecionadaId);
  const semLocal = empresas.length - noMapa.length;

  const centro: [number, number] = [
    noMapa.reduce((s, e) => s + e.latitude!, 0) / (noMapa.length || 1),
    noMapa.reduce((s, e) => s + e.longitude!, 0) / (noMapa.length || 1),
  ];

  return (
    <div className="fixed inset-x-0 top-[calc(3.5rem+1px+env(safe-area-inset-top))] bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-10 mx-auto max-w-md">
      {noMapa.length > 0 ? (
        <div className="isolate z-0 h-full">
          <MapContainer center={centro} zoom={noMapa.length > 1 ? 12 : 15} zoomControl={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            {noMapa.map((e) => (
              <CircleMarker key={e.id} center={[e.latitude!, e.longitude!]} {...estilo(e)} eventHandlers={{ click: () => setSelecionadaId(e.id) }} />
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="h-full bg-surface-2" />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 space-y-2 pt-3 pr-14">
        <div className="pointer-events-auto px-4">{filtros}</div>
        <div className="pointer-events-auto flex flex-wrap gap-1.5 px-4">
          <Badge tom="brand">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" /> Parceira
          </Badge>
          <Badge>
            <span className="h-2 w-2 rounded-full bg-surface ring-2 ring-ink-3" /> Fonte externa
          </Badge>
          <Badge tom="accent">
            <span className="h-2.5 w-2.5 rounded-full bg-terracotta-500" /> Com interesse
          </Badge>
        </div>
        {(semLocal > 0 || !noMapa.length) && (
          <p className="px-4 text-xs font-semibold text-ink-2">
            {!noMapa.length
              ? 'Nenhuma empresa deste filtro tem localização. Veja na lista.'
              : `${semLocal === 1 ? '1 empresa sem localização aparece' : `${semLocal} empresas sem localização aparecem`} só na lista.`}
          </p>
        )}
      </div>

      {selecionada && (
        <div className="absolute inset-x-4 bottom-[4.75rem] z-20 rounded-card bg-surface p-4 shadow-raised">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <ListRow
                inicio={
                  <span className={`${avatarCls} ${selecionada.origem === 'PARCEIRA' ? 'bg-brand text-on-brand' : 'bg-surface-2 text-ink-2'}`}>
                    {selecionada.nome.charAt(0).toUpperCase()}
                  </span>
                }
                titulo={selecionada.nome}
                meta={[selecionada.setor, bairro(selecionada.endereco)].filter(Boolean).join(' · ')}
                badges={selecionada.origem === 'PARCEIRA' ? <Badge tom="brand">Parceira do Passo Aberto</Badge> : <Badge>Fonte externa</Badge>}
              />
            </div>
            <button aria-label="Fechar" onClick={() => setSelecionadaId(undefined)} className="-mr-2 rounded-full p-2 text-ink-3 active:bg-surface-2">
              <Icone nome="x" className="h-5 w-5" />
            </button>
          </div>
          <BotaoInteresse empresa={selecionada} alternar={alternarInteresse} />
        </div>
      )}
    </div>
  );
}
