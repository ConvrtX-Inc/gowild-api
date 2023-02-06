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
    private SystemSupportAttachmentService: SystemSupportAttachmentService,
  ) {
    super(systemSupportRepository);
  }

  async addMessage(userId: string, payload: any) {
    
    payload.user_id = userId;
  
    const newMessage = await this.ticketMessage.saveOne(payload);
    newMessage['attachment']  = "";
    return {data : newMessage};
  }
async updateFile(ticket_id: string, message_id: string, attachment: string){
  const data = {
    ticket_id: ticket_id,
    message_id: message_id,
    attachment: attachment
  }
  const newAttachment = await this.SystemSupportAttachmentService.saveOne(data);
return {data: newAttachment }

}

}
