import { useState } from 'react';
import { Link } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Empresa, Vaga } from '../tipos';
import { TIPOS_VAGA } from '../tipos';
import { Badge, botaoCls, botaoSecCls, Campo, Card, Formulario, inputCls, linkCls, lista, opcional, SelectCurso, Tabela, Titulo } from '../ui';

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
      <Titulo
        subtitulo="As sugestões de jovens são vistas só por vocês. A empresa recebe apenas quem vocês apresentarem."
        acao={
          <button className={nova ? botaoSecCls : botaoCls} onClick={() => setNova(!nova)}>
            {nova ? 'Cancelar' : 'Nova vaga'}
          </button>
        }
      >
        Vagas e indicações
      </Titulo>
      {nova && (
        <Card titulo="Cadastrar vaga" className="mb-6">
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
      <Tabela
        cabecalho={['Vaga', 'Empresa', 'Curso', 'Tipo', 'Indicados', 'Status']}
        vazio={!vagas.length && 'Nenhuma vaga ainda. Cadastre uma ou espere as empresas publicarem pelo app delas.'}
      >
        {vagas.map((v) => (
          <tr key={v.id} className={v.aberta ? '' : 'text-ink-3'}>
            <td>
              <Link to={`/vagas/${v.id}`} className={linkCls}>
                {v.titulo}
              </Link>
            </td>
            <td>{v.empresa.nome}</td>
            <td>{v.curso.nome}</td>
            <td>{TIPOS_VAGA[v.tipo]}</td>
            <td className="text-right tabular-nums">{v._count?.indicacoes}</td>
            <td>{v.aberta ? <Badge tom="success">Aberta</Badge> : <Badge>Fechada</Badge>}</td>
          </tr>
        ))}
      </Tabela>
    </>
  );
}
