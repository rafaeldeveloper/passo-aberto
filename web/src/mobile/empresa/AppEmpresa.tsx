import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useApi } from '../../api';
import Candidatos from './Candidatos';
import Estagiarios from './Estagiarios';
import Inicio from './Inicio';
import type { PainelEmpresa } from './tipos';
import Vagas from './Vagas';

type Aba = 'inicio' | 'vagas' | 'candidatos' | 'estagiarios';

function LinkInvalido() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-700">P</div>
        <h1 className="text-xl font-semibold text-slate-800">Link inválido</h1>
        <p className="mt-2 text-slate-600">Este link de acesso não é válido ou expirou. Fale com a coordenação do Passo Aberto para receber um novo.</p>
      </div>
    </div>
  );
}

export default function AppEmpresa() {
  const { token = '' } = useParams();
  const { dados, erro, recarregar } = useApi<PainelEmpresa>(`/portal/empresa/${token}`);
  const [aba, setAba] = useState<Aba>('inicio');

  useEffect(() => {
    if (!dados) return;
    try {
      localStorage.setItem('ponte:empresa', token);
    } catch {}
  }, [dados, token]);

  if (erro && !dados) return <LinkInvalido />;

  const candidatos = dados?.vagas.reduce((n, v) => n + v.indicacoes.filter((i) => i.status === 'ENCAMINHADO').length, 0) ?? 0;
  const abas: { id: Aba; rotulo: string; icone: string; contador?: number }[] = [
    { id: 'inicio', rotulo: 'Início', icone: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5' },
    { id: 'vagas', rotulo: 'Vagas', icone: 'M4 7h16v12H4zM9 7V5h6v2' },
    { id: 'candidatos', rotulo: 'Candidatos', icone: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2.5 3 5', contador: candidatos },
    { id: 'estagiarios', rotulo: 'Estagiários', icone: 'M12 4 2 9l10 5 10-5-10-5zM6 11v5c3 2 9 2 12 0v-5' },
  ];

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Passo Aberto · Empresa</p>
          <h1 className="truncate text-lg font-semibold text-slate-900">{dados?.empresa.nome ?? 'Carregando...'}</h1>
          {dados?.empresa.setor && <p className="text-sm text-slate-500">{dados.empresa.setor}</p>}
        </header>

        <main className="flex-1 px-4 pb-28 pt-4">
          {!dados ? (
            <p className="py-10 text-center text-sm text-slate-500">Carregando...</p>
          ) : aba === 'inicio' ? (
            <Inicio token={token} painel={dados} recarregar={recarregar} verCandidatos={() => setAba('candidatos')} verVagas={() => setAba('vagas')} />
          ) : aba === 'vagas' ? (
            <Vagas token={token} painel={dados} recarregar={recarregar} />
          ) : aba === 'candidatos' ? (
            <Candidatos token={token} painel={dados} recarregar={recarregar} />
          ) : (
            <Estagiarios token={token} painel={dados} recarregar={recarregar} />
          )}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto grid max-w-md grid-cols-4">
            {abas.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${aba === a.id ? 'text-indigo-600' : 'text-slate-500'}`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d={a.icone} />
                </svg>
                {a.rotulo}
                {!!a.contador && (
                  <span className="absolute right-[calc(50%-1.5rem)] top-1.5 min-w-5 rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-5 text-white">
                    {a.contador}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
