import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { CriarAlunoDto } from '../alunos/alunos.dto';
import { CriarVagaDto } from '../vagas/vagas.dto';

export class AtualizarMinhaFichaDto extends PickType(CriarAlunoDto, ['email', 'resumo', 'competencias'] as const) {}

export class CriarVagaEmpresaDto extends PickType(CriarVagaDto, ['cursoId', 'tipo', 'titulo', 'descricao', 'competencias'] as const) {}

export class RespostaIndicacaoDto {
  @IsIn(['CONTRATADO', 'DESCARTADO'])
  status: 'CONTRATADO' | 'DESCARTADO';

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class AcompanhamentoEstagioDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cargaHorariaCumprida?: number;

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

export class PedidoIndicacaoDto {
  @IsUUID()
  alunoId: string;
}
