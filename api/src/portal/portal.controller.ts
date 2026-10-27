import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { CriarCertificacaoDto, CriarProjetoDto } from '../alunos/alunos.dto';
import { AcompanhamentoEstagioDto, AtualizarMinhaFichaDto, CriarVagaEmpresaDto, PedidoIndicacaoDto, RespostaIndicacaoDto } from './portal.dto';
import { PortalService } from './portal.service';

@Controller('portal')
export class PortalController {
  constructor(private readonly portal: PortalService) {}

  @Get('aluno/:token')
  minhaFicha(@Param('token', ParseUUIDPipe) token: string) {
    return this.portal.minhaFicha(token);
  }

  @Patch('aluno/:token')
  atualizarMinhaFicha(@Param('token', ParseUUIDPipe) token: string, @Body() dto: AtualizarMinhaFichaDto) {
    return this.portal.atualizarMinhaFicha(token, dto);
  }

  @Post('aluno/:token/certificacoes')
  adicionarCertificacao(@Param('token', ParseUUIDPipe) token: string, @Body() dto: CriarCertificacaoDto) {
    return this.portal.adicionarCertificacao(token, dto);
  }

  @Delete('aluno/:token/certificacoes/:id')
  @HttpCode(204)
  removerCertificacao(@Param('token', ParseUUIDPipe) token: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.portal.removerCertificacao(token, id);
  }

  @Post('aluno/:token/projetos')
  adicionarProjeto(@Param('token', ParseUUIDPipe) token: string, @Body() dto: CriarProjetoDto) {
    return this.portal.adicionarProjeto(token, dto);
  }

  @Delete('aluno/:token/projetos/:id')
  @HttpCode(204)
  removerProjeto(@Param('token', ParseUUIDPipe) token: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.portal.removerProjeto(token, id);
  }

  @Get('aluno/:token/empresas')
  empresasDaArea(@Param('token', ParseUUIDPipe) token: string) {
    return this.portal.empresasDaArea(token);
  }

  @Put('aluno/:token/interesses/:empresaId')
  @HttpCode(204)
  marcarInteresse(@Param('token', ParseUUIDPipe) token: string, @Param('empresaId', ParseUUIDPipe) empresaId: string) {
    return this.portal.marcarInteresse(token, empresaId);
  }

  @Delete('aluno/:token/interesses/:empresaId')
  @HttpCode(204)
  removerInteresse(@Param('token', ParseUUIDPipe) token: string, @Param('empresaId', ParseUUIDPipe) empresaId: string) {
    return this.portal.removerInteresse(token, empresaId);
  }

  @Get('aluno/:token/carreiras')
  carreiras(@Param('token', ParseUUIDPipe) token: string) {
    return this.portal.carreiras(token);
  }

  @Get('empresa/:token')
  painelEmpresa(@Param('token', ParseUUIDPipe) token: string) {
    return this.portal.painelEmpresa(token);
  }

  @Get('empresa/:token/talentos')
  talentos(@Param('token', ParseUUIDPipe) token: string) {
    return this.portal.talentos(token);
  }

  @Post('empresa/:token/vagas/:vagaId/pedidos')
  @HttpCode(204)
  pedirIndicacao(@Param('token', ParseUUIDPipe) token: string, @Param('vagaId', ParseUUIDPipe) vagaId: string, @Body() dto: PedidoIndicacaoDto) {
    return this.portal.pedirIndicacao(token, vagaId, dto.alunoId);
  }

  @Post('empresa/:token/vagas')
  criarVaga(@Param('token', ParseUUIDPipe) token: string, @Body() dto: CriarVagaEmpresaDto) {
    return this.portal.criarVaga(token, dto);
  }

  @Patch('empresa/:token/indicacoes/:id')
  responderIndicacao(@Param('token', ParseUUIDPipe) token: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: RespostaIndicacaoDto) {
    return this.portal.responderIndicacao(token, id, dto);
  }

  @Patch('empresa/:token/estagios/:id')
  acompanharEstagio(@Param('token', ParseUUIDPipe) token: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: AcompanhamentoEstagioDto) {
    return this.portal.acompanharEstagio(token, id, dto);
  }
}
