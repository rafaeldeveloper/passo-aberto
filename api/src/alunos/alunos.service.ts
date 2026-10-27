import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarAlunoDto, CriarAlunoDto, CriarCertificacaoDto, CriarProjetoDto, FiltroAlunosDto } from './alunos.dto';

@Injectable()
export class AlunosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar(filtro: FiltroAlunosDto) {
    return this.prisma.aluno.findMany({
      where: {
        escolaId: await this.escola.id(),
        cursoId: filtro.cursoId,
        situacao: filtro.situacao,
        turma: filtro.turma,
        nome: filtro.busca ? { contains: filtro.busca, mode: 'insensitive' } : undefined,
      },
      include: { curso: true },
      orderBy: [{ turma: 'asc' }, { nome: 'asc' }],
    });
  }

  async ficha(id: string) {
    const aluno = await this.prisma.aluno.findFirst({
      where: { id, escolaId: await this.escola.id() },
      include: {
        curso: true,
        certificacoes: { orderBy: { data: 'desc' } },
        projetos: true,
        estagios: { include: { empresa: true }, orderBy: { inicio: 'desc' } },
        presencas: { include: { evento: true }, orderBy: { evento: { data: 'desc' } } },
        indicacoes: { include: { vaga: { include: { empresa: true } } }, orderBy: { criadaEm: 'desc' } },
      },
    });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }

  async criar(dto: CriarAlunoDto) {
    return this.prisma.aluno.create({ data: { ...dto, escolaId: await this.escola.id() } });
  }

  async atualizar(id: string, dto: AtualizarAlunoDto) {
    await this.ficha(id);
    return this.prisma.aluno.update({ where: { id }, data: dto });
  }

  async renovarAcesso(id: string) {
    await this.ficha(id);
    return this.prisma.aluno.update({ where: { id }, data: { tokenAcesso: randomUUID() } });
  }

  async remover(id: string) {
    await this.ficha(id);
    await this.prisma.aluno.delete({ where: { id } });
  }

  async adicionarCertificacao(alunoId: string, dto: CriarCertificacaoDto) {
    await this.ficha(alunoId);
    return this.prisma.certificacao.create({ data: { ...dto, data: dto.data ? new Date(dto.data) : undefined, alunoId } });
  }

  async removerCertificacao(alunoId: string, id: string) {
    await this.prisma.certificacao.deleteMany({ where: { id, alunoId } });
  }

  async adicionarProjeto(alunoId: string, dto: CriarProjetoDto) {
    await this.ficha(alunoId);
    return this.prisma.projeto.create({ data: { ...dto, alunoId } });
  }

  async removerProjeto(alunoId: string, id: string) {
    await this.prisma.projeto.deleteMany({ where: { id, alunoId } });
  }
}
