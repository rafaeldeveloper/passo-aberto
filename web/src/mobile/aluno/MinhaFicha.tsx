import type { FormEvent } from 'react';
import { useState } from 'react';
import { api, enviar } from '../../api';
import { BottomSheet, Badge, Card, Icone, btnPeq, btnPrimario, btnSecundario, campo as campoCls, listaCls } from '../../ds';
import { STATUS_ESTAGIO } from '../../tipos';
import type { FichaPortal } from './tipos';
import { dataCurta } from './ui';

const tomEstagio = { EM_ANDAMENTO: 'info', CONCLUIDO: 'success', CANCELADO: 'neutral' } as const;

const botaoAdicionar = `${btnSecundario} ${btnPeq}`;

const campo = (form: FormData, nome: string) => String(form.get(nome) ?? '').trim() || undefined;

export default function MinhaFicha({
  ficha,
  base,
  atualizar,
  recarregar,
}: {
  ficha: FichaPortal;
  base: string;
  atualizar: (ficha: FichaPortal) => void;
  recarregar: () => void;
}) {
  const [email, setEmail] = useState(ficha.email ?? '');
  const [resumo, setResumo] = useState(ficha.resumo ?? '');
  const [nova, setNova] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [folha, setFolha] = useState<'certificacao' | 'projeto'>();

  const alterado = email !== (ficha.email ?? '') || resumo !== (ficha.resumo ?? '');

  const patch = (body: { email?: string; resumo?: string; competencias?: string[] }) =>
    enviar(async () => {
      setSalvando(true);
      try {
        atualizar(await api<FichaPortal>(base, 'PATCH', body));
      } finally {
        setSalvando(false);
      }
    });

  const salvarSobre = (e: FormEvent) => {
    e.preventDefault();
    patch({ email: email.trim() || undefined, resumo: resumo.trim() });
  };

  const adicionarCompetencia = (e: FormEvent) => {
    e.preventDefault();
    const valor = nova.trim().toLowerCase();
    if (!valor || ficha.competencias.includes(valor)) return setNova('');
    setNova('');
    patch({ competencias: [...ficha.competencias, valor] });
  };

  const removerCompetencia = (c: string) => patch({ competencias: ficha.competencias.filter((x) => x !== c) });

  const criar = (caminho: string, body: object) =>
    enviar(
      () => api(`${base}/${caminho}`, 'POST', body),
      () => {
        setFolha(undefined);
        recarregar();
      },
    );

  const remover = (caminho: string, nome: string) => {
    if (window.confirm(`Remover "${nome}"?`)) enviar(() => api(`${base}/${caminho}`, 'DELETE'), recarregar);
  };

  const submeter = (e: FormEvent<HTMLFormElement>, acao: (form: FormData) => void) => {
    e.preventDefault();
    acao(new FormData(e.currentTarget));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Eu</h1>
        <p className="text-sm text-ink-3">Seu perfil é o que as empresas veem quando você é apresentado(a).</p>
      </header>

      <Card titulo="Sobre você">
        <form onSubmit={salvarSobre} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-2">E-mail</span>
            <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={campoCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-2">Resumo</span>
            <textarea
              rows={4}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Conte do que você gosta, o que já aprendeu e o que procura."
              className={campoCls}
            />
          </label>
          <button disabled={!alterado || salvando} className={btnPrimario}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Card>

      <Card titulo="Competências">
        <div className="mb-3 flex flex-wrap gap-2">
          {ficha.competencias.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded-full bg-brand-soft py-1 pr-1 pl-3 text-sm font-semibold text-brand-ink">
              {c}
              <button
                aria-label={`Remover ${c}`}
                onClick={() => removerCompetencia(c)}
                className="grid h-7 w-7 place-items-center rounded-full active:bg-surface"
              >
                <Icone nome="x" className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          {ficha.competencias.length === 0 && <p className="text-sm text-ink-3">Ex.: excel, atendimento, python, redes.</p>}
        </div>
        <form onSubmit={adicionarCompetencia} className="flex gap-2">
          <input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Nova competência" enterKeyHint="done" className={campoCls} />
          <button
            aria-label="Adicionar competência"
            disabled={!nova.trim() || salvando}
            className="grid min-h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-50"
          >
            <Icone nome="mais" />
          </button>
        </form>
      </Card>

      <Card
        titulo="Certificações"
        acao={
          <button onClick={() => setFolha('certificacao')} className={botaoAdicionar}>
            Adicionar
          </button>
        }
      >
        {ficha.certificacoes.length === 0 ? (
          <p className="text-sm text-ink-3">Cursos e certificados contam muito para as empresas.</p>
        ) : (
          <ul className={listaCls}>
            {ficha.certificacoes.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.nome}</p>
                  <p className="text-sm text-ink-3">{[c.instituicao, dataCurta(c.data)].filter(Boolean).join(' · ')}</p>
                </div>
                <button
                  aria-label={`Remover ${c.nome}`}
                  onClick={() => remover(`certificacoes/${c.id}`, c.nome)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-3 active:bg-surface-2"
                >
                  <Icone nome="x" className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card
        titulo="Projetos"
        acao={
          <button onClick={() => setFolha('projeto')} className={botaoAdicionar}>
            Adicionar
          </button>
        }
      >
        {ficha.projetos.length === 0 ? (
          <p className="text-sm text-ink-3">Mostre um trabalho, TCC ou projeto pessoal.</p>
        ) : (
          <ul className={listaCls}>
            {ficha.projetos.map((p) => (
              <li key={p.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.titulo}</p>
                  {p.descricao && <p className="text-sm text-ink-3">{p.descricao}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="block truncate text-sm font-semibold text-accent-ink">
                      {p.link}
                    </a>
                  )}
                </div>
                <button
                  aria-label={`Remover ${p.titulo}`}
                  onClick={() => remover(`projetos/${p.id}`, p.titulo)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-3 active:bg-surface-2"
                >
                  <Icone nome="x" className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card titulo="Minhas experiências">
        {ficha.estagios.length === 0 ? (
          <p className="text-sm text-ink-3">Estágios e trabalhos registrados pelo projeto aparecem aqui.</p>
        ) : (
          <ul className={listaCls}>
            {ficha.estagios.map((e) => (
              <li key={e.id} className="space-y-2 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{e.empresa.nome}</p>
                    <p className="text-sm text-ink-3">
                      {dataCurta(e.inicio)}
                      {e.fim ? ` a ${dataCurta(e.fim)}` : ' até hoje'}
                    </p>
                    {e.supervisorNome && <p className="text-sm text-ink-3">Supervisão: {e.supervisorNome}</p>}
                  </div>
                  <Badge tom={tomEstagio[e.status]}>{STATUS_ESTAGIO[e.status]}</Badge>
                </div>
                {(e.avaliacaoNota != null || e.avaliacaoComentario) && (
                  <div className="rounded-md bg-sand p-3">
                    <p className="text-sm font-semibold">Avaliação do supervisor{e.avaliacaoNota != null && `: ${e.avaliacaoNota}/10`}</p>
                    {e.avaliacaoComentario && <p className="mt-1 text-sm text-ink-2">"{e.avaliacaoComentario}"</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <BottomSheet titulo="Nova certificação" aberta={folha === 'certificacao'} fechar={() => setFolha(undefined)}>
        <form
          onSubmit={(e) => submeter(e, (f) => criar('certificacoes', { nome: campo(f, 'nome'), instituicao: campo(f, 'instituicao'), data: campo(f, 'data') }))}
          className="space-y-3"
        >
          <input name="nome" required placeholder="Nome do curso ou certificado" className={campoCls} />
          <input name="instituicao" placeholder="Instituição (opcional)" className={campoCls} />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-2">Data de conclusão (opcional)</span>
            <input name="data" type="date" className={campoCls} />
          </label>
          <button className={btnPrimario}>Adicionar certificação</button>
        </form>
      </BottomSheet>

      <BottomSheet titulo="Novo projeto" aberta={folha === 'projeto'} fechar={() => setFolha(undefined)}>
        <form
          onSubmit={(e) => submeter(e, (f) => criar('projetos', { titulo: campo(f, 'titulo'), descricao: campo(f, 'descricao'), link: campo(f, 'link') }))}
          className="space-y-3"
        >
          <input name="titulo" required placeholder="Título do projeto" className={campoCls} />
          <textarea name="descricao" rows={3} placeholder="O que você fez? (opcional)" className={campoCls} />
          <input name="link" type="url" inputMode="url" placeholder="https://... (opcional)" className={campoCls} />
          <button className={btnPrimario}>Adicionar projeto</button>
        </form>
      </BottomSheet>
    </div>
  );
}
