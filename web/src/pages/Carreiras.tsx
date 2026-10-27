import { useState } from 'react';
import { api, enviar, useApi } from '../api';
import { botaoSecCls, Campo, Card, data, Formulario, inputCls, lista, opcional, Selo, Titulo, useEscola } from '../ui';

interface Carreira {
  id: string;
  cursoId: string;
  titulo: string;
  resumo: string;
  ondeTrabalhar?: string;
  formacao?: string;
  competencias: string[];
  ordem: number;
  _count: { novidades: number };
}

interface Novidade {
  id: string;
  titulo: string;
  texto: string;
  link?: string;
  publicadaEm: string;
  carreira?: { titulo: string };
}

export default function Carreiras() {
  const escola = useEscola();
  const [escolhido, setCursoId] = useState('');
  const cursoId = escolhido || escola?.cursos[0]?.id || '';
  const { dados: carreiras = [], recarregar } = useApi<Carreira[]>(cursoId ? `/carreiras?cursoId=${cursoId}` : null);
  const { dados: novidades = [], recarregar: recarregarNovidades } = useApi<Novidade[]>(cursoId ? `/novidades?cursoId=${cursoId}` : null);
  const [editando, setEditando] = useState<string>();

  const dadosCarreira = (f: FormData) => ({
    titulo: f.get('titulo'),
    resumo: f.get('resumo'),
    ondeTrabalhar: opcional(f.get('ondeTrabalhar')),
    formacao: opcional(f.get('formacao')),
    competencias: lista(f.get('competencias')),
  });

  const camposCarreira = (c?: Carreira) => (
    <>
      <Campo rotulo="Carreira">
        <input name="titulo" required defaultValue={c?.titulo} className={inputCls} />
      </Campo>
      <Campo rotulo="Competências (separadas por vírgula)">
        <input name="competencias" defaultValue={c?.competencias.join(', ')} className={inputCls} />
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo="O que faz">
          <textarea name="resumo" required rows={2} defaultValue={c?.resumo} className={inputCls} />
        </Campo>
      </div>
      <Campo rotulo="Onde trabalhar">
        <input name="ondeTrabalhar" defaultValue={c?.ondeTrabalhar ?? ''} className={inputCls} />
      </Campo>
      <Campo rotulo="Formação para seguir">
        <input name="formacao" defaultValue={c?.formacao ?? ''} className={inputCls} />
      </Campo>
    </>
  );

  return (
    <>
      <Titulo
        acao={
          <select className={`${inputCls} w-auto`} value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
            {escola?.cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        }
      >
        Carreiras e novidades
      </Titulo>
      <p className="-mt-2 mb-4 text-sm text-slate-500">O que os alunos do curso veem na aba Carreiras do app.</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card titulo={`Carreiras (${carreiras.length})`} className="lg:col-span-2">
          <ul className="mb-4 divide-y divide-slate-100 text-sm">
            {carreiras.map((c) =>
              editando === c.id ? (
                <li key={c.id} className="py-3">
                  <Formulario
                    onSubmit={(f) =>
                      enviar(
                        () => api(`/carreiras/${c.id}`, 'PATCH', dadosCarreira(f)),
                        () => {
                          setEditando(undefined);
                          recarregar();
                        },
                      )
                    }
                  >
                    {camposCarreira(c)}
                  </Formulario>
                  <button className="mt-2 text-xs text-slate-500 hover:underline" onClick={() => setEditando(undefined)}>
                    cancelar
                  </button>
                </li>
              ) : (
                <li key={c.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-800">{c.titulo}</p>
                      <p className="text-slate-600">{c.resumo}</p>
                      {c.ondeTrabalhar && <p className="text-xs text-slate-500">Onde: {c.ondeTrabalhar}</p>}
                      {c.formacao && <p className="text-xs text-slate-500">Formação: {c.formacao}</p>}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.competencias.map((k) => (
                          <Selo key={k}>{k}</Selo>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 text-xs">
                      <button className="text-sky-700 hover:underline" onClick={() => setEditando(c.id)}>
                        editar
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => window.confirm(`Remover ${c.titulo}?`) && enviar(() => api(`/carreiras/${c.id}`, 'DELETE'), recarregar)}
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
          <details>
            <summary className="cursor-pointer text-sm text-sky-700">Adicionar carreira</summary>
            <div className="mt-3">
              <Formulario onSubmit={(f) => enviar(() => api('/carreiras', 'POST', { cursoId, ordem: carreiras.length, ...dadosCarreira(f) }), recarregar)}>
                {camposCarreira()}
              </Formulario>
            </div>
          </details>
        </Card>

        <Card titulo="Novidades">
          <Formulario
            enviar="Publicar"
            onSubmit={(f) =>
              enviar(
                () =>
                  api('/novidades', 'POST', {
                    cursoId,
                    carreiraId: opcional(f.get('carreiraId')),
                    titulo: f.get('titulo'),
                    texto: f.get('texto'),
                    link: opcional(f.get('link')),
                  }),
                recarregarNovidades,
              )
            }
          >
            <input name="titulo" required placeholder="Título" className={`${inputCls} sm:col-span-2`} />
            <textarea name="texto" required rows={3} placeholder="Texto" className={`${inputCls} sm:col-span-2`} />
            <input name="link" type="url" placeholder="Link (opcional)" className={`${inputCls} sm:col-span-2`} />
            <select name="carreiraId" className={`${inputCls} sm:col-span-2`} defaultValue="">
              <option value="">Todas as carreiras do curso</option>
              {carreiras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
          </Formulario>
          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {novidades.map((n) => (
              <li key={n.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-slate-800">
                    {n.link ? (
                      <a href={n.link} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                        {n.titulo}
                      </a>
                    ) : (
                      n.titulo
                    )}
                  </p>
                  <button
                    className="shrink-0 text-xs text-red-600 hover:underline"
                    onClick={() => window.confirm('Remover esta novidade?') && enviar(() => api(`/novidades/${n.id}`, 'DELETE'), recarregarNovidades)}
                  >
                    remover
                  </button>
                </div>
                <p className="text-slate-600">{n.texto}</p>
                <p className="text-xs text-slate-500">
                  {data(n.publicadaEm)} {n.carreira && `· ${n.carreira.titulo}`}
                </p>
              </li>
            ))}
            {!novidades.length && <li className="py-2 text-slate-500">Nenhuma novidade publicada.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}
