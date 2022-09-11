import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SystemSupport } from './system-support.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class SystemSupportService extends TypeOrmCrudService<SystemSupport> {
  constructor(
    @InjectRepository(SystemSupport)
    private systemSupportRepository: Repository<SystemSupport>,
  ) {
    super(systemSupportRepository);
  }
}
