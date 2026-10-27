-- CreateEnum
CREATE TYPE "OrigemEmpresa" AS ENUM ('PARCEIRA', 'SCOUT');

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "tokenAcesso" TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "origem" "OrigemEmpresa" NOT NULL DEFAULT 'PARCEIRA',
ADD COLUMN     "osmId" TEXT,
ADD COLUMN     "site" TEXT,
ADD COLUMN     "tokenAcesso" TEXT;

-- CreateTable
CREATE TABLE "_CursoToEmpresa" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CursoToEmpresa_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CursoToEmpresa_B_index" ON "_CursoToEmpresa"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_tokenAcesso_key" ON "Aluno"("tokenAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_tokenAcesso_key" ON "Empresa"("tokenAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_escolaId_osmId_key" ON "Empresa"("escolaId", "osmId");

-- AddForeignKey
ALTER TABLE "_CursoToEmpresa" ADD CONSTRAINT "_CursoToEmpresa_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToEmpresa" ADD CONSTRAINT "_CursoToEmpresa_B_fkey" FOREIGN KEY ("B") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

