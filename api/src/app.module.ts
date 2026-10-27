import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlunosModule } from './alunos/alunos.module';
import { CarreirasModule } from './carreiras/carreiras.module';
import { EmpresasModule } from './empresas/empresas.module';
import { EscolaModule } from './escola/escola.module';
import { EstagiosModule } from './estagios/estagios.module';
import { EventosModule } from './eventos/eventos.module';
import { MentoresModule } from './mentores/mentores.module';
import { PainelModule } from './painel/painel.module';
import { PortalModule } from './portal/portal.module';
import { PrismaModule } from './prisma/prisma.module';
import { VagasModule } from './vagas/vagas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EscolaModule,
    AlunosModule,
    CarreirasModule,
    EmpresasModule,
    EstagiosModule,
    MentoresModule,
    EventosModule,
    VagasModule,
    PainelModule,
    PortalModule,
  ],
})
export class AppModule {}
