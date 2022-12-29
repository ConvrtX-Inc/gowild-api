import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { Participant } from './participant.entity';

@Module({
  controllers: [],
  providers: [ParticipantService],
  imports: [TypeOrmModule.forFeature([Participant])],
  exports: [ParticipantService],
})
export class ParticipantModule {}
