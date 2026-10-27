import { Module } from '@nestjs/common';
import { EstagiosController } from './estagios.controller';
import { EstagiosService } from './estagios.service';

@Module({
  controllers: [EstagiosController],
  providers: [EstagiosService],
  exports: [EstagiosService],
})
export class EstagiosModule {}
