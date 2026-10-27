import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusEstagio } from '@prisma/client';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarEstagioDto, CriarEstagioDto } from './estagios.dto';

@Injectable()
export class EstagiosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar(status?: StatusEstagio) {
    return this.prisma.estagio.findMany({
      where: { escolaId: await this.escola.id(), status },
      include: { aluno: { include: { curso: true } }, empresa: true },
      orderBy: { inicio: 'desc' },
    });
  }

  async criar(dto: CriarEstagioDto) {
    const escolaId = await this.escola.id();
    const aluno = await this.prisma.aluno.findFirst({ where: { id: dto.alunoId, escolaId } });
    if (!aluno) throw new BadRequestException('Aluno não encontrado');
    const ativo = await this.prisma.estagio.findFirst({ where: { alunoId: dto.alunoId, status: 'EM_ANDAMENTO' } });
    if (ativo) throw new BadRequestException('Aluno já tem estágio em andamento');

    return this.prisma.$transaction(async (tx) => {
      const estagio = await tx.estagio.create({
        data: { ...dto, inicio: new Date(dto.inicio), fim: dto.fim ? new Date(dto.fim) : undefined, escolaId },
      });
      if (aluno.situacao !== 'EMPREGADO') {
        await tx.aluno.update({ where: { id: aluno.id }, data: { situacao: 'ESTAGIANDO' } });
      }
      return estagio;
    });
  }

  async atualizar(id: string, dto: AtualizarEstagioDto) {
    const estagio = await this.prisma.estagio.findFirst({
      where: { id, escolaId: await this.escola.id() },
      include: { aluno: true },
    });
    if (!estagio) throw new NotFoundException('Estágio não encontrado');

    return this.prisma.$transaction(async (tx) => {
      const atualizado = await tx.estagio.update({ where: { id }, data: { ...dto, fim: dto.fim ? new Date(dto.fim) : undefined } });
      if (dto.status && dto.status !== estagio.status && estagio.aluno.situacao !== 'EMPREGADO') {
        const concluiuAlgum = await tx.estagio.count({ where: { alunoId: estagio.alunoId, status: 'CONCLUIDO' } });
        const situacao = dto.status === 'EM_ANDAMENTO' ? 'ESTAGIANDO' : concluiuAlgum ? 'CONCLUIDO' : 'SEM_ESTAGIO';
        await tx.aluno.update({ where: { id: estagio.alunoId }, data: { situacao } });
      }
      return atualizado;
    });
  }
}
