import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';
import { DeepPartial } from '../common/types/deep-partial.type';
import { paginateResponse } from '../common/paginate.response';
import { UserEntity } from '../users/user.entity';
import { SystemSupportAttachment } from '../system-support-attachment/system-support-attachment.entity';
import { FindOptions } from '../common/types/find-options.type';

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
    return this.ticketMessageRepository.save(
      this.ticketMessageRepository.create(data),
    );
  }

  async createTicketMessage(ticketId: string, message: string, userId: string) {
    const user = await UserEntity.findOne({
      where: {
        id: userId,
      },
    });
    const userRole = user.role.name;
    console.log(userRole);
    const newMessage = {
      user_id: userId,
      ticket_id: ticketId,
      message: message,
      role: userRole,
    };
    const messages = await this.saveOne(newMessage);

    return { message: 'Message Created', data: messages };
  }
  async getTicketMessages(ticketId: string, pageNo: number) {
    const take = 50;
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.ticketMessageRepository
      .createQueryBuilder('ticketMessage')
      .where('ticketMessage.ticket_id = :ticketId', { ticketId })
      .leftJoinAndMapMany(
        'ticketMessage.attachment',
        SystemSupportAttachment,
        'attachment',
        'ticketMessage.id = attachment.message_id',
      )
      .skip(skip)
      .take(take)
      .orderBy('ticketMessage.createdDate', 'ASC')
      .getManyAndCount();

    return paginateResponse(data, page, take);
  }
  async findOneEntity(options: FindOptions<TicketMessage>) {
    return this.ticketMessageRepository.findOne({
      where: options.where,
    });
  }
}
