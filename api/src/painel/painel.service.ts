import { Injectable } from '@nestjs/common';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PainelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async resumo() {
    const escolaId = await this.escola.id();
    const ano = new Date().getFullYear();

    const [cursos, porSituacao, terceiroSemEstagio, proximosEventos, vagasAbertas, egressos, pedidosEmpresas] = await Promise.all([
      this.prisma.curso.findMany({ where: { escolaId }, orderBy: { nome: 'asc' } }),
      this.prisma.aluno.groupBy({
        by: ['cursoId', 'situacao'],
        where: { escolaId, anoConclusao: { gte: ano } },
        _count: true,
      }),
      this.prisma.aluno.findMany({
        where: { escolaId, anoConclusao: ano, situacao: 'SEM_ESTAGIO' },
        include: { curso: true },
        orderBy: [{ turma: 'asc' }, { nome: 'asc' }],
      }),
      this.prisma.evento.findMany({
        where: { escolaId, data: { gte: new Date() } },
        include: { mentor: true },
        orderBy: { data: 'asc' },
        take: 5,
      }),
      this.prisma.vaga.count({ where: { escolaId, aberta: true } }),
      this.prisma.aluno.groupBy({
        by: ['situacao'],
        where: { escolaId, anoConclusao: { lt: ano } },
        _count: true,
      }),
      this.prisma.indicacao.findMany({
        where: { pedidaPelaEmpresa: true, status: 'SUGERIDO', vaga: { escolaId } },
        include: { aluno: true, vaga: { include: { empresa: true } } },
        orderBy: { criadaEm: 'desc' },
      }),
    ]);

    const totalEgressos = egressos.reduce((s, e) => s + e._count, 0);
    const egressosEmpregados = egressos.find((e) => e.situacao === 'EMPREGADO')?._count ?? 0;

    return {
      cursos: cursos.map((curso) => {
        const linhas = porSituacao.filter((p) => p.cursoId === curso.id);
        const situacoes = Object.fromEntries(linhas.map((l) => [l.situacao, l._count]));
        return { id: curso.id, nome: curso.nome, total: linhas.reduce((s, l) => s + l._count, 0), situacoes };
      }),
      terceiroSemEstagio,
      proximosEventos,
      vagasAbertas,
      pedidosEmpresas,
      egressos: { total: totalEgressos, empregados: egressosEmpregados },
    };
  }
}
