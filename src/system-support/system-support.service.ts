import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupport } from './system-support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TicketMessagesService } from '../ticket-messages/ticket-messages.service';
import { convertToImage } from '../common/constants/base64.image';
import { SystemSupportAttachmentService } from 'src/system-support-attachment/system-support-attachment.service';
import { UserEntity } from 'src/users/user.entity';


@Injectable()
export class SystemSupportService extends TypeOrmCrudService<SystemSupport> {
  constructor(
    @InjectRepository(SystemSupport)
    private systemSupportRepository: Repository<SystemSupport>,
    private ticketMessage: TicketMessagesService,
    private SystemSupportAttachmentService: SystemSupportAttachmentService,
  ) {
    super(systemSupportRepository);
  }

  async addMessage(userId: string, payload: any) {

    payload.user_id = userId;
    const user = await UserEntity.findOne(userId);

    const newMessage = await this.ticketMessage.saveOne(payload);
    newMessage['attachment']  = [];
    newMessage['user'] = user
    return {data : newMessage};
  }
async updateFile(ticket_id: string, message_id, user_id: string, attachment: string){
  const data = {
    ticket_id: ticket_id,
    message_id: message_id,
    user_id: user_id,
    attachment: attachment
  }
  const user = await UserEntity.findOne(user_id);
  const newAttachment = await this.SystemSupportAttachmentService.saveOne(data);
  newAttachment['user'] = user
return {data: newAttachment }

}

}
