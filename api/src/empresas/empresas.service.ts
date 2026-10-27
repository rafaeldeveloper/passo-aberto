import { Injectable, NotFoundException } from '@nestjs/common';
import { OrigemEmpresa } from '@prisma/client';
import { randomUUID } from 'crypto';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarEmpresaDto, CriarEmpresaDto } from './empresas.dto';

@Injectable()
export class EmpresasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar(origem?: OrigemEmpresa, cursoId?: string) {
    return this.prisma.empresa.findMany({
      where: { escolaId: await this.escola.id(), origem, cursos: cursoId ? { some: { id: cursoId } } : undefined },
      include: { cursos: true, _count: { select: { estagios: true, vagas: true, interesses: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async buscar(id: string) {
    const empresa = await this.prisma.empresa.findFirst({
      where: { id, escolaId: await this.escola.id() },
      include: {
        estagios: { include: { aluno: true } },
        vagas: { include: { curso: true } },
        interesses: { include: { aluno: { include: { curso: true } } }, orderBy: { criadoEm: 'desc' } },
      },
    });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');
    return empresa;
  }

  async criar({ cursoIds = [], ...dto }: CriarEmpresaDto) {
    return this.prisma.empresa.create({
      data: { ...dto, escolaId: await this.escola.id(), cursos: { connect: cursoIds.map((id) => ({ id })) } },
    });
  }

  async atualizar(id: string, { cursoIds, ...dto }: AtualizarEmpresaDto) {
    await this.buscar(id);
    return this.prisma.empresa.update({
      where: { id },
      data: { ...dto, cursos: cursoIds ? { set: cursoIds.map((cursoId) => ({ id: cursoId })) } : undefined },
    });
  }

  async tornarParceira(id: string) {
    await this.buscar(id);
    return this.prisma.empresa.update({ where: { id }, data: { origem: 'PARCEIRA' } });
  }

  async gerarAcesso(id: string) {
    await this.buscar(id);
    return this.prisma.empresa.update({ where: { id }, data: { origem: 'PARCEIRA', tokenAcesso: randomUUID() } });
  }
}
