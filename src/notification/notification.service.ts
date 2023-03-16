import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../common/types/deep-partial.type';
import { RoleEnum } from '../roles/roles.enum';
import * as admin from 'firebase-admin';
import { UserEntity } from 'src/users/user.entity';
import { pushNotificationDto } from './dtos/push-notification.dto';
import { BadGatewayException } from '@nestjs/common/exceptions';
import {NotificationTypeEnum} from "./notification-type.enum";
import {UsersService} from "../users/users.service";

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private destinationsRepository: Repository<Notification>,
    private usersService: UsersService
  ) {
    super(destinationsRepository);
  }
  public async createNotification(UserId: string, message: string, type: string, title: string) {
    let addNotification = new Notification();
    addNotification.user_id = UserId;
    addNotification.notification_msg = message;
    addNotification.type = type;
    addNotification.title = title;
    addNotification.role = RoleEnum.USER;
    addNotification = await this.saveEntity(addNotification);
    const user = await this.usersService.findOneEntity({
      where: {
        id: UserId,
      },
    });
    console.log('user',user)
    if (user) {
      console.log('In Notification')
      console.log('FCM Token', user.fcm_token)
      await this.customPush(user.fcm_token, title, message, type)
    }

    return {
      data: addNotification,
    };
  }

  // create notification for admin
  public async createNotificationAdmin(message: string, type: string, title: string) {
    let addAdminNotification = new Notification();
    addAdminNotification.notification_msg = message;
    addAdminNotification.type = type;
    addAdminNotification.title = title;
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
    const allNotifications = await this.destinationsRepository.find({
      take: 100,
      order: {createdDate: 'DESC'}
    });
    return {
      data: allNotifications,
    };
  }

  async saveEntity(data: DeepPartial<Notification>) {
    return this.destinationsRepository.save(
      this.destinationsRepository.create(data),
    );
  }

  // async pushNotification(id: string, dto: pushNotificationDto) {
  //   const user = await UserEntity.findOne({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  //   if (user.fcm_token) {
  //     var message = {
  //       notification: {
  //         title: dto.title,
  //         body: dto.message,
  //       },
  //       token: user.fcm_token,
  //     };
  //     const sent = await admin.messaging().send(message);
  //     if (sent) {
  //       let addAdminNotification = new Notification();
  //       addAdminNotification.title = dto.title;
  //       addAdminNotification.notification_msg = dto.message;
  //       addAdminNotification.msg_code = sent;
  //       addAdminNotification.user_id = user.id;
  //       addAdminNotification.type = NotificationTypeEnum.PUSH;
  //       addAdminNotification.role = RoleEnum.ADMIN;
  //       await this.saveEntity(addAdminNotification);
  //       return {
  //         message: 'Notification Pushed Successfully',
  //         message_code: sent,
  //       };
  //     } else {
  //       new BadGatewayException({
  //         message: 'Something Went Wrong',
  //       });
  //     }
  //   }
  //   return { message: 'Token Not Found' };
  // }

  public async customPush(token: string, title: string, body: string, type: string) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: type
      },
      token: token,
      apns: {
        payload: {
          aps: {
            badge: 1,
            type: type,
            sound: 'default'
          }
        }
      }
    };
    const sent = await admin.messaging().send(message);
    if (sent) {
      console.log('Push Sent Successfully')
    }
  }
}
