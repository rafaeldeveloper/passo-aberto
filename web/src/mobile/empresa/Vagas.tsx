import type { FormEvent, KeyboardEvent } from 'react';
import { useState } from 'react';
import { api, enviar } from '../../api';
import { COORDENACAO } from '../../config';
import { Badge, BottomSheet, btnPeq, Card, EmptyState, Icone } from '../../ds';
import { TIPOS_VAGA } from '../../tipos';
import type { PainelEmpresa } from './tipos';
import { campoCls, dataCurta, Etiquetas, primarioCls, Rotulo, Secao } from './ui';

function NovaVaga({ token, cursos, fechar }: { token: string; cursos: PainelEmpresa['cursos']; fechar: () => void }) {
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
      fechar,
    );
    setSalvando(false);
  };

  return (
    <form onSubmit={salvar} className="space-y-6">
      <Secao titulo="Função">
        <Rotulo texto="Tipo">
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(TIPOS_VAGA) as (keyof typeof TIPOS_VAGA)[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tipo === t}
                onClick={() => setTipo(t)}
                className={`min-h-12 rounded-md px-3 text-sm font-semibold ${
                  tipo === t ? 'bg-accent-soft/40 text-accent-ink ring-2 ring-accent' : 'bg-surface text-ink-2 ring-1 ring-line'
                }`}
              >
                {TIPOS_VAGA[t]}
              </button>
            ))}
          </div>
        </Rotulo>
        <Rotulo texto="Título">
          <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Auxiliar de suporte de TI" className={campoCls} />
        </Rotulo>
      </Secao>
      <Secao titulo="Requisitos">
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
        <Rotulo texto="Competências desejadas">
          <div className="flex gap-2">
            <input value={termo} onChange={(e) => setTermo(e.target.value)} onKeyDown={teclar} placeholder="Digite e toque em +" className={campoCls} />
            <button
              type="button"
              onClick={adicionar}
              aria-label="Adicionar competência"
              className="grid min-h-12 w-12 shrink-0 place-items-center rounded-md bg-surface-2 text-ink ring-1 ring-line"
            >
              <Icone nome="mais" className="h-5 w-5" />
            </button>
          </div>
        </Rotulo>
        {competencias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {competencias.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCompetencias(competencias.filter((x) => x !== c))}
                aria-label={`Remover ${c}`}
                className="inline-flex min-h-9 items-center gap-1 rounded-full bg-brand-soft px-3 text-sm font-semibold text-brand-ink"
              >
                {c}
                <Icone nome="x" className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}
      </Secao>
      <Secao titulo="Local, prazo e como se candidatar">
        <Rotulo texto="Descrição">
          <textarea
            rows={5}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Atividades, local e modalidade (presencial, híbrido), horário, bolsa ou salário, prazo para candidatura e como se candidatar"
            className={campoCls}
          />
        </Rotulo>
      </Secao>
      <p className="flex items-start gap-2 text-sm text-ink-3">
        <Icone nome="escudo" className="mt-0.5 h-4 w-4 shrink-0" />
        {COORDENACAO} revisam a vaga e apresentam jovens com perfil próximo.
      </p>
      <button disabled={salvando} className={primarioCls}>
        {salvando ? 'Enviando...' : 'Enviar vaga'}
      </button>
    </form>
  );
}

export default function Vagas({ token, painel, recarregar }: { token: string; painel: PainelEmpresa; recarregar: () => void }) {
  const [criando, setCriando] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Vagas</h1>
          <p className="mt-1 text-sm text-ink-3">As oportunidades que sua empresa apresentou ao projeto.</p>
        </div>
        <button onClick={() => setCriando(true)} className={`${primarioCls} ${btnPeq} shrink-0`}>
          <Icone nome="mais" className="h-4 w-4" />
          Nova vaga
        </button>
      </div>
      <BottomSheet titulo="Nova vaga" aberta={criando} fechar={() => setCriando(false)}>
        <NovaVaga
          token={token}
          cursos={painel.cursos}
          fechar={() => {
            setCriando(false);
            recarregar();
          }}
        />
      </BottomSheet>
      {painel.vagas.length === 0 && (
        <EmptyState icone="vagas" titulo="Nenhuma vaga ainda" acao={{ rotulo: 'Apresentar uma vaga', onClick: () => setCriando(true) }}>
          Apresente uma oportunidade. {COORDENACAO} revisam e levam aos jovens com perfil próximo.
        </EmptyState>
      )}
      <div className="space-y-3">
        {painel.vagas.map((v) => {
          const contratados = v.indicacoes.filter((i) => i.status === 'CONTRATADO').length;
          const pendentes = v.indicacoes.length - contratados;
          return (
            <Card key={v.id}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{TIPOS_VAGA[v.tipo]}</Badge>
                {v.aberta ? <Badge tom="success">Aberta</Badge> : <Badge>Encerrada</Badge>}
                <span className="ml-auto text-xs text-ink-3 tabular-nums">{dataCurta(v.criadaEm)}</span>
              </div>
              <h3 className={`text-lg font-semibold ${v.aberta ? '' : 'text-ink-3'}`}>{v.titulo}</h3>
              <p className="text-sm text-ink-3">{v.curso.nome}</p>
              {v.descricao && <p className="mt-2 line-clamp-3 text-sm text-ink-2">{v.descricao}</p>}
              {v.competencias.length > 0 && (
                <div className="mt-3">
                  <Etiquetas itens={v.competencias} />
                </div>
              )}
              <p className="mt-3 flex items-start gap-2 text-xs text-ink-3">
                <Icone nome="escudo" className="h-4 w-4 shrink-0" />
                Revisada por {COORDENACAO} antes de chegar aos jovens
              </p>
              <div className="mt-3 flex gap-4 border-t border-line pt-3 text-sm text-ink-2">
                <span>
                  <strong className="text-ink tabular-nums">{pendentes}</strong> {pendentes === 1 ? 'candidato' : 'candidatos'}
                </span>
                {contratados > 0 && (
                  <span>
                    <strong className="text-success tabular-nums">{contratados}</strong> {contratados === 1 ? 'contratado' : 'contratados'}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
