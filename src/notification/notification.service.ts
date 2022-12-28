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
    return{
      data: addNotification
    }
  }
  // get notification by user id
  public async getNotificationByUserId(id: string) {

    const getNotifications = await this.destinationsRepository.find({ where:{ user_id: id } })

    return{
      data: getNotifications
    }
  }
  // get notifications by id
  public async getNotification(id: string){
    const notification = await this.destinationsRepository.findOne({ where:{ id: id } })

    return{
      data: notification
    }

  }
  // get all notification
  public async getAllNotifications(){

    const allNotifications = await this.destinationsRepository.find({})
    return{
      data: allNotifications
    }
  }

  async saveEntity(data: DeepPartial<Notification>) {
    return this.destinationsRepository.save(this.destinationsRepository.create(data));
  }
}
