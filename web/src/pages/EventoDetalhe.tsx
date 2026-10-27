import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api, enviar, useApi } from '../api';
import type { Aluno, Evento } from '../tipos';
import { TIPOS_EVENTO } from '../tipos';
import { botaoCls, Card, dataHora, Titulo } from '../ui';

export default function EventoDetalhe() {
  const { id } = useParams();
  const { dados: evento, recarregar } = useApi<Evento>(`/eventos/${id}`);
  const { dados: alunos = [] } = useApi<Aluno[]>('/alunos');
  const [presentes, setPresentes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (evento) setPresentes(new Set(evento.presencas?.map((p) => p.aluno.id)));
  }, [evento]);

  if (!evento) return null;

  const cursos = new Set(evento.cursos.map((c) => c.id));
  const convidados = cursos.size ? alunos.filter((a) => cursos.has(a.cursoId) || presentes.has(a.id)) : alunos;
  const alternar = (alunoId: string) => {
    const novo = new Set(presentes);
    if (novo.has(alunoId)) novo.delete(alunoId);
    else novo.add(alunoId);
    setPresentes(novo);
  };

  return (
    <>
      <Titulo subtitulo={[TIPOS_EVENTO[evento.tipo], dataHora(evento.data), evento.local, evento.mentor?.nome].filter(Boolean).join(' · ')}>
        {evento.titulo}
      </Titulo>
      {evento.descricao && <p className="-mt-3 mb-6 max-w-3xl text-sm text-ink-2">{evento.descricao}</p>}
      <Card titulo={`Lista de presença (${presentes.size})`}>
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {convidados.map((a) => (
            <label key={a.id} className="flex min-h-10 items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-surface-2">
              <input type="checkbox" checked={presentes.has(a.id)} onChange={() => alternar(a.id)} />
              {a.nome}{' '}
              <span className="text-xs text-ink-3">
                {a.curso.nome} · {a.turma}
              </span>
            </label>
          ))}
        </div>
        <button className={`${botaoCls} mt-4`} onClick={() => enviar(() => api(`/eventos/${id}/presencas`, 'PUT', { alunoIds: [...presentes] }), recarregar)}>
          Salvar presença
        </button>
      </Card>
    </>
  );
}
