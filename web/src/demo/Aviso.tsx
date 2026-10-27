import { Link } from 'react-router';
import { linksDemo } from './api';

export default function Aviso() {
  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
      Demonstração do Passo Aberto com dados fictícios: as alterações não são salvas. Veja também o{' '}
      <Link to={`/${linksDemo.aluno}`} className="font-semibold underline">
        app do aluno
      </Link>
      {linksDemo.empresa && (
        <>
          {', o '}
          <Link to={`/${linksDemo.empresa}`} className="font-semibold underline">
            app da empresa
          </Link>
        </>
      )}{' '}
      e o{' '}
      <Link to="/" className="font-semibold underline">
        painel da coordenação
      </Link>
      .
    </div>
  );
}
