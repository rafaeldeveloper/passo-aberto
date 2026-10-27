import { Link } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Evento, Mentor } from '../tipos';
import { TIPOS_EVENTO } from '../tipos';
import { Campo, Card, dataHora, Formulario, inputCls, opcional, Selo, Titulo, useEscola } from '../ui';

const cursosMarcados = (f: FormData) => f.getAll('cursoIds').map(String);

export default function Comunidade() {
  const escola = useEscola();
  const { dados: mentores = [], recarregar: recarregarMentores } = useApi<Mentor[]>('/mentores');
  const { dados: eventos = [], recarregar: recarregarEventos } = useApi<Evento[]>('/eventos');

  const checkCursos = (
    <div className="flex flex-wrap gap-3 text-sm sm:col-span-2">
      {escola?.cursos.map((c) => (
        <label key={c.id} className="flex items-center gap-1">
          <input type="checkbox" name="cursoIds" value={c.id} /> {c.nome}
        </label>
      ))}
    </div>
  );

  return (
    <>
      <Titulo>Mentores e eventos</Titulo>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo={`Mentores (${mentores.length})`}>
          <ul className="mb-4 divide-y divide-slate-100 text-sm">
            {mentores.map((m) => (
              <li key={m.id} className="py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{m.nome}</span>
                  {m.exAluno && <Selo cor="bg-emerald-100 text-emerald-800">ex-aluno</Selo>}
                  {m.cursos.map((c) => (
                    <Selo key={c.id}>{c.nome}</Selo>
                  ))}
                </div>
                <p className="text-slate-500">
                  {[m.profissao, m.empresa, m.email, m.telefone].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
          <details>
            <summary className="cursor-pointer text-sm text-sky-700">Cadastrar mentor</summary>
            <div className="mt-3">
              <Formulario
                onSubmit={(f) =>
                  enviar(
                    () =>
                      api('/mentores', 'POST', {
                        nome: f.get('nome'),
                        profissao: f.get('profissao'),
                        empresa: opcional(f.get('empresa')),
                        email: opcional(f.get('email')),
                        telefone: opcional(f.get('telefone')),
                        exAluno: f.get('exAluno') === 'on',
                        cursoIds: cursosMarcados(f),
                      }),
                    recarregarMentores,
                  )
                }
              >
                <Campo rotulo="Nome">
                  <input name="nome" required className={inputCls} />
                </Campo>
                <Campo rotulo="Profissão">
                  <input name="profissao" required className={inputCls} />
                </Campo>
                <Campo rotulo="Empresa">
                  <input name="empresa" className={inputCls} />
                </Campo>
                <Campo rotulo="E-mail">
                  <input name="email" type="email" className={inputCls} />
                </Campo>
                <Campo rotulo="Telefone">
                  <input name="telefone" className={inputCls} />
                </Campo>
                <label className="flex items-center gap-2 self-end text-sm">
                  <input type="checkbox" name="exAluno" /> Ex-aluno da escola
                </label>
                {checkCursos}
              </Formulario>
            </div>
          </details>
        </Card>

        <Card titulo="Eventos">
          <ul className="mb-4 divide-y divide-slate-100 text-sm">
            {eventos.map((e) => (
              <li key={e.id} className="py-2">
                <Link to={`/eventos/${e.id}`} className="font-medium text-sky-700 hover:underline">
                  {e.titulo}
                </Link>
                <p className="text-slate-500">
                  {TIPOS_EVENTO[e.tipo]} · {dataHora(e.data)} {e.mentor && `· ${e.mentor.nome}`} · {e._count?.presencas} presentes
                </p>
              </li>
            ))}
          </ul>
          <details>
            <summary className="cursor-pointer text-sm text-sky-700">Criar evento</summary>
            <div className="mt-3">
              <Formulario
                onSubmit={(f) =>
                  enviar(
                    () =>
                      api('/eventos', 'POST', {
                        tipo: f.get('tipo'),
                        titulo: f.get('titulo'),
                        data: new Date(String(f.get('data'))).toISOString(),
                        local: opcional(f.get('local')),
                        descricao: opcional(f.get('descricao')),
                        mentorId: opcional(f.get('mentorId')),
                        cursoIds: cursosMarcados(f),
                      }),
                    recarregarEventos,
                  )
                }
              >
                <Campo rotulo="Tipo">
                  <select name="tipo" className={inputCls}>
                    {Object.entries(TIPOS_EVENTO).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo rotulo="Título">
                  <input name="titulo" required className={inputCls} />
                </Campo>
                <Campo rotulo="Data e hora">
                  <input name="data" type="datetime-local" required className={inputCls} />
                </Campo>
                <Campo rotulo="Local">
                  <input name="local" className={inputCls} />
                </Campo>
                <Campo rotulo="Mentor / palestrante">
                  <select name="mentorId" className={inputCls}>
                    <option value="">Nenhum</option>
                    {mentores.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo rotulo="Descrição">
                  <input name="descricao" className={inputCls} />
                </Campo>
                {checkCursos}
              </Formulario>
            </div>
          </details>
        </Card>
      </div>
    </>
  );
}
