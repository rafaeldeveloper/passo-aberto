import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { AtualizarCarreiraDto, CriarCarreiraDto, CriarNovidadeDto } from './carreiras.dto';
import { CarreirasService } from './carreiras.service';

@Controller()
export class CarreirasController {
  constructor(private readonly carreiras: CarreirasService) {}

  @Get('carreiras')
  listar(@Query('cursoId') cursoId?: string) {
    return this.carreiras.listar(cursoId || undefined);
  }

  @Post('carreiras')
  criar(@Body() dto: CriarCarreiraDto) {
    return this.carreiras.criar(dto);
  }

  @Patch('carreiras/:id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarCarreiraDto) {
    return this.carreiras.atualizar(id, dto);
  }

  @Delete('carreiras/:id')
  @HttpCode(204)
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.carreiras.remover(id);
  }

  @Get('novidades')
  listarNovidades(@Query('cursoId') cursoId?: string) {
    return this.carreiras.listarNovidades(cursoId || undefined);
  }

  @Post('novidades')
  criarNovidade(@Body() dto: CriarNovidadeDto) {
    return this.carreiras.criarNovidade(dto);
  }

  @Delete('novidades/:id')
  @HttpCode(204)
  removerNovidade(@Param('id', ParseUUIDPipe) id: string) {
    return this.carreiras.removerNovidade(id);
  }
}
