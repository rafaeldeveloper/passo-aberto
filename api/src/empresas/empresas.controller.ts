import { Body, Controller, Get, Param, ParseEnumPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { OrigemEmpresa } from '@prisma/client';
import { AtualizarEmpresaDto, CriarEmpresaDto } from './empresas.dto';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresas: EmpresasService) {}

  @Get()
  listar(
    @Query('origem', new ParseEnumPipe(OrigemEmpresa, { optional: true })) origem?: OrigemEmpresa,
    @Query('cursoId') cursoId?: string,
  ) {
    return this.empresas.listar(origem, cursoId || undefined);
  }

  @Get(':id')
  buscar(@Param('id', ParseUUIDPipe) id: string) {
    return this.empresas.buscar(id);
  }

  @Post()
  criar(@Body() dto: CriarEmpresaDto) {
    return this.empresas.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarEmpresaDto) {
    return this.empresas.atualizar(id, dto);
  }

  @Post(':id/parceria')
  tornarParceira(@Param('id', ParseUUIDPipe) id: string) {
    return this.empresas.tornarParceira(id);
  }

  @Post(':id/acesso')
  gerarAcesso(@Param('id', ParseUUIDPipe) id: string) {
    return this.empresas.gerarAcesso(id);
  }
}
