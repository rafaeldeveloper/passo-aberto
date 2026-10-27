import { Controller, Get } from '@nestjs/common';
import { PainelService } from './painel.service';

@Controller('painel')
export class PainelController {
  constructor(private readonly painel: PainelService) {}

  @Get()
  resumo() {
    return this.painel.resumo();
  }
}
