import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import type { EmpresaArea } from './tipos';
import { Pilula, Vazio } from './ui';

export default function MapaEmpresas({ empresas, alternarInteresse }: { empresas: EmpresaArea[]; alternarInteresse: (empresa: EmpresaArea) => void }) {
  const noMapa = empresas.filter((e) => e.latitude != null && e.longitude != null);
  if (!noMapa.length) return <Vazio>Nenhuma empresa com localização para mostrar no mapa.</Vazio>;

  const centro: [number, number] = [
    noMapa.reduce((s, e) => s + e.latitude!, 0) / noMapa.length,
    noMapa.reduce((s, e) => s + e.longitude!, 0) / noMapa.length,
  ];

  return (
    <div>
      <div className="isolate z-0 h-[60vh] overflow-hidden rounded-2xl ring-1 ring-slate-200">
        <MapContainer center={centro} zoom={noMapa.length > 1 ? 12 : 15} className="h-full w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {noMapa.map((e) => (
            <CircleMarker
              key={e.id}
              center={[e.latitude!, e.longitude!]}
              radius={e.origem === 'PARCEIRA' ? 10 : 7}
              pathOptions={
                e.origem === 'PARCEIRA'
                  ? { color: '#0f766e', fillColor: '#14b8a6', fillOpacity: 0.9, weight: 2 }
                  : { color: '#475569', fillColor: e.interessado ? '#0ea5e9' : '#94a3b8', fillOpacity: 0.8, weight: 1 }
              }
            >
              <Popup>
                <div className="space-y-1">
                  {e.origem === 'PARCEIRA' ? <Pilula cor="bg-teal-600 text-white">Parceira da escola</Pilula> : <Pilula>Ainda não é parceira</Pilula>}
                  <p className="!m-0 font-semibold text-slate-800">{e.nome}</p>
                  {e.setor && <p className="!m-0 text-xs text-slate-600">{e.setor}</p>}
                  {e.endereco && <p className="!m-0 text-xs text-slate-500">{e.endereco}</p>}
                  <button
                    onClick={() => alternarInteresse(e)}
                    className={`mt-1 rounded-full px-3 py-1.5 text-xs font-semibold ${e.interessado ? 'bg-teal-600 text-white' : 'text-teal-700 ring-1 ring-teal-200'}`}
                  >
                    {e.interessado ? 'Interesse enviado' : 'Tenho interesse'}
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-teal-500 ring-2 ring-teal-700" /> Parceira da escola
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Ainda não é parceira
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Você tem interesse
        </span>
      </div>
      {noMapa.length < empresas.length && (
        <p className="mt-1 text-xs text-slate-400">
          {empresas.length - noMapa.length === 1 ? '1 empresa sem localização aparece' : `${empresas.length - noMapa.length} empresas sem localização aparecem`} só na lista.
        </p>
      )}
    </div>
  );
}
