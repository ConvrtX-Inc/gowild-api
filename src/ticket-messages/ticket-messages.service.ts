import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';

@Injectable()
export class TicketMessagesService extends TypeOrmCrudService<TicketMessage> {
  constructor(@InjectRepository(TicketMessage)
              private ticketMessageRepository: Repository<TicketMessage>,
  ) {
    super(ticketMessageRepository);
  }
}
