import { Body, Controller, Request, UseGuards } from '@nestjs/common';
import { SystemSupportService } from './system-support.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SystemSupport } from './system-support.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post } from '@nestjs/common/decorators';
import { CreateRoomDto } from '../messenger/message/dto/create-room.dto';
import { CreateSupportMessageDto } from './dto/create-supportmessage.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('System Support')
@Crud({
  model: {
    type: SystemSupport,
  },
  routes: {
    exclude: [
      'replaceOneBase',
      'createManyBase',
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
    ],
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
  path: 'system-supports',
  version: '1',
})
export class SystemSupportController implements CrudController<SystemSupport> {
  constructor(public service: SystemSupportService) {}

  get base(): CrudController<SystemSupport> {
    return this;
  }

  @ApiOperation({ summary: 'Create System Support Message' })
  @Post('message')
  public async addOneMessage(@Request() request: Express.Request, @Body() payload: CreateSupportMessageDto) {
    return await this.service.addMessage(request.user.sub, payload);
  }
}
