import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { AtualizarMentorDto, CriarMentorDto } from './mentores.dto';
import { MentoresService } from './mentores.service';

@Controller('mentores')
export class MentoresController {
  constructor(private readonly mentores: MentoresService) {}

  @Get()
  listar(@Query('cursoId') cursoId?: string) {
    return this.mentores.listar(cursoId);
  }

  @Post()
  criar(@Body() dto: CriarMentorDto) {
    return this.mentores.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarMentorDto) {
    return this.mentores.atualizar(id, dto);
  }
}
