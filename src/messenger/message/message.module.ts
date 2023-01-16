import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { ParticipantModule } from '../participant/participant.module';
import { MessageController } from './message.controller';
import { DeletedMessage } from './delete.message.entity';
import { DeleteMessageService } from './delete-message.service';
import { RoomService } from '../room/room.service';
import { Room } from '../room/room.entity';

@Module({
  controllers: [MessageController],
  providers: [MessageService, DeleteMessageService, RoomService],
  imports: [
    ParticipantModule,
    TypeOrmModule.forFeature([Message, DeletedMessage, Room]),
  ],
  exports: [MessageService],
})
export class MessageModule {}
