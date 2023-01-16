import { Module } from '@nestjs/common';
import { TicketMessagesService } from './ticket-messages.service';
import { TicketMessagesController } from './ticket-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessage } from './entities/ticket-message.entity';

@Module({
  controllers: [TicketMessagesController],
  providers: [TicketMessagesService],
  exports: [TicketMessagesService],
  imports: [TypeOrmModule.forFeature([TicketMessage])],
})
export class TicketMessagesModule {}
