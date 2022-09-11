import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../common/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../common/types/deep-partial.type';
import { GuidelineLog } from './guideline-log.entity';

@Injectable()
export class GuidelineLogsService extends TypeOrmCrudService<GuidelineLog> {
  constructor(
    @InjectRepository(GuidelineLog)
    private GuidelineLogsRepository: Repository<GuidelineLog>,
  ) {
    super(GuidelineLogsRepository);
  }

  async findOneEntity(options: FindOptions<GuidelineLog>) {
    return this.GuidelineLogsRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<GuidelineLog>) {
    return this.GuidelineLogsRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<GuidelineLog>[]) {
    return this.GuidelineLogsRepository.save(
      this.GuidelineLogsRepository.create(data),
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.GuidelineLogsRepository.softDelete(id);
  }

  async hardDelete(id) {
    await this.GuidelineLogsRepository.delete(id);
  }
}
