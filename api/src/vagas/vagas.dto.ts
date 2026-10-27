import { StatusIndicacao, TipoVaga } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

const normalizar = ({ value }: { value: unknown }) =>
  Array.isArray(value) ? [...new Set(value.map((v) => String(v).trim().toLowerCase()).filter(Boolean))] : value;

export class CriarVagaDto {
  @IsUUID()
  empresaId: string;

  @IsUUID()
  cursoId: string;

  @IsEnum(TipoVaga)
  tipo: TipoVaga;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsArray()
  @Transform(normalizar)
  competencias: string[];
}

export class AtualizarVagaDto {
  @IsOptional()
  @IsBoolean()
  aberta?: boolean;

  @IsOptional()
  @IsString()
  descricao?: string;
}

export class CriarIndicacaoDto {
  @IsUUID()
  alunoId: string;
}

export class AtualizarIndicacaoDto {
  @IsOptional()
  @IsEnum(StatusIndicacao)
  status?: StatusIndicacao;

  @IsOptional()
  @IsString()
  observacao?: string;
}
