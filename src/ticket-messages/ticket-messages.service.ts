import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';
import {DeepPartial} from "../common/types/deep-partial.type";
import {paginateResponse} from "../common/paginate.response";
import {Ticket} from "../ticket/entities/ticket.entity";
import {UserEntity} from "../users/user.entity";
import {CreateTicketMessageDto} from "./dto/create-ticket-message.dto";
import {SystemSupportAttachment} from "../system-support-attachment/system-support-attachment.entity";

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

  async createTicketMessage(ticketId: string, message:string , userId: string){

    const user = await UserEntity.findOne({
      where:{
        id: userId
      }
    })
    const userRole = user.role.name
    console.log(userRole);
    const newMessage = {
      user_id: userId,
      ticket_id: ticketId,
      message: message,
      role: userRole
    }
  const messages = await this.saveOne(newMessage);

    return messages

  }
  async getTicketMessages(ticketId: string, pageNo: number) {

    const take = 20
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.ticketMessageRepository.createQueryBuilder('ticketMessage')
        .where('ticketMessage.ticket_id = :ticketId', {ticketId})
        .leftJoinAndMapMany('ticketMessage.attachment', SystemSupportAttachment, 'attachment', 'ticketMessage.ticket_id = attachment.ticket_id')
        .skip(skip).take(take)
        .getManyAndCount();

    return paginateResponse(data, page, take)
  }

}
