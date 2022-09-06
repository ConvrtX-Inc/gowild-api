import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private destinationsRepository: Repository<Notification>,
  ) {
    super(destinationsRepository);
  }

}
