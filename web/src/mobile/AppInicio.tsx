import { Navigate } from 'react-router';

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <img src={`${import.meta.env.BASE_URL}icone-192.png`} alt="" className="mb-4 h-16 w-16 rounded-2xl" />
      <h1 className="text-xl font-semibold text-slate-800">Ponte</h1>
      <p className="mt-2 text-sm text-slate-600">Abra o link de acesso que a coordenação da sua escola enviou para você.</p>
    </div>
  );
}
