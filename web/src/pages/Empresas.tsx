import { useState } from 'react';
import { api, enviar, useApi } from '../api';
import type { Empresa } from '../tipos';
import { EmptyState } from '../ds';
import { botaoCls, botaoSecCls, Campo, Card, Formulario, inputCls, linkCls, opcional, Selo, SourceBadge, Titulo, useEscola } from '../ui';

const POR_PAGINA = 50;

export default function Empresas() {
  const escola = useEscola();
  const [origem, setOrigem] = useState<Empresa['origem']>('PARCEIRA');
  const [cursoId, setCursoId] = useState('');
  const [busca, setBusca] = useState('');
  const [porInteresse, setPorInteresse] = useState(false);
  const [limite, setLimite] = useState(POR_PAGINA);
  const [nova, setNova] = useState(false);
  const { dados: empresas = [], recarregar } = useApi<Empresa[]>(`/empresas?origem=${origem}${cursoId ? `&cursoId=${cursoId}` : ''}`);

  const termo = busca.trim().toLowerCase();
  const buscadas = termo ? empresas.filter((e) => `${e.nome} ${e.endereco ?? ''} ${e.setor ?? ''}`.toLowerCase().includes(termo)) : empresas;
  const filtradas = porInteresse
    ? buscadas.filter((e) => e._count?.interesses).sort((a, b) => (b._count?.interesses ?? 0) - (a._count?.interesses ?? 0))
    : buscadas;

  const criar = (f: FormData) =>
    enviar(
      () =>
        api('/empresas', 'POST', {
          nome: f.get('nome'),
          setor: opcional(f.get('setor')),
          contatoNome: opcional(f.get('contatoNome')),
          contatoEmail: opcional(f.get('contatoEmail')),
          contatoTelefone: opcional(f.get('contatoTelefone')),
          endereco: opcional(f.get('endereco')),
          cursoIds: f.getAll('cursoIds').map(String),
        }),
      () => {
        setNova(false);
        recarregar();
      },
    );

  const linkAcesso = (e: Empresa) => `${window.location.origin}${import.meta.env.BASE_URL}app/empresa/${e.tokenAcesso}`;

  const copiar = (texto: string) => navigator.clipboard?.writeText(texto).then(() => window.alert('Link copiado'));

  return (
    <>
      <Titulo
        subtitulo="Parceiras se apresentaram ao projeto. Fontes externas são empresas encontradas em dados públicos e não são parceiras."
        acao={
          <button className={nova ? botaoSecCls : botaoCls} onClick={() => setNova(!nova)}>
            {nova ? 'Cancelar' : 'Nova empresa parceira'}
          </button>
        }
      >
        Empresas
      </Titulo>

      {nova && (
        <Card titulo="Cadastrar empresa parceira" className="mb-6">
          <Formulario onSubmit={criar}>
            <Campo rotulo="Nome">
              <input name="nome" required className={inputCls} />
            </Campo>
            <Campo rotulo="Setor">
              <input name="setor" className={inputCls} />
            </Campo>
            <Campo rotulo="Contato">
              <input name="contatoNome" className={inputCls} />
            </Campo>
            <Campo rotulo="E-mail do contato">
              <input name="contatoEmail" type="email" className={inputCls} />
            </Campo>
            <Campo rotulo="Telefone do contato">
              <input name="contatoTelefone" className={inputCls} />
            </Campo>
            <Campo rotulo="Endereço">
              <input name="endereco" className={inputCls} />
            </Campo>
            <div className="flex flex-wrap gap-3 text-sm sm:col-span-2">
              {escola?.cursos.map((c) => (
                <label key={c.id} className="flex items-center gap-1">
                  <input type="checkbox" name="cursoIds" value={c.id} /> {c.nome}
                </label>
              ))}
            </div>
          </Formulario>
        </Card>
      )}

      <div className="mb-4 inline-flex rounded-md bg-surface-2 p-1 ring-1 ring-line">
        {(['PARCEIRA', 'SCOUT'] as const).map((o) => (
          <button
            key={o}
            onClick={() => {
              setOrigem(o);
              setLimite(POR_PAGINA);
            }}
            className={`min-h-9 rounded-sm px-4 text-sm ${origem === o ? 'bg-surface font-semibold text-brand-ink shadow-card' : 'font-medium text-ink-3 hover:text-ink'}`}
          >
            {o === 'PARCEIRA' ? 'Parceiras' : 'Fontes externas'}
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          <input placeholder="Buscar por nome, bairro ou setor" className={inputCls} value={busca} onChange={(e) => setBusca(e.target.value)} />
          <select className={inputCls} value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
            <option value="">Todos os cursos</option>
            {escola?.cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-3">
          <span className="tabular-nums">{filtradas.length} empresas</span>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={porInteresse} onChange={(e) => setPorInteresse(e.target.checked)} /> Só com interesse de jovens
          </label>
        </div>

        <ul className="divide-y divide-line text-sm">
          {filtradas.slice(0, limite).map((e) => (
            <li key={e.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{e.nome}</span>
                  <SourceBadge origem={e.origem} />
                  {e.cursos?.map((c) => (
                    <Selo key={c.id}>{c.nome}</Selo>
                  ))}
                  {!!e._count?.interesses && (
                    <Selo tom="accent">
                      {e._count.interesses} {e._count.interesses === 1 ? 'jovem interessado' : 'jovens interessados'}
                    </Selo>
                  )}
                </div>
                <p className="text-ink-3">{[e.setor, e.endereco].filter(Boolean).join(' · ')}</p>
                <p className="text-ink-3">
                  {[e.contatoNome, e.contatoEmail, e.contatoTelefone].filter(Boolean).join(' · ')}
                  {e.site && (
                    <>
                      {' '}
                      <a href={e.site} target="_blank" rel="noreferrer" className={linkCls}>
                        site
                      </a>
                    </>
                  )}
                  {e.latitude != null && (
                    <>
                      {' '}
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${e.latitude}&mlon=${e.longitude}#map=18/${e.latitude}/${e.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className={linkCls}
                      >
                        mapa
                      </a>
                    </>
                  )}
                </p>
                {origem === 'PARCEIRA' && (
                  <p className="text-xs text-ink-3">
                    {e._count?.estagios ?? 0} estágios · {e._count?.vagas ?? 0} vagas
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                {origem === 'SCOUT' ? (
                  <button
                    className={botaoSecCls}
                    title="Use quando a empresa se apresentar ao projeto"
                    onClick={() => enviar(() => api(`/empresas/${e.id}/parceria`, 'POST'), recarregar)}
                  >
                    Tornar parceira
                  </button>
                ) : e.tokenAcesso ? (
                  <>
                    <button className={botaoSecCls} onClick={() => copiar(linkAcesso(e))}>
                      Copiar link da empresa
                    </button>
                    <button
                      className={botaoSecCls}
                      title="Gera um link novo e invalida o anterior"
                      onClick={() =>
                        window.confirm('Gerar um link novo? O link atual deixa de funcionar.') &&
                        enviar(() => api(`/empresas/${e.id}/acesso`, 'POST'), recarregar)
                      }
                    >
                      Novo link
                    </button>
                  </>
                ) : (
                  <button className={botaoSecCls} onClick={() => enviar(() => api(`/empresas/${e.id}/acesso`, 'POST'), recarregar)}>
                    Gerar link de acesso
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {filtradas.length > limite && (
          <button className={`${botaoSecCls} mt-3`} onClick={() => setLimite(limite + POR_PAGINA)}>
            Mostrar mais
          </button>
        )}
        {!filtradas.length && <EmptyState titulo="Nenhuma empresa encontrada." />}
        {origem === 'SCOUT' && (
          <p className="mt-4 text-xs text-ink-3">
            Dados públicos do{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">
              © OpenStreetMap contributors
            </a>
            , licença ODbL. Atualize com <code>npm run scout</code> na API.
          </p>
        )}
      </Card>
    </>
  );
}
