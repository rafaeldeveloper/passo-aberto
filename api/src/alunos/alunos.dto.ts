import { PartialType } from '@nestjs/mapped-types';
import { SituacaoAluno } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

const normalizar = ({ value }: { value: unknown }) =>
  Array.isArray(value) ? [...new Set(value.map((v) => String(v).trim().toLowerCase()).filter(Boolean))] : value;

export class CriarAlunoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsUUID()
  cursoId: string;

  @IsString()
  @IsNotEmpty()
  turma: string;

  @Type(() => Number)
  @IsInt()
  anoConclusao: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  menorDeIdade?: boolean;

  @IsOptional()
  @IsBoolean()
  consentimentoResponsavel?: boolean;

  @IsOptional()
  @IsEnum(SituacaoAluno)
  situacao?: SituacaoAluno;

  @IsOptional()
  @IsString()
  resumo?: string;

  @IsOptional()
  @IsArray()
  @Transform(normalizar)
  competencias?: string[];
}

export class AtualizarAlunoDto extends PartialType(CriarAlunoDto) {}

export class FiltroAlunosDto {
  @IsOptional()
  @IsUUID()
  cursoId?: string;

  @IsOptional()
  @IsEnum(SituacaoAluno)
  situacao?: SituacaoAluno;

  @IsOptional()
  @IsString()
  turma?: string;

  @IsOptional()
  @IsString()
  busca?: string;
}

export class CriarCertificacaoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  instituicao?: string;

  @IsOptional()
  @IsDateString()
  data?: string;
}

export class CriarProjetoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
