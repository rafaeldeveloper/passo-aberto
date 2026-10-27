import { useState } from 'react';
import { api, enviar } from '../../api';
import { COORDENACAO } from '../../config';
import type { TomBadge } from '../../ds';
import { Badge, btnFantasma, Card, Icone } from '../../ds';
import type { Compatibilidade, Talento } from './tipos';
import { Etiqueta, secundarioCls } from './ui';

export const ORDEM: Record<Compatibilidade, number> = { alta: 0, media: 1, baixa: 2 };

const PILULA: Record<Compatibilidade, [string, TomBadge]> = {
  alta: ['Alta compatibilidade', 'success'],
  media: ['Média compatibilidade', 'warning'],
  baixa: ['Baixa compatibilidade', 'neutral'],
};

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export function AvisoAnonimo() {
  return (
    <p className="flex items-start gap-2 text-sm text-ink-3">
      <Icone nome="cadeado" className="mt-0.5 h-4 w-4 shrink-0" />
      Perfis anônimos até {COORDENACAO} apresentarem.
    </p>
  );
}

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
  const [rotulo, tom] = PILULA[talento.compatibilidade];
  const extras = talento.competencias.length - 4;

  const clicar = async () => {
    setSalvando(true);
    await pedir();
    setSalvando(false);
  };

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-3">
          <Icone nome="pessoa" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Talento {indice}</p>
          <p className="text-sm text-ink-3">
            {curso} · conclusão {talento.anoConclusao}
          </p>
          {vaga && <p className="truncate text-xs font-semibold text-accent-ink">Para: {vaga}</p>}
        </div>
      </div>
      <div className="mt-3">
        <Badge tom={tom}>{rotulo}</Badge>
      </div>
      {talento.competencias.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {talento.competencias.slice(0, 4).map((c) => (
            <Etiqueta key={c}>{c}</Etiqueta>
          ))}
          {extras > 0 && <Etiqueta>+{extras}</Etiqueta>}
        </div>
      )}
      <p className="mt-2 text-xs text-ink-3">
        {plural(talento.certificacoes, 'certificação', 'certificações')} · {plural(talento.projetos, 'projeto', 'projetos')}
      </p>
      {enviado ? (
        <p className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-soft text-sm font-semibold text-brand-ink">
          <Icone nome="check" className="h-4 w-4" />
          Pedido enviado a {COORDENACAO}
        </p>
      ) : (
        <button disabled={salvando} onClick={clicar} className={`${secundarioCls} mt-3`}>
          {salvando ? 'Enviando...' : 'Quero conhecer'}
        </button>
      )}
    </Card>
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
    <div className="space-y-3 pt-1">
      <div>
        <h3 className="font-semibold">Perfis próximos desta vaga ({talentos.length})</h3>
        <p className="mt-1 text-sm text-ink-3">Ao tocar em "Quero conhecer", {COORDENACAO} recebem o pedido e podem apresentar o perfil completo.</p>
      </div>
      {visiveis.map((t, i) => (
        <CartaoTalento key={t.id} indice={i + 1} talento={t} curso={curso} enviado={enviados.includes(t.id)} pedir={() => pedir(t.id)} />
      ))}
      {ordenados.length > 5 && (
        <button onClick={() => setTodos(!todos)} className={`${btnFantasma} w-full`}>
          {todos ? 'Ver menos' : `Ver mais (${ordenados.length - 5})`}
        </button>
      )}
    </div>
  );
}
