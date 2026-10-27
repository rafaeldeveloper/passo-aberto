import { useState } from 'react';
import { Link } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Empresa, Vaga } from '../tipos';
import { TIPOS_VAGA } from '../tipos';
import { botaoSecCls, Campo, Card, Formulario, inputCls, lista, opcional, Selo, SelectCurso, Tabela, Titulo } from '../ui';

export default function Vagas() {
  const [nova, setNova] = useState(false);
  const { dados: vagas = [], recarregar } = useApi<Vaga[]>('/vagas');
  const { dados: empresas = [] } = useApi<Empresa[]>('/empresas?origem=PARCEIRA');

  const criar = (f: FormData) =>
    enviar(
      () =>
        api('/vagas', 'POST', {
          empresaId: f.get('empresaId'),
          cursoId: f.get('cursoId'),
          tipo: f.get('tipo'),
          titulo: f.get('titulo'),
          descricao: opcional(f.get('descricao')),
          competencias: lista(f.get('competencias')),
        }),
      () => {
        setNova(false);
        recarregar();
      },
    );

  return (
    <>
      <Titulo acao={<button className={botaoSecCls} onClick={() => setNova(!nova)}>{nova ? 'Cancelar' : 'Nova vaga'}</button>}>
        Vagas e match
      </Titulo>
      <p className="-mt-2 mb-4 text-sm text-slate-500">
        As sugestões de alunos são vistas só pela coordenação. A empresa recebe apenas quem a escola indicar.
      </p>
      {nova && (
        <Card titulo="Cadastrar vaga" className="mb-4">
          <Formulario onSubmit={criar}>
            <Campo rotulo="Empresa">
              <select name="empresaId" required className={inputCls}>
                <option value="">Selecione</option>
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Curso">
              <SelectCurso />
            </Campo>
            <Campo rotulo="Tipo">
              <select name="tipo" className={inputCls}>
                {Object.entries(TIPOS_VAGA).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Título">
              <input name="titulo" required className={inputCls} />
            </Campo>
            <Campo rotulo="Competências desejadas (separadas por vírgula)">
              <input name="competencias" className={inputCls} />
            </Campo>
            <Campo rotulo="Descrição">
              <input name="descricao" className={inputCls} />
            </Campo>
          </Formulario>
        </Card>
      )}
      <Card>
        <Tabela cabecalho={['Vaga', 'Empresa', 'Curso', 'Tipo', 'Indicados', '']} vazio={!vagas.length}>
          {vagas.map((v) => (
            <tr key={v.id} className={v.aberta ? '' : 'text-slate-400'}>
              <td className="py-2 pr-4">
                <Link to={`/vagas/${v.id}`} className="text-sky-700 hover:underline">
                  {v.titulo}
                </Link>
              </td>
              <td className="pr-4">{v.empresa.nome}</td>
              <td className="pr-4">{v.curso.nome}</td>
              <td className="pr-4">{TIPOS_VAGA[v.tipo]}</td>
              <td className="pr-4">{v._count?.indicacoes}</td>
              <td>{!v.aberta && <Selo>fechada</Selo>}</td>
            </tr>
          ))}
        </Tabela>
      </Card>
    </>
  );
}
