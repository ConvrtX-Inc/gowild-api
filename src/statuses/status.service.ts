import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { StatusEnum } from '../auth/status.enum';

@Injectable()
export class StatusService extends TypeOrmCrudService<Status> {
  constructor(
    @InjectRepository(Status)
    private statusesRepository: Repository<Status>,
  ) {
    super(statusesRepository);
  }

  public async findByEnum(status: StatusEnum) {
    return this.statusesRepository.findOne({ where: { id: status } });
  }
}
