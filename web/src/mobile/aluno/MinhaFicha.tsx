import type { FormEvent } from 'react';
import { useState } from 'react';
import { api, enviar } from '../../api';
import type { FichaPortal } from './tipos';
import { Bloco, Folha, Icone, Vazio, botaoCls, botaoLeveCls, campoCls, dataCurta } from './ui';

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

  const criar = (caminho: string, body: object) => enviar(() => api(`${base}/${caminho}`, 'POST', body), () => {
    setFolha(undefined);
    recarregar();
  });

  const remover = (caminho: string, nome: string) => {
    if (window.confirm(`Remover "${nome}"?`)) enviar(() => api(`${base}/${caminho}`, 'DELETE'), recarregar);
  };

  const submeter = (e: FormEvent<HTMLFormElement>, acao: (form: FormData) => void) => {
    e.preventDefault();
    acao(new FormData(e.currentTarget));
  };

  return (
    <div className="space-y-4">
      <h1 className="px-1 text-2xl font-bold text-slate-800">Minha ficha</h1>

      <Bloco titulo="Sobre você">
        <form onSubmit={salvarSobre} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">E-mail</span>
            <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={campoCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Resumo</span>
            <textarea
              rows={4}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Conte do que você gosta, o que já aprendeu e o que procura."
              className={campoCls}
            />
          </label>
          <button disabled={!alterado || salvando} className={botaoCls}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Bloco>

      <Bloco titulo="Competências">
        <div className="mb-3 flex flex-wrap gap-2">
          {ficha.competencias.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded-full bg-teal-50 py-1.5 pr-1.5 pl-3 text-sm font-medium text-teal-800">
              {c}
              <button aria-label={`Remover ${c}`} onClick={() => removerCompetencia(c)} className="rounded-full p-1 active:bg-teal-100">
                <Icone nome="x" className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          {ficha.competencias.length === 0 && <p className="text-sm text-slate-500">Ex.: excel, atendimento, python, redes.</p>}
        </div>
        <form onSubmit={adicionarCompetencia} className="flex gap-2">
          <input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Nova competência" enterKeyHint="done" className={campoCls} />
          <button aria-label="Adicionar competência" disabled={!nova.trim() || salvando} className="shrink-0 rounded-2xl bg-teal-600 px-4 text-white disabled:opacity-50">
            <Icone nome="mais" />
          </button>
        </form>
      </Bloco>

      <Bloco titulo="Certificações" acao={<button onClick={() => setFolha('certificacao')} className={botaoLeveCls}>Adicionar</button>}>
        {ficha.certificacoes.length === 0 ? (
          <Vazio>Cursos e certificados contam muito para as empresas.</Vazio>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ficha.certificacoes.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">{c.nome}</p>
                  <p className="text-sm text-slate-500">{[c.instituicao, dataCurta(c.data)].filter(Boolean).join(' · ')}</p>
                </div>
                <button aria-label={`Remover ${c.nome}`} onClick={() => remover(`certificacoes/${c.id}`, c.nome)} className="rounded-full p-2 text-slate-400 active:bg-slate-100">
                  <Icone nome="x" className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Bloco titulo="Projetos" acao={<button onClick={() => setFolha('projeto')} className={botaoLeveCls}>Adicionar</button>}>
        {ficha.projetos.length === 0 ? (
          <Vazio>Mostre um trabalho, TCC ou projeto pessoal.</Vazio>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ficha.projetos.map((p) => (
              <li key={p.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">{p.titulo}</p>
                  {p.descricao && <p className="text-sm text-slate-500">{p.descricao}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium text-sky-700">
                      {p.link}
                    </a>
                  )}
                </div>
                <button aria-label={`Remover ${p.titulo}`} onClick={() => remover(`projetos/${p.id}`, p.titulo)} className="rounded-full p-2 text-slate-400 active:bg-slate-100">
                  <Icone nome="x" className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Bloco>

      <Folha titulo="Nova certificação" aberta={folha === 'certificacao'} fechar={() => setFolha(undefined)}>
        <form
          onSubmit={(e) =>
            submeter(e, (f) => criar('certificacoes', { nome: campo(f, 'nome'), instituicao: campo(f, 'instituicao'), data: campo(f, 'data') }))
          }
          className="space-y-3"
        >
          <input name="nome" required placeholder="Nome do curso ou certificado" className={campoCls} />
          <input name="instituicao" placeholder="Instituição (opcional)" className={campoCls} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Data de conclusão (opcional)</span>
            <input name="data" type="date" className={campoCls} />
          </label>
          <button className={botaoCls}>Adicionar certificação</button>
        </form>
      </Folha>

      <Folha titulo="Novo projeto" aberta={folha === 'projeto'} fechar={() => setFolha(undefined)}>
        <form
          onSubmit={(e) => submeter(e, (f) => criar('projetos', { titulo: campo(f, 'titulo'), descricao: campo(f, 'descricao'), link: campo(f, 'link') }))}
          className="space-y-3"
        >
          <input name="titulo" required placeholder="Título do projeto" className={campoCls} />
          <textarea name="descricao" rows={3} placeholder="O que você fez? (opcional)" className={campoCls} />
          <input name="link" type="url" inputMode="url" placeholder="https://... (opcional)" className={campoCls} />
          <button className={botaoCls}>Adicionar projeto</button>
        </form>
      </Folha>
    </div>
  );
}
