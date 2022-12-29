import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageService } from './message.service';
import { Message } from './message.entity';
import { ParticipantModule } from '../participant/participant.module';
import {MessageController} from "./message.controller";

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [ParticipantModule, TypeOrmModule.forFeature([Message])],
  exports: [MessageService],
})
export class MessageModule {}
