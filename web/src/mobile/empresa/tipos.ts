import type { TIPOS_VAGA } from '../../tipos';

export interface AlunoCandidato {
  id: string;
  nome: string;
  turma: string;
  anoConclusao: number;
  resumo?: string;
  competencias: string[];
  curso: { nome: string };
  certificacoes: { id: string; nome: string; instituicao?: string; data?: string }[];
  projetos: { id: string; titulo: string; descricao?: string; link?: string }[];
}

export interface IndicacaoEmpresa {
  id: string;
  status: 'ENCAMINHADO' | 'CONTRATADO';
  observacao?: string;
  aluno: AlunoCandidato;
}

export interface VagaEmpresa {
  id: string;
  tipo: keyof typeof TIPOS_VAGA;
  titulo: string;
  descricao?: string;
  competencias: string[];
  aberta: boolean;
  criadaEm: string;
  curso: { nome: string };
  indicacoes: IndicacaoEmpresa[];
}

export interface EstagioEmpresa {
  id: string;
  inicio: string;
  fim?: string;
  cargaHorariaPrevista: number;
  cargaHorariaCumprida: number;
  avaliacaoNota?: number;
  avaliacaoComentario?: string;
  supervisorNome?: string;
  aluno: { nome: string; turma: string; curso: { nome: string } };
}

export interface PainelEmpresa {
  empresa: { id: string; nome: string; setor?: string; contatoNome?: string };
  cursos: { id: string; nome: string }[];
  vagas: VagaEmpresa[];
  estagios: EstagioEmpresa[];
}

export type Compatibilidade = 'alta' | 'media' | 'baixa';

export interface Talento {
  id: string;
  anoConclusao: number;
  competencias: string[];
  certificacoes: number;
  projetos: number;
  compatibilidade: Compatibilidade;
}

export interface TalentosVaga {
  vaga: { id: string; titulo: string; tipo: string; curso: string };
  talentos: Talento[];
}
