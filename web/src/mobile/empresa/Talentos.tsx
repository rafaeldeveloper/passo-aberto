import { useState } from 'react';
import { api, enviar } from '../../api';
import type { Compatibilidade, Talento } from './tipos';
import { Bloco, Chip, secundarioCls } from './ui';

export const ORDEM: Record<Compatibilidade, number> = { alta: 0, media: 1, baixa: 2 };

const PILULA: Record<Compatibilidade, [string, string]> = {
  alta: ['Alta compatibilidade', 'bg-emerald-50 text-emerald-700'],
  media: ['Média compatibilidade', 'bg-amber-50 text-amber-700'],
  baixa: ['Baixa compatibilidade', 'bg-slate-100 text-slate-600'],
};

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export function CartaoTalento({
  indice,
  talento,
  curso,
  vaga,
  enviado,
  pedir,
}: {
  indice: number;
  talento: Talento;
  curso: string;
  vaga?: string;
  enviado: boolean;
  pedir: () => Promise<void>;
}) {
  const [salvando, setSalvando] = useState(false);
  const [rotulo, cor] = PILULA[talento.compatibilidade];
  const extras = talento.competencias.length - 4;

  const clicar = async () => {
    setSalvando(true);
    await pedir();
    setSalvando(false);
  };

  return (
    <Bloco className="p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800">Talento {indice}</p>
          <p className="text-xs text-slate-500">
            {curso} · conclusão {talento.anoConclusao}
          </p>
          {vaga && <p className="truncate text-xs text-indigo-600">Para: {vaga}</p>}
        </div>
        <Chip cor={cor}>{rotulo}</Chip>
      </div>
      {talento.competencias.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {talento.competencias.slice(0, 4).map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
          {extras > 0 && <Chip cor="bg-white text-slate-500 ring-1 ring-slate-200">+{extras}</Chip>}
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">
        {plural(talento.certificacoes, 'certificação', 'certificações')} · {plural(talento.projetos, 'projeto', 'projetos')}
      </p>
      {enviado ? (
        <p className="mt-3 rounded-xl bg-emerald-50 py-2.5 text-center text-sm font-semibold text-emerald-700">Pedido enviado à escola</p>
      ) : (
        <button disabled={salvando} onClick={clicar} className={`${secundarioCls} mt-3 border-indigo-200 text-indigo-700 disabled:opacity-50`}>
          {salvando ? 'Enviando...' : 'Quero conhecer'}
        </button>
      )}
    </Bloco>
  );
}

export default function Talentos({ token, vagaId, curso, talentos }: { token: string; vagaId: string; curso: string; talentos: Talento[] }) {
  const [enviados, setEnviados] = useState<string[]>([]);
  const [todos, setTodos] = useState(false);
  const ordenados = [...talentos].sort((a, b) => ORDEM[a.compatibilidade] - ORDEM[b.compatibilidade]);
  const visiveis = todos ? ordenados : ordenados.slice(0, 5);

  const pedir = (alunoId: string) =>
    enviar(
      () => api(`/portal/empresa/${token}/vagas/${vagaId}/pedidos`, 'POST', { alunoId }),
      () => setEnviados((e) => [...e, alunoId]),
    );

  return (
    <div className="space-y-2.5 pt-1">
      <div className="px-1">
        <h3 className="text-sm font-semibold text-slate-700">Outros talentos disponíveis ({talentos.length})</h3>
        <p className="text-xs text-slate-500">Perfis anônimos. Ao pedir, a escola é avisada e pode encaminhar o perfil completo.</p>
      </div>
      {visiveis.map((t, i) => (
        <CartaoTalento key={t.id} indice={i + 1} talento={t} curso={curso} enviado={enviados.includes(t.id)} pedir={() => pedir(t.id)} />
      ))}
      {ordenados.length > 5 && (
        <button onClick={() => setTodos(!todos)} className="w-full py-2 text-sm font-semibold text-indigo-600">
          {todos ? 'Ver menos' : `Ver mais (${ordenados.length - 5})`}
        </button>
      )}
    </div>
  );
}
