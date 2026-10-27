import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../../api';
import Carreiras from './Carreiras';
import Eventos from './Eventos';
import Inicio from './Inicio';
import MinhaFicha from './MinhaFicha';
import Oportunidades from './Oportunidades';
import PedirAjuda from './PedirAjuda';
import type { Aba, Carreiras as DadosCarreiras, EmpresaArea, FichaPortal, MotivoAjuda } from './tipos';
import { COORDENACAO_OU } from '../../config';
import { AppHeader, Icone, Logo, TabBar, btnPeq, btnPrimario, btnSecundario, type AbaTabBar } from '../../ds';

const abas: AbaTabBar<Aba>[] = [
  { id: 'inicio', rotulo: 'Início', icone: 'inicio' },
  { id: 'trabalhar', rotulo: 'Trabalhar', icone: 'trabalhar' },
  { id: 'caminhos', rotulo: 'Caminhos', icone: 'bussola' },
  { id: 'agenda', rotulo: 'Agenda', icone: 'agenda' },
  { id: 'eu', rotulo: 'Eu', icone: 'eu' },
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
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6 text-ink">
      <div className="max-w-sm text-center">
        <Logo className="mx-auto mb-6 h-12 w-12" />
        <h1 className="mb-2 text-2xl font-bold">{titulo}</h1>
        <p className="text-ink-2">{texto}</p>
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
  const [ajuda, setAjuda] = useState<{ motivo?: MotivoAjuda; contexto?: string; n: number }>();

  const marcar = (id: string, interessado: boolean) => setEmpresas((lista) => lista?.map((e) => (e.id === id ? { ...e, interessado } : e)));

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

  const pedirAjuda = (motivo?: MotivoAjuda, contexto?: string) => setAjuda((a) => ({ motivo, contexto, n: (a?.n ?? 0) + 1 }));

  if (estado === 'invalido') return <Tela titulo="Link inválido" texto={`Este link não vale mais. Peça um novo a ${COORDENACAO_OU}.`} />;
  if (estado === 'erro')
    return (
      <Tela titulo="Não deu para carregar" texto="Verifique sua internet e tente de novo.">
        <button onClick={recarregar} className={`${btnPrimario} mt-6 w-auto`}>
          Tentar de novo
        </button>
      </Tela>
    );
  if (!ficha) return <Tela titulo="Carregando..." texto="Só um instante." />;

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <AppHeader
        titulo="Passo Aberto"
        subtitulo={ficha.curso.nome}
        acao={
          <button onClick={() => pedirAjuda()} className={`${btnSecundario} ${btnPeq}`}>
            <Icone nome="ajuda" className="h-4 w-4" />
            Ajuda
          </button>
        }
      />
      <main className="mx-auto max-w-md px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {ficha.menorDeIdade && !ficha.consentimentoResponsavel && (
          <p className="mb-4 rounded-card bg-warning-soft px-4 py-3 text-sm text-warning">
            Seu perfil só será compartilhado com empresas depois da autorização do seu responsável. Fale com {COORDENACAO_OU}.
          </p>
        )}
        {aba === 'inicio' && (
          <Inicio ficha={ficha} empresas={empresas} carreiras={carreiras} irPara={irPara} alternarInteresse={alternarInteresse} pedirAjuda={pedirAjuda} />
        )}
        {aba === 'trabalhar' && <Oportunidades ficha={ficha} empresas={empresas} alternarInteresse={alternarInteresse} pedirAjuda={pedirAjuda} />}
        {aba === 'caminhos' && <Carreiras ficha={ficha} dados={carreiras} pedirAjuda={pedirAjuda} />}
        {aba === 'agenda' && <Eventos ficha={ficha} />}
        {aba === 'eu' && <MinhaFicha ficha={ficha} base={base} atualizar={setFicha} recarregar={recarregar} />}
      </main>

      <TabBar abas={abas} ativa={aba} onChange={irPara} />

      {ajuda && <PedirAjuda key={ajuda.n} ficha={ficha} motivoInicial={ajuda.motivo} contexto={ajuda.contexto} fechar={() => setAjuda(undefined)} />}
    </div>
  );
}
