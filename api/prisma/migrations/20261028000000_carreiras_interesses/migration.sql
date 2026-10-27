-- CreateTable
CREATE TABLE "InteresseEmpresa" (
    "alunoId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteresseEmpresa_pkey" PRIMARY KEY ("alunoId","empresaId")
);

-- CreateTable
CREATE TABLE "Carreira" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "ondeTrabalhar" TEXT,
    "formacao" TEXT,
    "competencias" TEXT[],
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Carreira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Novidade" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "carreiraId" TEXT,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "link" TEXT,
    "publicadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Novidade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InteresseEmpresa" ADD CONSTRAINT "InteresseEmpresa_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteresseEmpresa" ADD CONSTRAINT "InteresseEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carreira" ADD CONSTRAINT "Carreira_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carreira" ADD CONSTRAINT "Carreira_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novidade" ADD CONSTRAINT "Novidade_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novidade" ADD CONSTRAINT "Novidade_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novidade" ADD CONSTRAINT "Novidade_carreiraId_fkey" FOREIGN KEY ("carreiraId") REFERENCES "Carreira"("id") ON DELETE SET NULL ON UPDATE CASCADE;

