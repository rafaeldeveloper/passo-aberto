import { Injectable, NotFoundException } from '@nestjs/common';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarMentorDto, CriarMentorDto } from './mentores.dto';

@Injectable()
export class MentoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar(cursoId?: string) {
    return this.prisma.mentor.findMany({
      where: { escolaId: await this.escola.id(), cursos: cursoId ? { some: { id: cursoId } } : undefined },
      include: { cursos: true, _count: { select: { eventos: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async criar({ cursoIds = [], ...dto }: CriarMentorDto) {
    return this.prisma.mentor.create({
      data: { ...dto, escolaId: await this.escola.id(), cursos: { connect: cursoIds.map((id) => ({ id })) } },
      include: { cursos: true },
    });
  }

  async atualizar(id: string, { cursoIds, ...dto }: AtualizarMentorDto) {
    const existe = await this.prisma.mentor.findFirst({ where: { id, escolaId: await this.escola.id() } });
    if (!existe) throw new NotFoundException('Mentor não encontrado');
    return this.prisma.mentor.update({
      where: { id },
      data: { ...dto, cursos: cursoIds ? { set: cursoIds.map((cursoId) => ({ id: cursoId })) } : undefined },
      include: { cursos: true },
    });
  }
}
