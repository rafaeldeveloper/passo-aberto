import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AtualizarIndicacaoDto, AtualizarVagaDto, CriarIndicacaoDto, CriarVagaDto } from './vagas.dto';
import { VagasService } from './vagas.service';

@Controller()
export class VagasController {
  constructor(private readonly vagas: VagasService) {}

  @Get('vagas')
  listar() {
    return this.vagas.listar();
  }

  @Get('vagas/:id')
  buscar(@Param('id', ParseUUIDPipe) id: string) {
    return this.vagas.buscar(id);
  }

  @Post('vagas')
  criar(@Body() dto: CriarVagaDto) {
    return this.vagas.criar(dto);
  }

  @Patch('vagas/:id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarVagaDto) {
    return this.vagas.atualizar(id, dto);
  }

  @Get('vagas/:id/sugestoes')
  sugestoes(@Param('id', ParseUUIDPipe) id: string) {
    return this.vagas.sugestoes(id);
  }

  @Post('vagas/:id/indicacoes')
  indicar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarIndicacaoDto) {
    return this.vagas.indicar(id, dto);
  }

  @Patch('indicacoes/:id')
  atualizarIndicacao(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarIndicacaoDto) {
    return this.vagas.atualizarIndicacao(id, dto);
  }
}
