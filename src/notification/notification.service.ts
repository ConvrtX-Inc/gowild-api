import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {DeepPartial} from "../common/types/deep-partial.type";

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private destinationsRepository: Repository<Notification>,
  ) {
    super(destinationsRepository);
  }
  public async createNotification(UserId: string, message: string) {
    let addNotification = new Notification();
    addNotification.user_id = UserId;
    addNotification.notification_msg = message;
    addNotification = await this.saveEntity(addNotification);

    console.log(addNotification)
    return{
      data: addNotification
    }
  }

  async saveEntity(data: DeepPartial<Notification>) {
    return this.destinationsRepository.save(this.destinationsRepository.create(data));
  }
}
