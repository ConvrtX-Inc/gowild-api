import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MessageService } from '../message/message.service';
import { ParticipantService } from '../participant/participant.service';
import { Room } from './room.entity';
import { ParticipantModule } from '../participant/participant.module';  
import { MessageModule } from '../message/message.module';  

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [ParticipantModule, MessageModule, TypeOrmModule.forFeature([Room])],
  exports: [RoomService],
})
export class RoomModule {}
