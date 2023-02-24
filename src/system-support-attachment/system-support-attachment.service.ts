import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupportAttachment } from './system-support-attachment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FindOptions } from '../common/types/find-options.type';

@Injectable()
export class SystemSupportAttachmentService extends TypeOrmCrudService<SystemSupportAttachment> {
  constructor(
    @InjectRepository(SystemSupportAttachment)
    private destinationsRepository: Repository<SystemSupportAttachment>,
  ) {
    super(destinationsRepository);
  }
  async createSupportAttachment(
    picture: string,
    ticket_id: string,
    message_id: string,
  ) {
    const newAttachment = {
      ticket_id: ticket_id,
      attachment: picture,
      message_id: message_id,
    };
    const data = await this.saveOne(newAttachment);

    return data;
  }

  async findManyEntities(options: FindOptions<SystemSupportAttachment>) {
    return this.destinationsRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.destinationsRepository.save(
      this.destinationsRepository.create(data),
    );
  }
}
