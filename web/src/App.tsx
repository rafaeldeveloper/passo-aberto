import { useState } from 'react';
import { NavLink, Outlet, Route, Routes } from 'react-router';
import AppInicio from './mobile/AppInicio';
import AppAluno from './mobile/aluno/AppAluno';
import AppEmpresa from './mobile/empresa/AppEmpresa';
import Alunos from './pages/Alunos';
import Carreiras from './pages/Carreiras';
import Comunidade from './pages/Comunidade';
import Empresas from './pages/Empresas';
import Estagios from './pages/Estagios';
import EventoDetalhe from './pages/EventoDetalhe';
import FichaAluno from './pages/FichaAluno';
import Painel from './pages/Painel';
import VagaDetalhe from './pages/VagaDetalhe';
import Vagas from './pages/Vagas';
import type { NomeIcone } from './ui';
import { EscolaContext, Icone, Logo, useEscolaCarregada } from './ui';

const grupos: { titulo: string; itens: [string, string, NomeIcone][] }[] = [
  {
    titulo: 'Acompanhar',
    itens: [
      ['/', 'Painel', 'painel'],
      ['/alunos', 'Jovens', 'jovens'],
    ],
  },
  {
    titulo: 'Oportunidades',
    itens: [
      ['/vagas', 'Vagas e indicações', 'vagas'],
      ['/empresas', 'Empresas', 'empresas'],
    ],
  },
  {
    titulo: 'Caminhos',
    itens: [
      ['/carreiras', 'Carreiras', 'bussola'],
      ['/comunidade', 'Encontros e mentores', 'agenda'],
    ],
  },
  { titulo: 'Registros', itens: [['/estagios', 'Estágios', 'registros']] },
];

export default function App() {
  return (
    <Routes>
      <Route path="/app" element={<AppInicio />} />
      <Route path="/app/aluno/:token" element={<AppAluno />} />
      <Route path="/app/empresa/:token" element={<AppEmpresa />} />
      <Route element={<Admin />}>
        <Route path="/" element={<Painel />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/alunos/:id" element={<FichaAluno />} />
        <Route path="/estagios" element={<Estagios />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/vagas/:id" element={<VagaDetalhe />} />
        <Route path="/comunidade" element={<Comunidade />} />
        <Route path="/carreiras" element={<Carreiras />} />
        <Route path="/eventos/:id" element={<EventoDetalhe />} />
      </Route>
    </Routes>
  );
}

function Marca({ subtitulo }: { subtitulo?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Logo className="h-8 w-8 shrink-0" />
      <div className="min-w-0">
        <p className="font-bold text-brand-ink">Passo Aberto</p>
        <p className="truncate text-xs text-ink-3">{subtitulo}</p>
      </div>
    </div>
  );
}

function Menu({ subtitulo, fechar }: { subtitulo?: string; fechar?: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-line bg-surface px-3 py-5">
      <div className="flex items-center justify-between gap-2 px-3">
        <Marca subtitulo={subtitulo} />
        {fechar && (
          <button onClick={fechar} aria-label="Fechar menu" className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-surface-2">
            <Icone nome="x" className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="mt-2">
        {grupos.map((g) => (
          <div key={g.titulo}>
            <p className="px-3 pt-5 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-3">{g.titulo}</p>
            <ul className="space-y-0.5">
              {g.itens.map(([to, rotulo, icone]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={fechar}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
                        isActive ? 'bg-brand-soft font-semibold text-brand-ink' : 'font-medium text-ink-3 hover:bg-surface-2 hover:text-ink'
                      }`
                    }
                  >
                    <Icone nome={icone} />
                    {rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

function Admin() {
  const { dados: escola, erro } = useEscolaCarregada();
  const [aberto, setAberto] = useState(false);
  const subtitulo = escola ? `Coordenação · Piloto ${escola.municipio}` : erro;

  return (
    <EscolaContext.Provider value={escola}>
      <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[248px_1fr]">
        <aside className="sticky top-0 hidden h-dvh lg:block">
          <Menu subtitulo={subtitulo} />
        </aside>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface px-4 lg:hidden">
          <Marca subtitulo={subtitulo} />
          <button
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            className="grid h-10 w-10 place-items-center rounded-md text-ink-2 hover:bg-surface-2"
          >
            <Icone nome="menu" className="h-5 w-5" />
          </button>
        </header>
        {aberto && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button aria-label="Fechar menu" className="absolute inset-0 bg-petrol-900/45" onClick={() => setAberto(false)} />
            <div className="fixed inset-y-0 left-0 w-72 shadow-sheet">
              <Menu subtitulo={subtitulo} fechar={() => setAberto(false)} />
            </div>
          </div>
        )}
        <main className="min-w-0 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </EscolaContext.Provider>
  );
}
