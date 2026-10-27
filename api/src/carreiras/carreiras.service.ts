import { Injectable, NotFoundException } from '@nestjs/common';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarCarreiraDto, CriarCarreiraDto, CriarNovidadeDto } from './carreiras.dto';

@Injectable()
export class CarreirasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar(cursoId?: string) {
    return this.prisma.carreira.findMany({
      where: { escolaId: await this.escola.id(), cursoId },
      include: { curso: true, _count: { select: { novidades: true } } },
      orderBy: [{ curso: { nome: 'asc' } }, { ordem: 'asc' }, { titulo: 'asc' }],
    });
  }

  async criar(dto: CriarCarreiraDto) {
    return this.prisma.carreira.create({ data: { ...dto, escolaId: await this.escola.id() } });
  }

  async atualizar(id: string, dto: AtualizarCarreiraDto) {
    await this.buscar(id);
    return this.prisma.carreira.update({ where: { id }, data: dto });
  }

  async remover(id: string) {
    await this.buscar(id);
    await this.prisma.carreira.delete({ where: { id } });
  }

  async listarNovidades(cursoId?: string) {
    return this.prisma.novidade.findMany({
      where: { escolaId: await this.escola.id(), cursoId },
      include: { curso: true, carreira: true },
      orderBy: { publicadaEm: 'desc' },
    });
  }

  async criarNovidade(dto: CriarNovidadeDto) {
    return this.prisma.novidade.create({ data: { ...dto, escolaId: await this.escola.id() } });
  }

  async removerNovidade(id: string) {
    await this.prisma.novidade.deleteMany({ where: { id, escolaId: await this.escola.id() } });
  }

  private async buscar(id: string) {
    const carreira = await this.prisma.carreira.findFirst({ where: { id, escolaId: await this.escola.id() } });
    if (!carreira) throw new NotFoundException('Carreira não encontrada');
    return carreira;
  }
}
