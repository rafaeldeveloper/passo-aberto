import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../../api';
import Carreiras from './Carreiras';
import Eventos from './Eventos';
import Inicio from './Inicio';
import MinhaFicha from './MinhaFicha';
import Oportunidades from './Oportunidades';
import type { Aba, Carreiras as DadosCarreiras, EmpresaArea, FichaPortal } from './tipos';
import { Icone } from './ui';

const abas: [Aba, string][] = [
  ['inicio', 'Início'],
  ['ficha', 'Ficha'],
  ['eventos', 'Eventos'],
  ['carreiras', 'Carreiras'],
  ['oportunidades', 'Oportunidades'],
];

function useFicha(base: string) {
  const [ficha, setFicha] = useState<FichaPortal>();
  const [estado, setEstado] = useState<'carregando' | 'ok' | 'invalido' | 'erro'>('carregando');

  const recarregar = useCallback(() => {
    api<FichaPortal>(base).then(
      (dados) => {
        setFicha(dados);
        setEstado('ok');
      },
      (e: Error & { status?: number }) => setEstado(e.status === 404 || e.status === 400 ? 'invalido' : 'erro'),
    );
  }, [base]);

  useEffect(recarregar, [recarregar]);
  return { ficha, setFicha, estado, recarregar };
}

function useDados<T>(path: string, ativo: boolean) {
  const [dados, setDados] = useState<T>();
  useEffect(() => {
    if (ativo) api<T>(path).then(setDados, () => undefined);
  }, [path, ativo]);
  return [dados, setDados] as const;
}

function Tela({ titulo, texto, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-teal-50 to-sky-50 px-6">
      <div className="max-w-sm text-center">
        <p className="mb-6 text-sm font-bold tracking-widest text-teal-700 uppercase">Ponte</p>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">{titulo}</h1>
        <p className="text-slate-600">{texto}</p>
        {children}
      </div>
    </div>
  );
}

export default function AppAluno() {
  const { token = '' } = useParams();
  const base = `/portal/aluno/${token}`;
  const { ficha, setFicha, estado, recarregar } = useFicha(base);
  const [aba, setAba] = useState<Aba>('inicio');
  const [empresas, setEmpresas] = useDados<EmpresaArea[]>(`${base}/empresas`, estado === 'ok');
  const [carreiras] = useDados<DadosCarreiras>(`${base}/carreiras`, estado === 'ok');

  const marcar = (id: string, interessado: boolean) =>
    setEmpresas((lista) => lista?.map((e) => (e.id === id ? { ...e, interessado } : e)));

  const alternarInteresse = async (empresa: EmpresaArea) => {
    const interessado = !empresa.interessado;
    marcar(empresa.id, interessado);
    try {
      await api(`${base}/interesses/${empresa.id}`, interessado ? 'PUT' : 'DELETE');
    } catch (e) {
      marcar(empresa.id, !interessado);
      window.alert((e as Error).message);
    }
  };

  useEffect(() => {
    if (estado !== 'ok') return;
    try {
      localStorage.setItem('ponte:aluno', token);
    } catch {}
  }, [estado, token]);

  const irPara = (nova: Aba) => {
    setAba(nova);
    window.scrollTo({ top: 0 });
  };

  if (estado === 'invalido') return <Tela titulo="Link inválido" texto="Este link não está mais valendo. Peça um novo à coordenação." />;
  if (estado === 'erro')
    return (
      <Tela titulo="Não deu para carregar" texto="Verifique sua internet e tente de novo.">
        <button onClick={recarregar} className="mt-6 rounded-2xl bg-teal-600 px-6 py-3 font-semibold text-white active:bg-teal-700">
          Tentar de novo
        </button>
      </Tela>
    );
  if (!ficha) return <Tela titulo="Carregando..." texto="Só um instante." />;

  return (
    <div className="min-h-dvh bg-slate-50">
      <main className="mx-auto max-w-md px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {ficha.menorDeIdade && !ficha.consentimentoResponsavel && (
          <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-100">
            Sua ficha só será compartilhada com empresas depois da autorização do seu responsável. Fale com a coordenação.
          </p>
        )}
        {aba === 'inicio' && <Inicio ficha={ficha} empresas={empresas} carreiras={carreiras} irPara={irPara} alternarInteresse={alternarInteresse} />}
        {aba === 'ficha' && <MinhaFicha ficha={ficha} base={base} atualizar={setFicha} recarregar={recarregar} />}
        {aba === 'eventos' && <Eventos ficha={ficha} />}
        {aba === 'carreiras' && <Carreiras ficha={ficha} dados={carreiras} />}
        {aba === 'oportunidades' && <Oportunidades ficha={ficha} empresas={empresas} alternarInteresse={alternarInteresse} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="mx-auto flex max-w-md">
          {abas.map(([id, rotulo]) => (
            <li key={id} className="flex-1">
              <button
                onClick={() => irPara(id)}
                aria-current={aba === id ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 px-0.5 py-2.5 text-[10px] leading-tight font-medium tracking-tight ${aba === id ? 'text-teal-700' : 'text-slate-400'}`}
              >
                <span className={`rounded-full px-3 py-1 ${aba === id ? 'bg-teal-50' : ''}`}>
                  <Icone nome={id} className="h-6 w-6" />
                </span>
                <span className="w-full truncate text-center">{rotulo}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
