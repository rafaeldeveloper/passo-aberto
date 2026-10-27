import type { FormEvent, KeyboardEvent } from 'react';
import { useState } from 'react';
import { api, enviar } from '../../api';
import { TIPOS_VAGA } from '../../tipos';
import type { PainelEmpresa } from './tipos';
import { Bloco, Chip, Chips, Rotulo, Vazio, campoCls, dataCurta, primarioCls } from './ui';

function NovaVaga({ token, cursos, fechar }: { token: string; cursos: PainelEmpresa['cursos']; fechar: (criou: boolean) => void }) {
  const [cursoId, setCursoId] = useState('');
  const [tipo, setTipo] = useState<keyof typeof TIPOS_VAGA>('ESTAGIO');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [termo, setTermo] = useState('');
  const [salvando, setSalvando] = useState(false);

  const adicionar = () => {
    const novas = termo
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !competencias.includes(t));
    if (novas.length) setCompetencias([...competencias, ...new Set(novas)]);
    setTermo('');
  };

  const teclar = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      adicionar();
    }
  };

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    const todas = termo.trim() ? [...new Set([...competencias, termo.trim().toLowerCase()])] : competencias;
    setSalvando(true);
    await enviar(
      () =>
        api(`/portal/empresa/${token}/vagas`, 'POST', {
          cursoId,
          tipo,
          titulo,
          descricao: descricao || undefined,
          competencias: todas,
        }),
      () => fechar(true),
    );
    setSalvando(false);
  };

  return (
    <form onSubmit={salvar} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Nova vaga</h2>
        <button type="button" onClick={() => fechar(false)} className="text-sm font-medium text-slate-500">
          Cancelar
        </button>
      </div>
      <Rotulo texto="Tipo">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(TIPOS_VAGA) as (keyof typeof TIPOS_VAGA)[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                tipo === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-300 bg-white text-slate-600'
              }`}
            >
              {TIPOS_VAGA[t]}
            </button>
          ))}
        </div>
      </Rotulo>
      <Rotulo texto="Curso">
        <select required value={cursoId} onChange={(e) => setCursoId(e.target.value)} className={campoCls}>
          <option value="">Selecione o curso</option>
          {cursos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </Rotulo>
      <Rotulo texto="Título">
        <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Estágio em suporte de TI" className={campoCls} />
      </Rotulo>
      <Rotulo texto="Descrição">
        <textarea
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Atividades, horário, local, bolsa..."
          className={campoCls}
        />
      </Rotulo>
      <Rotulo texto="Competências desejadas">
        <div className="flex gap-2">
          <input
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            onKeyDown={teclar}
            placeholder="Digite e toque em +"
            className={campoCls}
          />
          <button type="button" onClick={adicionar} className="rounded-xl bg-slate-100 px-4 text-lg font-semibold text-slate-700">
            +
          </button>
        </div>
      </Rotulo>
      {competencias.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {competencias.map((c) => (
            <button key={c} type="button" onClick={() => setCompetencias(competencias.filter((x) => x !== c))}>
              <Chip cor="bg-indigo-50 text-indigo-700">{c} ×</Chip>
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500">A coordenação do Passo Aberto recebe a vaga e encaminha os alunos com perfil adequado.</p>
      <button disabled={salvando} className={primarioCls}>
        {salvando ? 'Publicando...' : 'Publicar vaga'}
      </button>
    </form>
  );
}

export default function Vagas({ token, painel, recarregar }: { token: string; painel: PainelEmpresa; recarregar: () => void }) {
  const [criando, setCriando] = useState(false);

  if (criando)
    return (
      <Bloco>
        <NovaVaga
          token={token}
          cursos={painel.cursos}
          fechar={(criou) => {
            setCriando(false);
            if (criou) recarregar();
          }}
        />
      </Bloco>
    );

  return (
    <div className="space-y-3">
      <button onClick={() => setCriando(true)} className={primarioCls}>
        + Nova vaga
      </button>
      {painel.vagas.length === 0 && <Vazio titulo="Nenhuma vaga ainda">Publique uma vaga para a coordenação indicar jovens.</Vazio>}
      {painel.vagas.map((v) => {
        const contratados = v.indicacoes.filter((i) => i.status === 'CONTRATADO').length;
        const pendentes = v.indicacoes.length - contratados;
        return (
          <Bloco key={v.id} className={v.aberta ? '' : 'opacity-70'}>
            <div className="mb-2 flex items-center gap-2">
              <Chip cor={v.tipo === 'ESTAGIO' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}>{TIPOS_VAGA[v.tipo]}</Chip>
              <Chip cor={v.aberta ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}>{v.aberta ? 'Aberta' : 'Encerrada'}</Chip>
              <span className="ml-auto text-xs text-slate-400">{dataCurta(v.criadaEm)}</span>
            </div>
            <h3 className="font-semibold text-slate-800">{v.titulo}</h3>
            <p className="text-sm text-slate-500">{v.curso.nome}</p>
            {v.descricao && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{v.descricao}</p>}
            {v.competencias.length > 0 && (
              <div className="mt-3">
                <Chips itens={v.competencias} />
              </div>
            )}
            <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-sm">
              <span className="text-slate-600">
                <strong className="text-slate-800">{pendentes}</strong> {pendentes === 1 ? 'candidato' : 'candidatos'}
              </span>
              {contratados > 0 && (
                <span className="text-slate-600">
                  <strong className="text-emerald-700">{contratados}</strong> {contratados === 1 ? 'contratado' : 'contratados'}
                </span>
              )}
            </div>
          </Bloco>
        );
      })}
    </div>
  );
}
