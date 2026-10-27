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
import { EscolaContext, useEscolaCarregada } from './ui';

const menu = [
  ['/', 'Painel'],
  ['/alunos', 'Alunos'],
  ['/estagios', 'Estágios'],
  ['/empresas', 'Empresas'],
  ['/vagas', 'Vagas e match'],
  ['/comunidade', 'Mentores e eventos'],
  ['/carreiras', 'Carreiras'],
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

function Admin() {
  const { dados: escola, erro } = useEscolaCarregada();

  return (
    <EscolaContext.Provider value={escola}>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <div>
              <p className="font-semibold text-sky-800">Passo Aberto · Coordenação</p>
              <p className="text-xs text-slate-500">{escola ? `${escola.nome} · ${escola.municipio}` : erro}</p>
            </div>
            <nav className="flex flex-wrap gap-1">
              {menu.map(([to, rotulo]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-sm ${isActive ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:bg-slate-100'}`
                  }
                >
                  {rotulo}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </EscolaContext.Provider>
  );
}
