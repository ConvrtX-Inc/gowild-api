import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupport } from './system-support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {TicketMessagesService} from "../ticket-messages/ticket-messages.service";
import {FindOptions} from "../common/types/find-options.type";
import {Route} from "../route/entities/route.entity";

@Injectable()
export class SystemSupportService extends TypeOrmCrudService<SystemSupport> {
  constructor(
    @InjectRepository(SystemSupport)
    private systemSupportRepository: Repository<SystemSupport>,
    private ticketMessage: TicketMessagesService
  ) {
    super(systemSupportRepository);
  }

  async addMessage(payload: any) {
    return this.ticketMessage.saveOne(payload);
  }
}
