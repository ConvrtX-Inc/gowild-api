import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Share } from './entities/share.entity';

@Injectable()
export class ShareService extends TypeOrmCrudService<Share> {
  constructor(
    @InjectRepository(Share)
    private shareRepository: Repository<Share>,
  ) {
    super(shareRepository);
  }
}
