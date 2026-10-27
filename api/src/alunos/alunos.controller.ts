import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { AtualizarAlunoDto, CriarAlunoDto, CriarCertificacaoDto, CriarProjetoDto, FiltroAlunosDto } from './alunos.dto';
import { AlunosService } from './alunos.service';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunos: AlunosService) {}

  @Get()
  listar(@Query() filtro: FiltroAlunosDto) {
    return this.alunos.listar(filtro);
  }

  @Get(':id')
  ficha(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunos.ficha(id);
  }

  @Post()
  criar(@Body() dto: CriarAlunoDto) {
    return this.alunos.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AtualizarAlunoDto) {
    return this.alunos.atualizar(id, dto);
  }

  @Post(':id/acesso')
  renovarAcesso(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunos.renovarAcesso(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunos.remover(id);
  }

  @Post(':id/certificacoes')
  adicionarCertificacao(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarCertificacaoDto) {
    return this.alunos.adicionarCertificacao(id, dto);
  }

  @Delete(':id/certificacoes/:certId')
  @HttpCode(204)
  removerCertificacao(@Param('id', ParseUUIDPipe) id: string, @Param('certId', ParseUUIDPipe) certId: string) {
    return this.alunos.removerCertificacao(id, certId);
  }

  @Post(':id/projetos')
  adicionarProjeto(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarProjetoDto) {
    return this.alunos.adicionarProjeto(id, dto);
  }

  @Delete(':id/projetos/:projetoId')
  @HttpCode(204)
  removerProjeto(@Param('id', ParseUUIDPipe) id: string, @Param('projetoId', ParseUUIDPipe) projetoId: string) {
    return this.alunos.removerProjeto(id, projetoId);
  }
}
