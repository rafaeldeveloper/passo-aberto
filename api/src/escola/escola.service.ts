import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EscolaService {
  private escolaId?: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async id() {
    if (this.escolaId) return this.escolaId;
    const slug = this.config.get<string>('ESCOLA_SLUG', 'eeep-piloto');
    const escola = await this.prisma.escola.findUnique({ where: { slug } });
    if (!escola) throw new NotFoundException(`Escola ${slug} não encontrada`);
    this.escolaId = escola.id;
    return escola.id;
  }

  async atual() {
    return this.prisma.escola.findUnique({
      where: { id: await this.id() },
      include: { cursos: { orderBy: { nome: 'asc' } } },
    });
  }

  async criarCurso(nome: string) {
    return this.prisma.curso.create({ data: { escolaId: await this.id(), nome } });
  }
}
