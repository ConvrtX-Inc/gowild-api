import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';
import { DeepPartial } from '../common/types/deep-partial.type';
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
    const limit = 10;
    const page = pageNo || 1;
    const skip = (page - 1) * limit;

    const [data,total] = await this.ticketMessageRepository
      .createQueryBuilder('ticketMessage')
      .where('ticketMessage.ticket_id = :ticketId', { ticketId })
        .leftJoinAndMapOne('ticketMessage.user',
            UserEntity, 'user', 'ticketMessage.user_id = user.id')
        .leftJoinAndMapMany(
        'ticketMessage.attachment',
        SystemSupportAttachment,
        'attachment',
        'ticketMessage.id = attachment.message_id',
      )
        .select(['ticketMessage', 'attachment',
          'user.firstName','user.lastName', 'user.username', 'user.email', 'user.picture'])
      .skip(skip)
      .take(limit)
      .orderBy('ticketMessage.createdDate', 'DESC')
      .getManyAndCount();


    data.forEach((obj,index) =>{
       var customArr = []
      customArr = [...obj['attachment']]
      var attachmentString = []
      customArr.forEach(singleAttachment =>{
        attachmentString.push(singleAttachment.attachment);
      })
      delete obj['attachment'];
      obj['attachment'] =  attachmentString;
    })

    const totalPage = Math.ceil(total / limit);
    const currentPage = parseInt(String(page));
    const prevPage = page > 1 ? page - 1 : null;
    return {
      message: 'Ticket Messages successfully fetched!',
      data: data,
      count: total,
      currentPage,
      prevPage,
      totalPage,
    };
  }
  async findOneEntity(options: FindOptions<TicketMessage>) {
    return this.ticketMessageRepository.findOne({
      where: options.where,
    });
  }
}
