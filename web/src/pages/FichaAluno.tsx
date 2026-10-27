import { Link, useNavigate, useParams } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Empresa, Ficha, Situacao } from '../tipos';
import { SITUACOES, STATUS_ESTAGIO, STATUS_INDICACAO, TIPOS_EVENTO, TIPOS_VAGA } from '../tipos';
import {
  botaoCls,
  botaoSecCls,
  Campo,
  Card,
  data,
  dataHora,
  Formulario,
  inputCls,
  linkCls,
  lista,
  opcional,
  perigoCls,
  resumoCls,
  Selo,
  SeloSituacao,
  Titulo,
} from '../ui';

export default function FichaAluno() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { dados: aluno, recarregar } = useApi<Ficha>(`/alunos/${id}`);
  const { dados: empresas = [] } = useApi<Empresa[]>('/empresas?origem=PARCEIRA');
  if (!aluno) return null;

  const atualizar = (dados: object) => enviar(() => api(`/alunos/${id}`, 'PATCH', dados), recarregar);

  const remover = () => {
    if (window.confirm(`Remover ${aluno.nome}?`))
      enviar(
        () => api(`/alunos/${id}`, 'DELETE'),
        () => navegar('/alunos'),
      );
  };

  return (
    <>
      <Titulo
        subtitulo={`${aluno.curso.nome} · ${aluno.turma} · conclusão em ${aluno.anoConclusao}`}
        acao={
          <button className={`${botaoSecCls} text-danger`} onClick={remover}>
            Remover participante
          </button>
        }
      >
        {aluno.nome} <SeloSituacao situacao={aluno.situacao} />
      </Titulo>
      <div className="-mt-3 mb-6 flex flex-wrap gap-2">
        <button
          className={botaoSecCls}
          onClick={() =>
            navigator.clipboard
              ?.writeText(`${window.location.origin}${import.meta.env.BASE_URL}app/aluno/${aluno.tokenAcesso}`)
              .then(() => window.alert('Link copiado'))
          }
        >
          Copiar link do app
        </button>
        <button
          className={botaoSecCls}
          title="Gera um link novo e invalida o anterior"
          onClick={() =>
            window.confirm('Gerar um link novo? O link atual deixa de funcionar.') && enviar(() => api(`/alunos/${id}/acesso`, 'POST'), recarregar)
          }
        >
          Novo link
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card titulo="Dados" className="lg:col-span-2">
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              atualizar({
                turma: f.get('turma'),
                anoConclusao: Number(f.get('anoConclusao')),
                email: opcional(f.get('email')),
                situacao: f.get('situacao'),
                resumo: opcional(f.get('resumo')),
                competencias: lista(f.get('competencias')),
                menorDeIdade: f.get('menorDeIdade') === 'on',
                consentimentoResponsavel: f.get('consentimentoResponsavel') === 'on',
              });
            }}
          >
            <Campo rotulo="Turma">
              <input name="turma" defaultValue={aluno.turma} className={inputCls} />
            </Campo>
            <Campo rotulo="Ano de conclusão">
              <input name="anoConclusao" type="number" defaultValue={aluno.anoConclusao} className={inputCls} />
            </Campo>
            <Campo rotulo="E-mail">
              <input name="email" type="email" defaultValue={aluno.email ?? ''} className={inputCls} />
            </Campo>
            <Campo rotulo="Situação">
              <select name="situacao" defaultValue={aluno.situacao} className={inputCls}>
                {(Object.keys(SITUACOES) as Situacao[]).map((s) => (
                  <option key={s} value={s}>
                    {SITUACOES[s]}
                  </option>
                ))}
              </select>
            </Campo>
            <div className="sm:col-span-2">
              <Campo rotulo="Competências (separadas por vírgula)">
                <input name="competencias" defaultValue={aluno.competencias.join(', ')} className={inputCls} />
              </Campo>
            </div>
            <div className="sm:col-span-2">
              <Campo rotulo="Resumo">
                <textarea name="resumo" rows={3} defaultValue={aluno.resumo ?? ''} className={inputCls} />
              </Campo>
            </div>
            <div className="flex flex-col gap-2 text-sm sm:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="menorDeIdade" defaultChecked={aluno.menorDeIdade} /> Menor de idade
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="consentimentoResponsavel" defaultChecked={aluno.consentimentoResponsavel} /> Responsável autorizou compartilhar a
                ficha com empresas
              </label>
            </div>
            <div>
              <button className={botaoCls}>Salvar alterações</button>
            </div>
          </form>
        </Card>

        <Card titulo="Encontros que participou">
          <ul className="space-y-2 text-sm">
            {aluno.presencas.map(({ evento }) => (
              <li key={evento.id}>
                <Link to={`/eventos/${evento.id}`} className={linkCls}>
                  {evento.titulo}
                </Link>
                <p className="text-xs text-ink-3">
                  {TIPOS_EVENTO[evento.tipo]} · {dataHora(evento.data)}
                </p>
              </li>
            ))}
            {!aluno.presencas.length && <li className="text-ink-3">Nenhuma participação registrada.</li>}
          </ul>
        </Card>

        <Card titulo="Estágios" className="lg:col-span-2">
          <ul className="mb-4 space-y-2 text-sm">
            {aluno.estagios.map((e) => (
              <li key={e.id} className="rounded-md bg-surface-2 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{e.empresa.nome}</span>
                  <Selo>{STATUS_ESTAGIO[e.status]}</Selo>
                </div>
                <p className="text-ink-3">
                  {data(e.inicio)} {e.fim && `até ${data(e.fim)}`} · {e.cargaHorariaCumprida}/{e.cargaHorariaPrevista}h
                  {e.supervisorNome && ` · supervisor: ${e.supervisorNome}`}
                  {e.avaliacaoNota != null && ` · nota ${e.avaliacaoNota}`}
                </p>
              </li>
            ))}
          </ul>
          <details>
            <summary className={resumoCls}>Registrar estágio</summary>
            <div className="mt-3">
              <Formulario
                enviar="Registrar"
                onSubmit={(f) =>
                  enviar(
                    () =>
                      api('/estagios', 'POST', {
                        alunoId: id,
                        empresaId: f.get('empresaId'),
                        supervisorNome: opcional(f.get('supervisorNome')),
                        inicio: f.get('inicio'),
                        fim: opcional(f.get('fim')),
                        cargaHorariaPrevista: Number(f.get('cargaHorariaPrevista')),
                      }),
                    recarregar,
                  )
                }
              >
                <Campo rotulo="Empresa parceira">
                  <select name="empresaId" required className={inputCls}>
                    <option value="">Selecione</option>
                    {empresas.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo rotulo="Supervisor">
                  <input name="supervisorNome" className={inputCls} />
                </Campo>
                <Campo rotulo="Início">
                  <input name="inicio" type="date" required className={inputCls} />
                </Campo>
                <Campo rotulo="Fim previsto">
                  <input name="fim" type="date" className={inputCls} />
                </Campo>
                <Campo rotulo="Carga horária prevista (h)">
                  <input name="cargaHorariaPrevista" type="number" min={1} required className={inputCls} />
                </Campo>
              </Formulario>
            </div>
          </details>
        </Card>

        <Card titulo="Indicações">
          <ul className="space-y-2 text-sm">
            {aluno.indicacoes.map((i) => (
              <li key={i.id}>
                <Link to={`/vagas/${i.vaga!.id}`} className={linkCls}>
                  {i.vaga!.titulo}
                </Link>
                <p className="text-xs text-ink-3">
                  {i.vaga!.empresa.nome} · {TIPOS_VAGA[i.vaga!.tipo]} · {STATUS_INDICACAO[i.status]}
                </p>
              </li>
            ))}
            {!aluno.indicacoes.length && <li className="text-ink-3">Nenhuma indicação.</li>}
          </ul>
        </Card>

        <Card titulo="Certificações">
          <ItensRemoviveis
            itens={aluno.certificacoes.map((c) => ({ id: c.id, texto: c.nome, detalhe: [c.instituicao, data(c.data)].filter(Boolean).join(' · ') }))}
            remover={(cid) => enviar(() => api(`/alunos/${id}/certificacoes/${cid}`, 'DELETE'), recarregar)}
          />
          <Formulario
            enviar="Adicionar"
            onSubmit={(f) =>
              enviar(
                () =>
                  api(`/alunos/${id}/certificacoes`, 'POST', {
                    nome: f.get('nome'),
                    instituicao: opcional(f.get('instituicao')),
                    data: opcional(f.get('data')),
                  }),
                recarregar,
              )
            }
          >
            <input name="nome" required placeholder="Certificação" className={`${inputCls} sm:col-span-2`} />
            <input name="instituicao" placeholder="Instituição" className={inputCls} />
            <input name="data" type="date" className={inputCls} />
          </Formulario>
        </Card>

        <Card titulo="Projetos" className="lg:col-span-2">
          <ItensRemoviveis
            itens={aluno.projetos.map((p) => ({ id: p.id, texto: p.titulo, detalhe: p.descricao, link: p.link }))}
            remover={(pid) => enviar(() => api(`/alunos/${id}/projetos/${pid}`, 'DELETE'), recarregar)}
          />
          <Formulario
            enviar="Adicionar"
            onSubmit={(f) =>
              enviar(
                () =>
                  api(`/alunos/${id}/projetos`, 'POST', { titulo: f.get('titulo'), descricao: opcional(f.get('descricao')), link: opcional(f.get('link')) }),
                recarregar,
              )
            }
          >
            <input name="titulo" required placeholder="Título" className={inputCls} />
            <input name="link" type="url" placeholder="Link (opcional)" className={inputCls} />
            <input name="descricao" placeholder="Descrição" className={`${inputCls} sm:col-span-2`} />
          </Formulario>
        </Card>
      </div>
    </>
  );
}

function ItensRemoviveis({ itens, remover }: { itens: { id: string; texto: string; detalhe?: string; link?: string }[]; remover: (id: string) => void }) {
  return (
    <ul className="mb-3 space-y-2 text-sm">
      {itens.map((i) => (
        <li key={i.id} className="flex items-start justify-between gap-2">
          <div>
            {i.link ? (
              <a href={i.link} target="_blank" rel="noreferrer" className={linkCls}>
                {i.texto}
              </a>
            ) : (
              <span className="font-medium">{i.texto}</span>
            )}
            {i.detalhe && <p className="text-xs text-ink-3">{i.detalhe}</p>}
          </div>
          <button onClick={() => remover(i.id)} className={perigoCls}>
            remover
          </button>
        </li>
      ))}
    </ul>
  );
}
