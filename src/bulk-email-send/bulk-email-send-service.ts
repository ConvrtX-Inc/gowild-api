import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from '../common/types/deep-partial.type';
import { bulkEmailSend } from './entities/bulk-email-send-entity';

@Injectable()
export class bulkEmailSendService extends TypeOrmCrudService<bulkEmailSend> {
  constructor(
    @InjectRepository(bulkEmailSend)
    private bulkEmailSendRepository: Repository<bulkEmailSend>,
  ) {
    super(bulkEmailSendRepository);
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<bulkEmailSend>[]) {
    return this.bulkEmailSendRepository.save(
      this.bulkEmailSendRepository.create(data),
    );
  }
}
