import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';
import {DeepPartial} from "../common/types/deep-partial.type";

@Injectable()
export class TicketMessagesService extends TypeOrmCrudService<TicketMessage> {
  constructor(
    @InjectRepository(TicketMessage)
    private ticketMessageRepository: Repository<TicketMessage>,
  ) {
    super(ticketMessageRepository);
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<TicketMessage>[]) {
    return this.ticketMessageRepository.save(this.ticketMessageRepository.create(data));
  }
}
