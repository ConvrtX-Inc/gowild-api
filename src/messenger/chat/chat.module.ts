import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomModule } from '../room/room.module';  

@Module({
  providers: [ChatGateway],
  imports: [
    RoomModule,    
  ],
})
export class ChatModule {}
