import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Post, Query } from '@nestjs/common/decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ParticipantService } from '../participant/participant.service';
import { DeleteMessageService } from './delete-message.service';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from '../room/room.service';
import {CreateMessageDto} from "./dto/create-message.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Messages')
@Crud({
  model: {
    type: Message,
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
  path: 'messages',
  version: '1',
})
export class MessageController implements CrudController<Message> {
  constructor(
    public service: MessageService,
    public participantService: ParticipantService,
    public roomService: RoomService,
    public deleteMessageService: DeleteMessageService,
  ) {}

  get base(): CrudController<Message> {
    return this;
  }

  @ApiOperation({ summary: 'Get Inbox' })
  @Get('/inbox')
  public async inbox(@Request() request: Express.Request) {
    return{
      message: "User Inbox Fetched Successfully!",
      data: await this.service.inbox(request.user.sub)
    }
  }
  @ApiOperation({ summary: 'Create Room Sender & Receiver' })
  @Post('create-room')
  public async createRoom(@Request() request: Express.Request, @Body() dto: CreateRoomDto) {
    return {
      message: 'Room Created Successfully!',
      data: await this.roomService.ConnectConversation(
        request.user.sub,
        dto.recipient_id,
      ),
    };
  }

  @ApiOperation({ summary: 'Create Message' })
  @Post('/create')
  public async addMessage(@Request() request: Express.Request,
    @Body() dto: CreateMessageDto,
  ) {
    const payload = {
      message: dto.message,
      attachment: dto.attachment,
      user_id: request.user.sub,
      room_id: dto.room_id,
    }
    return {
      message: 'Message Created Successfully!',
      data: await this.roomService.saveMessagesofRoom(dto.room_id, payload),
    };
  }

  @ApiResponse({ type: Message })
  @ApiOperation({ summary: 'Get User Messages' })
  @Get('/:roomId')
  async getUserMessages(
    @Request() req,
    @Param('roomId') roomId,
    @Query() query,
  ) {
    return await this.service.userMessages(req.user.sub, roomId, query.page);
  }

  @ApiOperation({ summary: 'Clean Conversation' })
  @Post('/:roomId')
  public async cleanConversation(
    @Request() request: Express.Request,
    @Param('roomId') roomId,
  ) {
    return await this.participantService.cleanConversation(
      request.user.sub,
      roomId,
    );
  }

  @ApiOperation({ summary: 'Delete single message' })
  @Post('/:roomId/:messageId')
  public async deleteMessage(
    @Request() request: Express.Request,
    @Param('roomId') roomId,
    @Param('messageId') messageId,
  ) {
    return await this.deleteMessageService.deleteMessage(
      request.user.sub,
      roomId,
      messageId,
    );
  }
}
