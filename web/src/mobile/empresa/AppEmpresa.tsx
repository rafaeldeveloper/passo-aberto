import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useApi } from '../../api';
import { COORDENACAO_OU, CONTATO_EMAIL, mailtoAjuda } from '../../config';
import type { AbaTabBar } from '../../ds';
import { AppHeader, btnPeq, btnSecundario, Icone, Logo, TabBar } from '../../ds';
import Candidatos from './Candidatos';
import Estagiarios from './Estagiarios';
import Inicio from './Inicio';
import type { PainelEmpresa } from './tipos';
import Vagas from './Vagas';

type Aba = 'inicio' | 'vagas' | 'candidatos' | 'estagiarios';

function LinkInvalido() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <div className="max-w-sm text-center">
        <Logo className="mx-auto mb-5 h-12 w-12" />
        <h1 className="text-xl font-bold text-ink">Link inválido</h1>
        <p className="mt-2 text-ink-2">Este link não vale mais. Peça um novo a {COORDENACAO_OU}.</p>
        <a href={mailtoAjuda('Novo link do app da empresa')} className={`${btnSecundario} mt-6`}>
          Pedir um novo link
        </a>
        <p className="mt-3 text-sm text-ink-3">{CONTATO_EMAIL}</p>
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
  const abas: AbaTabBar<Aba>[] = [
    { id: 'inicio', rotulo: 'Início', icone: 'inicio' },
    { id: 'vagas', rotulo: 'Vagas', icone: 'vagas' },
    { id: 'candidatos', rotulo: 'Candidatos', icone: 'candidatos', contador: candidatos },
    { id: 'estagiarios', rotulo: 'Estagiários', icone: 'estagiarios' },
  ];

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <AppHeader
        titulo={dados?.empresa.nome ?? 'Passo Aberto'}
        subtitulo={dados ? (dados.empresa.setor ?? 'App da empresa') : 'Carregando...'}
        acao={
          <a href={mailtoAjuda(`Ajuda: ${dados?.empresa.nome ?? 'app da empresa'}`)} className={`${btnSecundario} ${btnPeq}`}>
            <Icone nome="ajuda" className="h-4 w-4" />
            Ajuda
          </a>
        }
      />
      <main className="mx-auto max-w-md px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {!dados ? (
          <p className="py-10 text-center text-sm text-ink-3">Carregando...</p>
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
      <TabBar abas={abas} ativa={aba} onChange={setAba} />
    </div>
  );
}
