import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupportAttachment } from './system-support-attachment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class SystemSupportAttachmentService extends TypeOrmCrudService<SystemSupportAttachment> {
  constructor(
    @InjectRepository(SystemSupportAttachment)
    private destinationsRepository: Repository<SystemSupportAttachment>,
  ) {
    super(destinationsRepository);
  }

}
