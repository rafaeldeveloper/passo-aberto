import { Global, Module } from '@nestjs/common';
import { EscolaController } from './escola.controller';
import { EscolaService } from './escola.service';

@Global()
@Module({
  controllers: [EscolaController],
  providers: [EscolaService],
  exports: [EscolaService],
})
export class EscolaModule {}
