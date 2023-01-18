import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupport } from './system-support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TicketMessagesService } from '../ticket-messages/ticket-messages.service';
import { FindOptions } from '../common/types/find-options.type';
import { Route } from '../route/entities/route.entity';
import { convertToImage } from '../common/constants/base64.image';

@Injectable()
export class SystemSupportService extends TypeOrmCrudService<SystemSupport> {
  constructor(
    @InjectRepository(SystemSupport)
    private systemSupportRepository: Repository<SystemSupport>,
    private ticketMessage: TicketMessagesService,
  ) {
    super(systemSupportRepository);
  }

  async addMessage(userId: string, payload: any) {
    const attachment = null;
    payload.user_id = userId;
    if (payload.attachment) {
      payload.attachment = convertToImage(
        payload.attachment.base64,
        payload.attachment.extension,
      );
    }
    return this.ticketMessage.saveOne(payload);
  }
}
