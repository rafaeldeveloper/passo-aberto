import { Module } from '@nestjs/common';
import { AlunosModule } from '../alunos/alunos.module';
import { EstagiosModule } from '../estagios/estagios.module';
import { VagasModule } from '../vagas/vagas.module';
import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';

@Module({
  imports: [AlunosModule, EstagiosModule, VagasModule],
  controllers: [PortalController],
  providers: [PortalService],
})
export class PortalModule {}
