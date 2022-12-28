import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Crud, CrudController, Override} from "@nestjsx/crud";
import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {NotificationService} from "./notification.service";
import {Notification} from "./notification.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Notification')
@Crud({
  model: {
    type: Notification
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


  //@Get()
  @Override('getManyBase')
  @ApiOperation({summary: "Retrieve all Notifications"})
  async getAllNotifications(){

    return this.service.getAllNotifications()
  }

  @Override('getOneBase')
  @ApiOperation({summary: "Retrieve one Notification by ID"})
  async getOneNotification(@Param('id') id:string){
    return this.service.getNotification(id);
  }

  @Get('user/:user_id')
  @ApiOperation({summary: "Retrieve one Notification by user ID"})
  async getNotificationByUserId(@Param('user_id') UserId: string){
    return this.service.getNotificationByUserId(UserId);
  }
}
