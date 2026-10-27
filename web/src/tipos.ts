export type Situacao = 'SEM_ESTAGIO' | 'ESTAGIANDO' | 'CONCLUIDO' | 'EMPREGADO';

export const SITUACOES: Record<Situacao, string> = {
  SEM_ESTAGIO: 'Sem estágio',
  ESTAGIANDO: 'Estagiando',
  CONCLUIDO: 'Estágio concluído',
  EMPREGADO: 'Empregado',
};

export const TIPOS_EVENTO = { PALESTRA: 'Palestra', VISITA_TECNICA: 'Visita técnica', MENTORIA: 'Mentoria' };
export const TIPOS_VAGA = { ESTAGIO: 'Estágio', EMPREGO: 'Emprego' };
export const STATUS_ESTAGIO = { EM_ANDAMENTO: 'Em andamento', CONCLUIDO: 'Concluído', CANCELADO: 'Cancelado' };
export const STATUS_INDICACAO = {
  SUGERIDO: 'Sugerido',
  CONTATADO: 'Contatado',
  ENCAMINHADO: 'Encaminhado',
  CONTRATADO: 'Contratado',
  DESCARTADO: 'Descartado',
};

export interface Curso {
  id: string;
  nome: string;
}

export interface Escola {
  id: string;
  nome: string;
  municipio: string;
  cursos: Curso[];
}

export interface Empresa {
  id: string;
  nome: string;
  origem: 'PARCEIRA' | 'SCOUT';
  tokenAcesso?: string;
  endereco?: string;
  site?: string;
  latitude?: number;
  longitude?: number;
  osmId?: string;
  cursos?: Curso[];
  setor?: string;
  contatoNome?: string;
  contatoEmail?: string;
  contatoTelefone?: string;
  _count?: { estagios: number; vagas: number; interesses: number };
}

export interface Aluno {
  id: string;
  nome: string;
  tokenAcesso?: string;
  email?: string;
  turma: string;
  anoConclusao: number;
  cursoId: string;
  curso: Curso;
  menorDeIdade: boolean;
  consentimentoResponsavel: boolean;
  situacao: Situacao;
  resumo?: string;
  competencias: string[];
}

export interface Estagio {
  id: string;
  aluno: Aluno;
  empresa: Empresa;
  supervisorNome?: string;
  inicio: string;
  fim?: string;
  cargaHorariaPrevista: number;
  cargaHorariaCumprida: number;
  status: keyof typeof STATUS_ESTAGIO;
  avaliacaoNota?: number;
  avaliacaoComentario?: string;
}

export interface Mentor {
  id: string;
  nome: string;
  profissao: string;
  empresa?: string;
  email?: string;
  telefone?: string;
  exAluno: boolean;
  cursos: Curso[];
}

export interface Evento {
  id: string;
  tipo: keyof typeof TIPOS_EVENTO;
  titulo: string;
  descricao?: string;
  data: string;
  local?: string;
  mentor?: Mentor;
  cursos: Curso[];
  _count?: { presencas: number };
  presencas?: { aluno: Aluno }[];
}

export interface Vaga {
  id: string;
  tipo: keyof typeof TIPOS_VAGA;
  titulo: string;
  descricao?: string;
  competencias: string[];
  aberta: boolean;
  empresa: Empresa;
  curso: Curso;
  _count?: { indicacoes: number };
  indicacoes?: Indicacao[];
}

export interface Indicacao {
  id: string;
  status: keyof typeof STATUS_INDICACAO;
  pedidaPelaEmpresa?: boolean;
  observacao?: string;
  aluno: Aluno;
  vaga?: Vaga;
}

export interface Ficha extends Aluno {
  certificacoes: { id: string; nome: string; instituicao?: string; data?: string }[];
  projetos: { id: string; titulo: string; descricao?: string; link?: string }[];
  estagios: Estagio[];
  presencas: { evento: Evento }[];
  indicacoes: Indicacao[];
}
