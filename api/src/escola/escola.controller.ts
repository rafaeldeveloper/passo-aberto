import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { EscolaService } from './escola.service';

class CriarCursoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}

@Controller()
export class EscolaController {
  constructor(private readonly escola: EscolaService) {}

  @Get('escola')
  atual() {
    return this.escola.atual();
  }

  @Post('cursos')
  criarCurso(@Body() dto: CriarCursoDto) {
    return this.escola.criarCurso(dto.nome);
  }
}
