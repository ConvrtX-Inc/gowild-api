import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { pushNotificationDto } from './dtos/push-notification.dto';
import {NotificationTypeEnum} from "./notification-type.enum";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Notification')
@Crud({
  model: {
    type: Notification,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationController implements CrudController<Notification> {
  constructor(public service: NotificationService) {}

  get base(): CrudController<Notification> {
    return this;
  }

  @Override('createOneBase')
  public async createNotification(@Request() request) {
    return this.service.createNotification(request.user?.sub, 'user created!', NotificationTypeEnum.GO_WILD, '');
  }

  //@Get()
  @Override('getManyBase')
  @ApiOperation({ summary: 'Retrieve all Notifications' })
  async getAllNotifications() {
    return this.service.getAllNotifications();
  }

  @Override('getOneBase')
  @ApiOperation({ summary: 'Retrieve one Notification by ID' })
  async getOneNotification(@Param('id') id: string) {
    return this.service.getNotification(id);
  }

  @Post('push')
  async pushNotification(@Body() dto: pushNotificationDto, @Request() req) {
    return await this.service.customPush('dtkSj2BvuUKIoqA-NZXG_8:APA91bFPdWPhIfWCshKy-Nu3OkGgiVzPYJH_jD10LVuzbyGwsXitoZ4nldV9bdR-FcZ4fNtXuanwdJ_iyVvc1fimXsMB8dj0S1QZdX5qHDezKb2X7poUk5LF1PxWyuwl9k_YLeMm9SbB'
        , dto.title, dto.message, 'test', 'android');
  }

  @Get('role/:role')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Retrieve all Notification for Admin (admin)' })
  async getAdminNotifications(@Param('role') role: RoleEnum.ADMIN) {
    return await this.service.getAdminNotification(role);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Retrieve one user Notifications by user ID' })
  async getNotificationByUserId(@Param('user_id') UserId: string) {
    return await this.service.getNotificationByUserId(UserId);
  }
}
