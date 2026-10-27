import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

const normalizar = ({ value }: { value: unknown }) =>
  Array.isArray(value) ? [...new Set(value.map((v) => String(v).trim().toLowerCase()).filter(Boolean))] : value;

export class CriarCarreiraDto {
  @IsUUID()
  cursoId: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  resumo: string;

  @IsOptional()
  @IsString()
  ondeTrabalhar?: string;

  @IsOptional()
  @IsString()
  formacao?: string;

  @IsOptional()
  @IsArray()
  @Transform(normalizar)
  competencias?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ordem?: number;
}

export class AtualizarCarreiraDto extends PartialType(CriarCarreiraDto) {}

export class CriarNovidadeDto {
  @IsUUID()
  cursoId: string;

  @IsOptional()
  @IsUUID()
  carreiraId?: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
