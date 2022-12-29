import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { ParticipantModule } from '../participant/participant.module';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [],
  providers: [RoomService],
  imports: [ParticipantModule, MessageModule, TypeOrmModule.forFeature([Room])],
  exports: [RoomService],
})
export class RoomModule {}
