-- CreateEnum
CREATE TYPE "SituacaoAluno" AS ENUM ('SEM_ESTAGIO', 'ESTAGIANDO', 'CONCLUIDO', 'EMPREGADO');

-- CreateEnum
CREATE TYPE "StatusEstagio" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('PALESTRA', 'VISITA_TECNICA', 'MENTORIA');

-- CreateEnum
CREATE TYPE "TipoVaga" AS ENUM ('ESTAGIO', 'EMPREGO');

-- CreateEnum
CREATE TYPE "StatusIndicacao" AS ENUM ('SUGERIDO', 'CONTATADO', 'ENCAMINHADO', 'CONTRATADO', 'DESCARTADO');

-- CreateTable
CREATE TABLE "Escola" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,

    CONSTRAINT "Escola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "turma" TEXT NOT NULL,
    "anoConclusao" INTEGER NOT NULL,
    "menorDeIdade" BOOLEAN NOT NULL DEFAULT true,
    "consentimentoResponsavel" BOOLEAN NOT NULL DEFAULT false,
    "situacao" "SituacaoAluno" NOT NULL DEFAULT 'SEM_ESTAGIO',
    "resumo" TEXT,
    "competencias" TEXT[],
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificacao" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "instituicao" TEXT,
    "data" TIMESTAMP(3),

    CONSTRAINT "Certificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "link" TEXT,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "setor" TEXT,
    "contatoNome" TEXT,
    "contatoEmail" TEXT,
    "contatoTelefone" TEXT,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estagio" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "supervisorNome" TEXT,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3),
    "cargaHorariaPrevista" INTEGER NOT NULL,
    "cargaHorariaCumprida" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusEstagio" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "avaliacaoNota" INTEGER,
    "avaliacaoComentario" TEXT,

    CONSTRAINT "Estagio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "profissao" TEXT NOT NULL,
    "empresa" TEXT,
    "exAluno" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "mentorId" TEXT,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presenca" (
    "eventoId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,

    CONSTRAINT "Presenca_pkey" PRIMARY KEY ("eventoId","alunoId")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "tipo" "TipoVaga" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "competencias" TEXT[],
    "aberta" BOOLEAN NOT NULL DEFAULT true,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicacao" (
    "id" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "status" "StatusIndicacao" NOT NULL DEFAULT 'SUGERIDO',
    "observacao" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Indicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CursoToMentor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CursoToMentor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CursoToEvento" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CursoToEvento_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Escola_slug_key" ON "Escola"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_escolaId_nome_key" ON "Curso"("escolaId", "nome");

-- CreateIndex
CREATE INDEX "Aluno_escolaId_cursoId_idx" ON "Aluno"("escolaId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Indicacao_vagaId_alunoId_key" ON "Indicacao"("vagaId", "alunoId");

-- CreateIndex
CREATE INDEX "_CursoToMentor_B_index" ON "_CursoToMentor"("B");

-- CreateIndex
CREATE INDEX "_CursoToEvento_B_index" ON "_CursoToEvento"("B");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificacao" ADD CONSTRAINT "Certificacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estagio" ADD CONSTRAINT "Estagio_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estagio" ADD CONSTRAINT "Estagio_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estagio" ADD CONSTRAINT "Estagio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicacao" ADD CONSTRAINT "Indicacao_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicacao" ADD CONSTRAINT "Indicacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToMentor" ADD CONSTRAINT "_CursoToMentor_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToMentor" ADD CONSTRAINT "_CursoToMentor_B_fkey" FOREIGN KEY ("B") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToEvento" ADD CONSTRAINT "_CursoToEvento_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToEvento" ADD CONSTRAINT "_CursoToEvento_B_fkey" FOREIGN KEY ("B") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
