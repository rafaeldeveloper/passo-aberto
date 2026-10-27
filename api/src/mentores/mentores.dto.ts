import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CriarMentorDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  profissao: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsBoolean()
  exAluno?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  cursoIds?: string[];
}

export class AtualizarMentorDto extends PartialType(CriarMentorDto) {}
