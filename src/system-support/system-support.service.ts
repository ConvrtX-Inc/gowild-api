import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupport } from './system-support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TicketMessagesService } from '../ticket-messages/ticket-messages.service';
import { convertToImage } from '../common/constants/base64.image';
import { SystemSupportAttachmentService } from 'src/system-support-attachment/system-support-attachment.service';


@Injectable()
export class SystemSupportService extends TypeOrmCrudService<SystemSupport> {
  constructor(
    @InjectRepository(SystemSupport)
    private systemSupportRepository: Repository<SystemSupport>,
    private ticketMessage: TicketMessagesService,
    private SystemSupportAttachmentService : SystemSupportAttachmentService,
  ) {
    super(systemSupportRepository);
  }

  async addMessage(userId: string, payload: any) {
    const attachment = null;
    payload.user_id = userId;
    if (payload.attachment) {
      payload.attachment = await convertToImage(
        payload.attachment.base64,
        payload.attachment.extension,
      );
    }
    const newMessage = await this.ticketMessage.saveOne(payload); 
    const data = {
      ticket_id : payload.ticket_id, 
      message_id : newMessage['id'],
      attachment : payload.attachment         
    } 
    await this.SystemSupportAttachmentService.saveOne(data);  
    return newMessage
  }
}
