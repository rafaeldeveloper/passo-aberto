import { Navigate } from 'react-router';
import { COORDENACAO } from '../config';
import { Logo } from '../ds';

const ler = (chave: string) => {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
};

export default function AppInicio() {
  const aluno = ler('ponte:aluno');
  const empresa = ler('ponte:empresa');
  if (aluno) return <Navigate to={`/app/aluno/${aluno}`} replace />;
  if (empresa) return <Navigate to={`/app/empresa/${empresa}`} replace />;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center text-ink">
      <Logo className="mb-4 h-12 w-12" />
      <h1 className="text-xl font-bold text-brand-ink">Passo Aberto</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-2">Abra o link de acesso que {COORDENACAO} enviaram para você.</p>
    </div>
  );
}
