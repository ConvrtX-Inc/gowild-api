import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './entities/ticket-message.entity';
import { DeepPartial } from '../common/types/deep-partial.type';
import { UserEntity } from '../users/user.entity';
import { SystemSupportAttachment } from '../system-support-attachment/system-support-attachment.entity';
import { FindOptions } from '../common/types/find-options.type';
import {RoleEnum} from "../roles/roles.enum";

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

  async saveOneEntity(data: DeepPartial<TicketMessage>) {
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
    const newMessage = {
      user_id: userId,
      ticket_id: ticketId,
      message: message,
      role: userRole,
    };
    const messages = await this.saveOne(newMessage);

    return { message: 'Message Created', data: messages };
  }
  async getTicketMessages(userId: string, ticketId: string, pageNo: number, limitNo: number) {
    const limit = limitNo || 100;
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
        .orderBy('ticketMessage.createdDate', 'ASC')
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
    const user = await UserEntity.findOne({
      where:{
        id: userId,
      }
    })
    if(user.role.name === (RoleEnum.SUPER_ADMIN || RoleEnum.ADMIN) ){
      await this.ticketMessageRepository.update(
          {ticket_id: ticketId },
          { adminSeen: true }
      );
    }

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

  // attachment
  async updateFile(ticketId: string, userId: string, attachment: string){
    const user = await UserEntity.findOne(userId);
    let ticketMessage = new TicketMessage();
    ticketMessage.user_id = userId;
    ticketMessage.ticket_id = ticketId;
    ticketMessage.message = '';
    ticketMessage.role = user.role.name;

    const message = await this.saveOneEntity(ticketMessage);
    const data = {
      ticket_id: ticketId,
      message_id: message.id,
      user_id: userId,
      attachment: attachment
    }
    const systemSupportAttachment = await SystemSupportAttachment.save(SystemSupportAttachment.create(data))
    const response = await this.findOneEntity({
      where: {
        id: message.id
      }
    })
    response['user'] = user
    response['attachment'] = [systemSupportAttachment.attachment]
    return {data: response }
  }

}
