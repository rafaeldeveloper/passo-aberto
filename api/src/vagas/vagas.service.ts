import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EscolaService } from '../escola/escola.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarIndicacaoDto, AtualizarVagaDto, CriarIndicacaoDto, CriarVagaDto } from './vagas.dto';

@Injectable()
export class VagasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escola: EscolaService,
  ) {}

  async listar() {
    return this.prisma.vaga.findMany({
      where: { escolaId: await this.escola.id() },
      include: { empresa: true, curso: true, _count: { select: { indicacoes: true } } },
      orderBy: [{ aberta: 'desc' }, { criadaEm: 'desc' }],
    });
  }

  async buscar(id: string) {
    const vaga = await this.prisma.vaga.findFirst({
      where: { id, escolaId: await this.escola.id() },
      include: {
        empresa: true,
        curso: true,
        indicacoes: { include: { aluno: { include: { curso: true } } }, orderBy: { criadaEm: 'desc' } },
      },
    });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
    return vaga;
  }

  async criar(dto: CriarVagaDto) {
    return this.prisma.vaga.create({ data: { ...dto, escolaId: await this.escola.id() } });
  }

  async atualizar(id: string, dto: AtualizarVagaDto) {
    await this.buscar(id);
    return this.prisma.vaga.update({ where: { id }, data: dto });
  }

  async sugestoes(id: string) {
    const vaga = await this.buscar(id);
    const ano = new Date().getFullYear();
    const candidatos = await this.prisma.aluno.findMany({
      where: {
        escolaId: vaga.escolaId,
        cursoId: vaga.cursoId,
        situacao: { in: ['SEM_ESTAGIO', 'CONCLUIDO'] },
        anoConclusao: vaga.tipo === 'ESTAGIO' ? { gte: ano } : { lte: ano },
      },
      include: { _count: { select: { certificacoes: true, projetos: true, presencas: true } } },
    });
    const indicados = new Set(vaga.indicacoes.map((i) => i.alunoId));

    return candidatos
      .map((aluno) => {
        const comuns = vaga.competencias.filter((c) => aluno.competencias.includes(c));
        const motivos = comuns.length ? [`Competências: ${comuns.join(', ')}`] : [];
        let pontos = vaga.competencias.length ? (comuns.length / vaga.competencias.length) * 70 : 0;
        if (aluno._count.certificacoes) {
          pontos += Math.min(aluno._count.certificacoes, 2) * 10;
          motivos.push(`${aluno._count.certificacoes} certificação(ões)`);
        }
        if (aluno._count.presencas) {
          pontos += 10;
          motivos.push(`Participou de ${aluno._count.presencas} evento(s)`);
        }
        return {
          aluno: { id: aluno.id, nome: aluno.nome, turma: aluno.turma, situacao: aluno.situacao, anoConclusao: aluno.anoConclusao, competencias: aluno.competencias },
          certificacoes: aluno._count.certificacoes,
          projetos: aluno._count.projetos,
          pontuacao: Math.round(pontos),
          motivos,
          jaIndicado: indicados.has(aluno.id),
          bloqueadoLgpd: aluno.menorDeIdade && !aluno.consentimentoResponsavel,
        };
      })
      .sort((a, b) => b.pontuacao - a.pontuacao);
  }

  async indicar(vagaId: string, { alunoId }: CriarIndicacaoDto) {
    const vaga = await this.buscar(vagaId);
    const aluno = await this.prisma.aluno.findFirst({ where: { id: alunoId, escolaId: vaga.escolaId } });
    if (!aluno) throw new BadRequestException('Aluno não encontrado');
    if (aluno.menorDeIdade && !aluno.consentimentoResponsavel) {
      throw new BadRequestException('Aluno menor de idade sem consentimento do responsável');
    }
    if (vaga.indicacoes.some((i) => i.alunoId === alunoId)) throw new ConflictException('Aluno já indicado para esta vaga');
    return this.prisma.indicacao.create({ data: { vagaId, alunoId } });
  }

  async atualizarIndicacao(id: string, dto: AtualizarIndicacaoDto) {
    const indicacao = await this.prisma.indicacao.findFirst({
      where: { id, vaga: { escolaId: await this.escola.id() } },
      include: { vaga: true },
    });
    if (!indicacao) throw new NotFoundException('Indicação não encontrada');

    return this.prisma.$transaction(async (tx) => {
      const atualizada = await tx.indicacao.update({ where: { id }, data: dto });
      if (dto.status === 'CONTRATADO' && indicacao.vaga.tipo === 'EMPREGO') {
        await tx.aluno.update({ where: { id: indicacao.alunoId }, data: { situacao: 'EMPREGADO' } });
      }
      return atualizada;
    });
  }
}
