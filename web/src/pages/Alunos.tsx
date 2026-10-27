import { useState } from 'react';
import { Link } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Aluno, Situacao } from '../tipos';
import { SITUACOES } from '../tipos';
import { botaoSecCls, Campo, Card, Formulario, inputCls, lista, opcional, SelectCurso, SeloSituacao, Tabela, Titulo, useEscola } from '../ui';

export default function Alunos() {
  const escola = useEscola();
  const [filtro, setFiltro] = useState({ cursoId: '', situacao: '', busca: '' });
  const [novo, setNovo] = useState(false);
  const query = new URLSearchParams(Object.entries(filtro).filter(([, v]) => v)).toString();
  const { dados: alunos = [], recarregar } = useApi<Aluno[]>(`/alunos?${query}`);

  const criar = (f: FormData) =>
    enviar(
      () =>
        api('/alunos', 'POST', {
          nome: f.get('nome'),
          cursoId: f.get('cursoId'),
          turma: f.get('turma'),
          anoConclusao: Number(f.get('anoConclusao')),
          email: opcional(f.get('email')),
          menorDeIdade: f.get('menorDeIdade') === 'on',
          consentimentoResponsavel: f.get('consentimentoResponsavel') === 'on',
          competencias: lista(f.get('competencias')),
        }),
      () => {
        setNovo(false);
        recarregar();
      },
    );

  return (
    <>
      <Titulo acao={<button className={botaoSecCls} onClick={() => setNovo(!novo)}>{novo ? 'Cancelar' : 'Novo aluno'}</button>}>
        Alunos
      </Titulo>

      {novo && (
        <Card titulo="Cadastrar aluno" className="mb-4">
          <Formulario onSubmit={criar}>
            <Campo rotulo="Nome">
              <input name="nome" required className={inputCls} />
            </Campo>
            <Campo rotulo="Curso">
              <SelectCurso />
            </Campo>
            <Campo rotulo="Turma">
              <input name="turma" required placeholder="3º A" className={inputCls} />
            </Campo>
            <Campo rotulo="Ano de conclusão">
              <input name="anoConclusao" type="number" required defaultValue={new Date().getFullYear()} className={inputCls} />
            </Campo>
            <Campo rotulo="E-mail (opcional)">
              <input name="email" type="email" className={inputCls} />
            </Campo>
            <Campo rotulo="Competências (separadas por vírgula)">
              <input name="competencias" className={inputCls} />
            </Campo>
            <div className="flex flex-col gap-2 text-sm sm:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="menorDeIdade" defaultChecked /> Menor de idade
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="consentimentoResponsavel" /> Responsável autorizou compartilhar a ficha com empresas
              </label>
            </div>
          </Formulario>
        </Card>
      )}

      <Card>
        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          <input placeholder="Buscar por nome" className={inputCls} value={filtro.busca} onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })} />
          <select className={inputCls} value={filtro.cursoId} onChange={(e) => setFiltro({ ...filtro, cursoId: e.target.value })}>
            <option value="">Todos os cursos</option>
            {escola?.cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <select className={inputCls} value={filtro.situacao} onChange={(e) => setFiltro({ ...filtro, situacao: e.target.value })}>
            <option value="">Todas as situações</option>
            {(Object.keys(SITUACOES) as Situacao[]).map((s) => (
              <option key={s} value={s}>
                {SITUACOES[s]}
              </option>
            ))}
          </select>
        </div>
        <Tabela cabecalho={['Nome', 'Curso', 'Turma', 'Conclusão', 'Situação']} vazio={!alunos.length}>
          {alunos.map((a) => (
            <tr key={a.id}>
              <td className="py-2 pr-4">
                <Link to={`/alunos/${a.id}`} className="text-sky-700 hover:underline">
                  {a.nome}
                </Link>
              </td>
              <td className="pr-4">{a.curso.nome}</td>
              <td className="pr-4">{a.turma}</td>
              <td className="pr-4">{a.anoConclusao}</td>
              <td>
                <SeloSituacao situacao={a.situacao} />
              </td>
            </tr>
          ))}
        </Tabela>
      </Card>
    </>
  );
}
