import { PrismaClient } from '@prisma/client';
import { seedCarreiras } from './carreiras';

const prisma = new PrismaClient();

async function main() {
  const escola = await prisma.escola.upsert({
    where: { slug: process.env.ESCOLA_SLUG ?? 'eeep-piloto' },
    update: {},
    create: { slug: process.env.ESCOLA_SLUG ?? 'eeep-piloto', nome: 'EEEP Piloto', municipio: 'Cascavel' },
  });

  const nomes = ['Informática', 'Agroindústria', 'Turismo', 'Enfermagem'];
  const cursos = await Promise.all(
    nomes.map((nome) =>
      prisma.curso.upsert({
        where: { escolaId_nome: { escolaId: escola.id, nome } },
        update: {},
        create: { escolaId: escola.id, nome },
      }),
    ),
  );

  await seedCarreiras(prisma, escola.id);

  if ((await prisma.aluno.count()) > 0) return;

  const [info, agro, tur, enf] = cursos;
  const ano = new Date().getFullYear();

  const alunos = await Promise.all([
    { nome: 'Ana Souza', cursoId: info.id, turma: '3º A', anoConclusao: ano, competencias: ['javascript', 'html', 'suporte'], consentimentoResponsavel: true },
    { nome: 'Bruno Lima', cursoId: info.id, turma: '3º A', anoConclusao: ano, competencias: ['python', 'redes'] },
    { nome: 'Carla Alves', cursoId: agro.id, turma: '3º B', anoConclusao: ano, competencias: ['boas práticas de fabricação', 'laticínios'], consentimentoResponsavel: true },
    { nome: 'Diego Rocha', cursoId: tur.id, turma: '3º C', anoConclusao: ano, competencias: ['inglês', 'eventos', 'atendimento'], consentimentoResponsavel: true },
    { nome: 'Elisa Martins', cursoId: enf.id, turma: '3º D', anoConclusao: ano, competencias: ['primeiros socorros', 'sinais vitais'], consentimentoResponsavel: true },
    { nome: 'Felipe Costa', cursoId: info.id, turma: 'Egresso', anoConclusao: ano - 1, menorDeIdade: false, competencias: ['javascript', 'react', 'sql'] },
  ].map((a) => prisma.aluno.create({ data: { escolaId: escola.id, ...a } })));

  const empresas = await Promise.all([
    { nome: 'TechCE Soluções', setor: 'Tecnologia', contatoNome: 'Marcos', curso: info },
    { nome: 'Laticínios Serra Verde', setor: 'Agroindústria', contatoNome: 'Rita', curso: agro },
    { nome: 'Hospital Municipal', setor: 'Saúde', contatoNome: 'Dra. Paula', curso: enf },
  ].map(({ curso, ...e }) => prisma.empresa.create({ data: { escolaId: escola.id, ...e, cursos: { connect: [{ id: curso.id }] } } })));

  await prisma.estagio.create({
    data: { escolaId: escola.id, alunoId: alunos[4].id, empresaId: empresas[2].id, supervisorNome: 'Enf. Carlos', inicio: new Date(ano, 7, 1), cargaHorariaPrevista: 400, cargaHorariaCumprida: 120 },
  });
  await prisma.aluno.update({ where: { id: alunos[4].id }, data: { situacao: 'ESTAGIANDO' } });

  const mentor = await prisma.mentor.create({
    data: { escolaId: escola.id, nome: 'Joana Pereira', profissao: 'Desenvolvedora', empresa: 'TechCE Soluções', exAluno: true, cursos: { connect: [{ id: info.id }] } },
  });

  await prisma.evento.create({
    data: {
      escolaId: escola.id, tipo: 'PALESTRA', titulo: 'Primeiro emprego em TI', data: new Date(ano, 8, 15), local: 'Auditório',
      mentorId: mentor.id, cursos: { connect: [{ id: info.id }] },
      presencas: { create: [{ alunoId: alunos[0].id }, { alunoId: alunos[1].id }] },
    },
  });

  await prisma.vaga.create({
    data: { escolaId: escola.id, empresaId: empresas[0].id, cursoId: info.id, tipo: 'ESTAGIO', titulo: 'Estágio em suporte e desenvolvimento web', competencias: ['javascript', 'html', 'suporte'] },
  });
}

main().finally(() => prisma.$disconnect());
