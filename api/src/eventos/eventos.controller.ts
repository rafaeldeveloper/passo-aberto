import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { CriarEventoDto, PresencasDto } from './eventos.dto';
import { EventosService } from './eventos.service';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventos: EventosService) {}

  @Get()
  listar() {
    return this.eventos.listar();
  }

  @Get(':id')
  buscar(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventos.buscar(id);
  }

  @Post()
  criar(@Body() dto: CriarEventoDto) {
    return this.eventos.criar(dto);
  }

  @Put(':id/presencas')
  registrarPresencas(@Param('id', ParseUUIDPipe) id: string, @Body() dto: PresencasDto) {
    return this.eventos.registrarPresencas(id, dto);
  }
}
