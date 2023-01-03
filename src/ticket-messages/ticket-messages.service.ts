import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';
import {DeepPartial} from "../common/types/deep-partial.type";
import {paginateResponse} from "../common/paginate.response";

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

  async getTicketMessages(ticketId: string, pageNo: number) {

    const take = 20
    const page = pageNo || 1;
    const skip = (page - 1) * take;


    const data = await this.ticketMessageRepository.createQueryBuilder('ticketMessage')
        .where('ticketMessage.ticket_id = :ticketId', {ticketId})
        .skip(skip).take(take)
        .getManyAndCount();

    return paginateResponse(data, page, take)
  }
}
