import { Module } from '@nestjs/common';
import { MentoresController } from './mentores.controller';
import { MentoresService } from './mentores.service';

@Module({
  controllers: [MentoresController],
  providers: [MentoresService],
})
export class MentoresModule {}
