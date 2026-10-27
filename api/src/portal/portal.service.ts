import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AlunosService } from '../alunos/alunos.service';
import { CriarCertificacaoDto, CriarProjetoDto } from '../alunos/alunos.dto';
import { EstagiosService } from '../estagios/estagios.service';
import { PrismaService } from '../prisma/prisma.service';
import { VagasService } from '../vagas/vagas.service';
import { AcompanhamentoEstagioDto, AtualizarMinhaFichaDto, CriarVagaEmpresaDto, RespostaIndicacaoDto } from './portal.dto';

const VISIVEL_PARA_EMPRESA = ['ENCAMINHADO', 'CONTRATADO'] as const;

@Injectable()
export class PortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alunos: AlunosService,
    private readonly estagios: EstagiosService,
    private readonly vagas: VagasService,
  ) {}

  private async alunoId(token: string) {
    const aluno = await this.prisma.aluno.findUnique({ where: { tokenAcesso: token }, select: { id: true } });
    if (!aluno) throw new NotFoundException('Link inválido');
    return aluno.id;
  }

  private async empresa(token: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { tokenAcesso: token } });
    if (!empresa) throw new NotFoundException('Link inválido');
    return empresa;
  }

  async minhaFicha(token: string) {
    const { tokenAcesso, ...aluno } = await this.alunos.ficha(await this.alunoId(token));
    const vagasAbertasDoCurso = await this.prisma.vaga.count({ where: { cursoId: aluno.cursoId, aberta: true } });
    const proximosEventos = await this.prisma.evento.findMany({
      where: {
        escolaId: aluno.escolaId,
        data: { gte: new Date() },
        OR: [{ cursos: { none: {} } }, { cursos: { some: { id: aluno.cursoId } } }],
      },
      include: { mentor: true },
      orderBy: { data: 'asc' },
    });
    return {
      ...aluno,
      indicacoes: aluno.indicacoes.filter((i) => i.status !== 'SUGERIDO'),
      proximosEventos,
      vagasAbertasDoCurso,
    };
  }

  async atualizarMinhaFicha(token: string, dto: AtualizarMinhaFichaDto) {
    await this.alunos.atualizar(await this.alunoId(token), dto);
    return this.minhaFicha(token);
  }

  async adicionarCertificacao(token: string, dto: CriarCertificacaoDto) {
    return this.alunos.adicionarCertificacao(await this.alunoId(token), dto);
  }

  async removerCertificacao(token: string, id: string) {
    return this.alunos.removerCertificacao(await this.alunoId(token), id);
  }

  async adicionarProjeto(token: string, dto: CriarProjetoDto) {
    return this.alunos.adicionarProjeto(await this.alunoId(token), dto);
  }

  async removerProjeto(token: string, id: string) {
    return this.alunos.removerProjeto(await this.alunoId(token), id);
  }

  async empresasDaArea(token: string) {
    const aluno = await this.prisma.aluno.findUniqueOrThrow({ where: { id: await this.alunoId(token) } });
    const empresas = await this.prisma.empresa.findMany({
      where: { escolaId: aluno.escolaId, cursos: { some: { id: aluno.cursoId } } },
      select: {
        id: true,
        nome: true,
        origem: true,
        setor: true,
        endereco: true,
        site: true,
        latitude: true,
        longitude: true,
        interesses: { where: { alunoId: aluno.id }, select: { alunoId: true } },
      },
      orderBy: [{ origem: 'asc' }, { nome: 'asc' }],
    });
    return empresas.map(({ interesses, ...e }) => ({ ...e, interessado: interesses.length > 0 }));
  }

  async marcarInteresse(token: string, empresaId: string) {
    const aluno = await this.prisma.aluno.findUniqueOrThrow({ where: { id: await this.alunoId(token) } });
    const empresa = await this.prisma.empresa.findFirst({ where: { id: empresaId, escolaId: aluno.escolaId } });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');
    await this.prisma.interesseEmpresa.upsert({
      where: { alunoId_empresaId: { alunoId: aluno.id, empresaId } },
      update: {},
      create: { alunoId: aluno.id, empresaId },
    });
  }

  async removerInteresse(token: string, empresaId: string) {
    await this.prisma.interesseEmpresa.deleteMany({ where: { alunoId: await this.alunoId(token), empresaId } });
  }

  async carreiras(token: string) {
    const aluno = await this.prisma.aluno.findUniqueOrThrow({ where: { id: await this.alunoId(token) } });
    const [carreiras, novidades] = await Promise.all([
      this.prisma.carreira.findMany({
        where: { escolaId: aluno.escolaId, cursoId: aluno.cursoId },
        orderBy: [{ ordem: 'asc' }, { titulo: 'asc' }],
      }),
      this.prisma.novidade.findMany({
        where: { escolaId: aluno.escolaId, cursoId: aluno.cursoId },
        include: { carreira: { select: { id: true, titulo: true } } },
        orderBy: { publicadaEm: 'desc' },
        take: 30,
      }),
    ]);
    return { carreiras, novidades };
  }

  async painelEmpresa(token: string) {
    const { tokenAcesso, ...empresa } = await this.empresa(token);
    const [cursos, vagas, estagios] = await Promise.all([
      this.prisma.curso.findMany({ where: { escolaId: empresa.escolaId }, orderBy: { nome: 'asc' } }),
      this.prisma.vaga.findMany({
        where: { empresaId: empresa.id },
        include: {
          curso: true,
          indicacoes: {
            where: { status: { in: [...VISIVEL_PARA_EMPRESA] } },
            include: {
              aluno: {
                select: {
                  id: true,
                  nome: true,
                  turma: true,
                  anoConclusao: true,
                  resumo: true,
                  competencias: true,
                  curso: true,
                  certificacoes: true,
                  projetos: true,
                },
              },
            },
          },
        },
        orderBy: [{ aberta: 'desc' }, { criadaEm: 'desc' }],
      }),
      this.prisma.estagio.findMany({
        where: { empresaId: empresa.id, status: 'EM_ANDAMENTO' },
        include: { aluno: { select: { id: true, nome: true, turma: true, curso: true } } },
        orderBy: { inicio: 'desc' },
      }),
    ]);
    return { empresa, cursos, vagas, estagios };
  }

  async talentos(token: string) {
    const empresa = await this.empresa(token);
    const vagas = await this.prisma.vaga.findMany({ where: { empresaId: empresa.id, aberta: true }, include: { curso: true } });
    return Promise.all(
      vagas.map(async (vaga) => {
        const sugestoes = await this.vagas.sugestoes(vaga.id);
        return {
          vaga: { id: vaga.id, titulo: vaga.titulo, tipo: vaga.tipo, curso: vaga.curso.nome },
          talentos: sugestoes
            .filter((s) => !s.jaIndicado && !s.bloqueadoLgpd)
            .map((s) => ({
              id: s.aluno.id,
              anoConclusao: s.aluno.anoConclusao,
              competencias: s.aluno.competencias,
              certificacoes: s.certificacoes,
              projetos: s.projetos,
              compatibilidade: s.pontuacao >= 60 ? 'alta' : s.pontuacao >= 30 ? 'media' : 'baixa',
            })),
        };
      }),
    );
  }

  async pedirIndicacao(token: string, vagaId: string, alunoId: string) {
    const empresa = await this.empresa(token);
    const vaga = await this.prisma.vaga.findFirst({ where: { id: vagaId, empresaId: empresa.id, aberta: true } });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
    if (await this.prisma.indicacao.findUnique({ where: { vagaId_alunoId: { vagaId, alunoId } } })) {
      throw new ConflictException('Perfil já pedido ou indicado para esta vaga');
    }
    const disponivel = (await this.vagas.sugestoes(vagaId)).some((s) => s.aluno.id === alunoId && !s.jaIndicado && !s.bloqueadoLgpd);
    if (!disponivel) throw new NotFoundException('Perfil indisponível');
    await this.prisma.indicacao.create({ data: { vagaId, alunoId, pedidaPelaEmpresa: true, observacao: 'Pedido da empresa' } });
  }

  async criarVaga(token: string, dto: CriarVagaEmpresaDto) {
    const empresa = await this.empresa(token);
    return this.vagas.criar({ ...dto, empresaId: empresa.id });
  }

  async responderIndicacao(token: string, id: string, dto: RespostaIndicacaoDto) {
    const empresa = await this.empresa(token);
    const indicacao = await this.prisma.indicacao.findFirst({
      where: { id, vaga: { empresaId: empresa.id }, status: { in: [...VISIVEL_PARA_EMPRESA] } },
    });
    if (!indicacao) throw new NotFoundException('Indicação não encontrada');
    return this.vagas.atualizarIndicacao(id, dto);
  }

  async acompanharEstagio(token: string, id: string, dto: AcompanhamentoEstagioDto) {
    const empresa = await this.empresa(token);
    const estagio = await this.prisma.estagio.findFirst({ where: { id, empresaId: empresa.id } });
    if (!estagio) throw new NotFoundException('Estágio não encontrado');
    return this.estagios.atualizar(id, dto);
  }
}
