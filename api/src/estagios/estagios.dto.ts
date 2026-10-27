import { StatusEstagio } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CriarEstagioDto {
  @IsUUID()
  alunoId: string;

  @IsUUID()
  empresaId: string;

  @IsOptional()
  @IsString()
  supervisorNome?: string;

  @IsDateString()
  inicio: string;

  @IsOptional()
  @IsDateString()
  fim?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cargaHorariaPrevista: number;
}

export class AtualizarEstagioDto {
  @IsOptional()
  @IsString()
  supervisorNome?: string;

  @IsOptional()
  @IsDateString()
  fim?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cargaHorariaCumprida?: number;

  @IsOptional()
  @IsEnum(StatusEstagio)
  status?: StatusEstagio;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10)
  avaliacaoNota?: number;

  @IsOptional()
  @IsString()
  avaliacaoComentario?: string;
}
