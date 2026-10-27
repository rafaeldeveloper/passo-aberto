import type { Evento, Ficha, Indicacao } from '../../tipos';
import { COORDENACAO } from '../../config';

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

export type Aba = 'inicio' | 'trabalhar' | 'caminhos' | 'agenda' | 'eu';

export type MotivoAjuda = 'oportunidade' | 'curriculo' | 'entrevista' | 'outra';

export type PedirAjuda = (motivo?: MotivoAjuda, contexto?: string) => void;

const PASSOS_INDICACAO = [
  { rotulo: 'Em análise', quem: `Com ${COORDENACAO}` },
  { rotulo: 'Conversa com a empresa', quem: `Com ${COORDENACAO}` },
  { rotulo: 'Perfil enviado', quem: 'Com a empresa' },
  { rotulo: 'Contratado(a)' },
];

export function linhaIndicacao(status: Indicacao['status']) {
  if (status === 'DESCARTADO') return { passos: PASSOS_INDICACAO.slice(0, 1), atual: 1, encerrado: 'neutro' as const };
  const atual = ['SUGERIDO', 'CONTATADO', 'ENCAMINHADO', 'CONTRATADO'].indexOf(status);
  return { passos: PASSOS_INDICACAO, atual, encerrado: status === 'CONTRATADO' ? ('sucesso' as const) : undefined };
}
