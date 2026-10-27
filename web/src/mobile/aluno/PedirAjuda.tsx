import { useState } from 'react';
import type { FichaPortal, MotivoAjuda } from './tipos';
import { COORDENACAO, mailtoAjuda } from '../../config';
import { BottomSheet, Icone, btnPrimario, campo } from '../../ds';

const motivos: [MotivoAjuda, string][] = [
  ['oportunidade', 'Entender uma oportunidade'],
  ['curriculo', 'Currículo ou carta de apresentação'],
  ['entrevista', 'Me preparar para uma entrevista'],
  ['outra', 'Outra coisa'],
];

export default function PedirAjuda({
  ficha,
  motivoInicial,
  contexto,
  fechar,
}: {
  ficha: FichaPortal;
  motivoInicial?: MotivoAjuda;
  contexto?: string;
  fechar: () => void;
}) {
  const [motivo, setMotivo] = useState(motivoInicial);
  const [mensagem, setMensagem] = useState(contexto ?? '');

  const enviar = () => {
    const rotulo = motivos.find(([id]) => id === motivo)?.[1];
    if (!rotulo) return;
    const assunto = `Passo Aberto: ${rotulo}`;
    const corpo = [`Olá, ${COORDENACAO}.`, '', mensagem.trim() || rotulo, '', `${ficha.nome} · ${ficha.curso.nome}`].join('\n');
    window.location.href = mailtoAjuda(assunto, corpo);
    fechar();
  };

  return (
    <BottomSheet titulo="Pedir ajuda" aberta fechar={fechar}>
      <div className="space-y-4">
        <p className="text-ink-2">{COORDENACAO} respondem assim que puderem. O atendimento depende da capacidade do piloto.</p>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-semibold">Com o que você precisa de ajuda?</legend>
          {motivos.map(([id, rotulo]) => (
            <label
              key={id}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md px-4 ${motivo === id ? 'bg-accent-soft/40 ring-2 ring-accent' : 'ring-1 ring-line'}`}
            >
              <input type="radio" name="motivo" value={id} checked={motivo === id} onChange={() => setMotivo(id)} className="h-4 w-4 accent-accent" />
              <span className="font-medium">{rotulo}</span>
            </label>
          ))}
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Conte um pouco (opcional)</span>
          <textarea rows={4} value={mensagem} onChange={(e) => setMensagem(e.target.value)} className={`${campo} min-h-28`} />
        </label>

        <p className="flex items-start gap-2 text-sm text-ink-3">
          <Icone nome="cadeado" className="mt-0.5 h-4 w-4 shrink-0" />
          Só a coordenação vê seu pedido. Ao enviar, seu aplicativo de e-mail abre com a mensagem pronta.
        </p>

        <button onClick={enviar} disabled={!motivo} className={btnPrimario}>
          Enviar pedido
        </button>

        <div className="rounded-md bg-surface-2 px-4 py-3" aria-disabled="true">
          <p className="flex items-center justify-between gap-2 text-sm font-semibold text-ink-3">
            Criar currículo com IA
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink-3 ring-1 ring-line">em breve</span>
          </p>
          <p className="mt-1 text-xs text-ink-3">Opcional. Não é preciso ter currículo para pedir ajuda.</p>
        </div>
      </div>
    </BottomSheet>
  );
}
