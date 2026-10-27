import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CriarEmpresaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  setor?: string;

  @IsOptional()
  @IsString()
  contatoNome?: string;

  @IsOptional()
  @IsEmail()
  contatoEmail?: string;

  @IsOptional()
  @IsString()
  contatoTelefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  cursoIds?: string[];
}

export class AtualizarEmpresaDto extends PartialType(CriarEmpresaDto) {}
