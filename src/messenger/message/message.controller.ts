import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { HttpStatus } from '@nestjs/common/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { FilesService } from 'src/files/files.service';

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
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  get base(): CrudController<Message> {
    return this;
  }

    // Image Update
    @ApiResponse({ type: Message })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @Post(':friendId/update-image')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    public async updateImage(
      @Request() request: Express.Request,
      @Param('friendId') friendId: string,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const driver = this.configService.get('file.driver');
      const picture = {
        local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
        s3: file.location,
        firebase: file.publicUrl,
      };
      return this.service.updateImage(request.user.sub,friendId, picture[driver]);
    }

  @ApiOperation({ summary: 'Get Inbox' })
  @Get('/inbox')
  public async inbox(@Request() request: Express.Request) {
    return await this.service.inbox(request.user.sub);

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

  // @ApiResponse({ type: Message })
  // @ApiOperation({ summary: 'Get User Messages' })
  // @Get('/:roomId')
  // async getUserMessages(
  //   @Request() req,
  //   @Param('roomId') roomId,
  //   @Query() query,
  // ) {
  //   return await this.service.userMessages(req.user.sub, roomId, query.page);
  // }

  @ApiResponse({ type: Message })
  @ApiOperation({ summary: 'Get User Messages' })
  @Get('/:friendId')
  async getFriendMessages(
    @Request() req,
    @Param('friendId') friendId,
    @Query() query,
  ) {
    return await this.service.FriendsMessages(req.user.sub, friendId, query.page);
  }

  @ApiOperation({ summary: 'Clean Conversation' })
  @Post('/:friendId')
  public async cleanConversation(
    @Request() request: Express.Request,
    @Param('friendId') friendId,
  ) {
    return await this.participantService.cleanConversation(
      request.user.sub,
      friendId,
    );
  }

  @ApiOperation({ summary: 'Delete single message' })
  @Post('/:friendId/:messageId')
  public async deleteMessage(
    @Request() request: Express.Request,
    @Param('friendId') friendId,
    @Param('messageId') messageId,
  ) {
    return await this.deleteMessageService.deleteMessage(
      request.user.sub,
      friendId,
      messageId,
    );
  }


}
