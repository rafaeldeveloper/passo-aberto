import { useState } from 'react';
import { api, enviar, useApi } from '../api';
import { botaoSecCls, Campo, Card, data, Formulario, inputCls, linkCls, lista, opcional, perigoCls, resumoCls, Selo, Titulo, useEscola } from '../ui';

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
      <Campo rotulo="Como chegar lá (formação)">
        <input name="formacao" defaultValue={c?.formacao ?? ''} className={inputCls} />
      </Campo>
    </>
  );

  return (
    <>
      <Titulo
        subtitulo="O que os jovens do curso veem na aba Caminhos do app."
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card titulo={`Carreiras (${carreiras.length})`} className="lg:col-span-2">
          <ul className="mb-4 divide-y divide-line text-sm">
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
                  <button className={`${botaoSecCls} mt-2`} onClick={() => setEditando(undefined)}>
                    Cancelar
                  </button>
                </li>
              ) : (
                <li key={c.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink">{c.titulo}</p>
                      <p className="text-ink-2">{c.resumo}</p>
                      {c.ondeTrabalhar && <p className="text-xs text-ink-3">Onde trabalhar: {c.ondeTrabalhar}</p>}
                      {c.formacao && <p className="text-xs text-ink-3">Como chegar lá: {c.formacao}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.competencias.map((k) => (
                          <Selo key={k}>{k}</Selo>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 text-xs">
                      <button className="font-semibold text-accent-ink hover:underline" onClick={() => setEditando(c.id)}>
                        Editar
                      </button>
                      <button
                        className={perigoCls}
                        onClick={() => window.confirm(`Remover ${c.titulo}?`) && enviar(() => api(`/carreiras/${c.id}`, 'DELETE'), recarregar)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
          <details>
            <summary className={resumoCls}>Adicionar carreira</summary>
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
          <ul className="mt-4 divide-y divide-line text-sm">
            {novidades.map((n) => (
              <li key={n.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-ink">
                    {n.link ? (
                      <a href={n.link} target="_blank" rel="noreferrer" className={linkCls}>
                        {n.titulo}
                      </a>
                    ) : (
                      n.titulo
                    )}
                  </p>
                  <button
                    className={`${perigoCls} shrink-0`}
                    onClick={() => window.confirm('Remover esta novidade?') && enviar(() => api(`/novidades/${n.id}`, 'DELETE'), recarregarNovidades)}
                  >
                    Remover
                  </button>
                </div>
                <p className="text-ink-2">{n.texto}</p>
                <p className="text-xs text-ink-3">
                  {data(n.publicadaEm)} {n.carreira && `· ${n.carreira.titulo}`}
                </p>
              </li>
            ))}
            {!novidades.length && <li className="py-2 text-ink-3">Nenhuma novidade publicada.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}
