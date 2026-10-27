import type { Evento, Ficha, Indicacao } from '../../tipos';

export interface FichaPortal extends Ficha {
  proximosEventos: Evento[];
  vagasAbertasDoCurso: number;
}

export interface EmpresaArea {
  id: string;
  nome: string;
  origem: 'PARCEIRA' | 'SCOUT';
  setor: string | null;
  endereco: string | null;
  site: string | null;
  latitude: number | null;
  longitude: number | null;
  interessado: boolean;
}

export interface Carreira {
  id: string;
  titulo: string;
  resumo: string;
  ondeTrabalhar: string | null;
  formacao: string | null;
  competencias: string[];
  ordem: number;
}

export interface Novidade {
  id: string;
  titulo: string;
  texto: string;
  link: string | null;
  publicadaEm: string;
  carreira: { id: string; titulo: string } | null;
}

export interface Carreiras {
  carreiras: Carreira[];
  novidades: Novidade[];
}

export type Aba = 'inicio' | 'ficha' | 'eventos' | 'carreiras' | 'oportunidades';

export const STATUS_AMIGAVEL: Record<Indicacao['status'], { texto: string; cor: string }> = {
  SUGERIDO: { texto: 'Em análise pela coordenação', cor: 'bg-slate-100 text-slate-700' },
  CONTATADO: { texto: 'A coordenação está conversando sobre esta vaga', cor: 'bg-amber-100 text-amber-800' },
  ENCAMINHADO: { texto: 'Seu perfil foi enviado para a empresa', cor: 'bg-sky-100 text-sky-800' },
  CONTRATADO: { texto: 'Você foi contratado(a)! Parabéns', cor: 'bg-emerald-100 text-emerald-800' },
  DESCARTADO: { texto: 'Não foi dessa vez. Siga se preparando', cor: 'bg-rose-100 text-rose-700' },
};
