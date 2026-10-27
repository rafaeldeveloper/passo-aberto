import { TipoEvento } from '@prisma/client';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CriarEventoDto {
  @IsEnum(TipoEvento)
  tipo: TipoEvento;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsDateString()
  data: string;

  @IsOptional()
  @IsString()
  local?: string;

  @IsOptional()
  @IsUUID()
  mentorId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  cursoIds?: string[];
}

export class PresencasDto {
  @IsArray()
  @IsUUID('all', { each: true })
  alunoIds: string[];
}
