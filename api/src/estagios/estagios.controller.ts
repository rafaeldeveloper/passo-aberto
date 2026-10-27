import { Body, Controller, Get, Param, ParseEnumPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { StatusEstagio } from '@prisma/client';
import { AtualizarEstagioDto, CriarEstagioDto } from './estagios.dto';
import { EstagiosService } from './estagios.service';

@Controller('estagios')
export class EstagiosController {
  constructor(private readonly estagios: EstagiosService) {}

  @Get()
  listar(@Query('status', new ParseEnumPipe(StatusEstagio, { optional: true })) status?: StatusEstagio) {
    return this.estagios.listar(status);
  }

  @Post()
  criar(@Body() dto: CriarEstagioDto) {
    return this.estagios.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarEstagioDto) {
    return this.estagios.atualizar(id, dto);
  }
}
