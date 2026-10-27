import { Injectable, NotFoundException } from '@nestjs/common';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { CriarEventoDto, PresencasDto } from './eventos.dto';

@Injectable()
export class EventosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar() {
    return this.prisma.evento.findMany({
      where: { escolaId: await this.escola.id() },
      include: { mentor: true, cursos: true, _count: { select: { presencas: true } } },
      orderBy: { data: 'desc' },
    });
  }

  async buscar(id: string) {
    const evento = await this.prisma.evento.findFirst({
      where: { id, escolaId: await this.escola.id() },
      include: { mentor: true, cursos: true, presencas: { include: { aluno: { include: { curso: true } } } } },
    });
    if (!evento) throw new NotFoundException('Evento não encontrado');
    return evento;
  }

  async criar({ cursoIds = [], ...dto }: CriarEventoDto) {
    return this.prisma.evento.create({
      data: { ...dto, data: new Date(dto.data), escolaId: await this.escola.id(), cursos: { connect: cursoIds.map((id) => ({ id })) } },
    });
  }

  async registrarPresencas(id: string, { alunoIds }: PresencasDto) {
    const evento = await this.buscar(id);
    const validos = await this.prisma.aluno.findMany({
      where: { id: { in: alunoIds }, escolaId: evento.escolaId },
      select: { id: true },
    });
    await this.prisma.$transaction([
      this.prisma.presenca.deleteMany({ where: { eventoId: id } }),
      this.prisma.presenca.createMany({ data: validos.map((a) => ({ eventoId: id, alunoId: a.id })) }),
    ]);
    return this.buscar(id);
  }
}
