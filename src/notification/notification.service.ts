import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../common/types/deep-partial.type';
import { RoleEnum } from '../roles/roles.enum';

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
    return {
      data: addNotification,
    };
  }

  // create notification for admin
  public async createNotificationAdmin(message: string, type) {
    let addAdminNotification = new Notification();
    addAdminNotification.notification_msg = message;
    addAdminNotification.type = type;
    addAdminNotification.role = RoleEnum.ADMIN;
    addAdminNotification = await this.saveEntity(addAdminNotification);
    return {
      data: addAdminNotification,
    };
  }
  // get notification by user id
  public async getNotificationByUserId(id: string) {
    const getNotifications = await this.destinationsRepository.find({
      where: { user_id: id },
    });

    if (!getNotifications) {
      throw new NotFoundException({
        errors: [
          {
            user: 'User does not exist',
          },
        ],
      });
    }
    await this.destinationsRepository.update(
      { user_id: id },
      { is_seen: true },
    );

    return {
      data: getNotifications,
    };
  }
  // get notifications by id
  public async getNotification(id: string) {
    const notification = await this.destinationsRepository.findOne({
      where: { id: id },
    });

    return {
      data: notification,
    };
  }
  // get Role.Admin notification
  public async getAdminNotification(role) {
    const findNotifications = await this.destinationsRepository.find({
      where: {
        role: role,
      },
    });
    if (!findNotifications) {
      throw new NotFoundException({
        error: [{ message: 'Admin Notification Not Found!' }],
      });
    }
    return findNotifications;
  }

  // get all notification
  public async getAllNotifications() {
    const allNotifications = await this.destinationsRepository.find({});
    return {
      data: allNotifications,
    };
  }

  async saveEntity(data: DeepPartial<Notification>) {
    return this.destinationsRepository.save(
      this.destinationsRepository.create(data),
    );
  }
}
