import { Link } from 'react-router';
import { linksDemo } from './api';

export default function Aviso() {
  return (
    <div className="relative z-40 border-b border-line bg-sand px-4 py-2 text-center text-xs text-ink-2">
      Demonstração do Passo Aberto com dados fictícios: as alterações não são salvas. Veja também o{' '}
      <Link to={`/${linksDemo.aluno}`} className="font-semibold text-accent-ink underline">
        app do jovem
      </Link>
      {linksDemo.empresa && (
        <>
          {', o '}
          <Link to={`/${linksDemo.empresa}`} className="font-semibold text-accent-ink underline">
            app da empresa
          </Link>
        </>
      )}{' '}
      e o{' '}
      <Link to="/" className="font-semibold text-accent-ink underline">
        painel da coordenação
      </Link>
      .
    </div>
  );
}
