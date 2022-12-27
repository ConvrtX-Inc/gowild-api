import {Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Crud, CrudController} from '@nestjsx/crud';
import { Notification } from './notification.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
}
