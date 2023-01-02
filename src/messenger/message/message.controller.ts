import {Controller, Get, Param, Request, UseGuards} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Crud, CrudController, Override} from '@nestjsx/crud';
import { query } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {Message} from "./message.entity";
import {MessageService} from "./message.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Messages')
@Crud({
  model: {
    type: Message,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase', 'getOneBase','getManyBase', 'createOneBase', 'updateOneBase'],
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
  path: 'messages',
  version: '1',
})
export class MessageController implements CrudController<Message> {
  constructor(public service: MessageService) {}

  get base(): CrudController<Message> {
    return this;
  }
  
  @ApiResponse({ type: Message })
  @ApiOperation({ summary: 'Get User Messages' })
  @Get('/:roomId')
  async getUserMessages(@Param('roomId') roomId, @Query() query){
    return await this.service.userMessages(roomId, query.page)
  }
  @ApiOperation({ summary: 'Get Inbox' })
  @Get('/inbox')
  public async inbox(@Request() request: Express.Request) {
    return await this.service.inbox(request.user.sub);
  }
 

}