import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  HttpCode,
  Request,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Friends } from './entities/friend.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendFriendRequestDto } from './dto/create-friend.dto';
import { ConfirmDto } from './dto/confirm-request.dto';
import { UserEntity } from 'src/users/user.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Friends')
@Crud({
  model: {
    type: Friends,
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
  path: 'friends',
  version: '1',
})
export class FriendsController implements CrudController<Friends> {
  constructor(readonly service: FriendsService) {}

  get base(): CrudController<Friends> {
    return this;
  }

  @ApiOperation({ summary: 'Get suggested friends list' })
  @Get('suggested-friends')
  public async getSuggestedFriends(@Request() req) {
    return this.service.suggestedFriends(req.user);
  }

  @Post('send-friend-request')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequestByEmail(
    @Request() request,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    return this.service.sendFriendRequestByEmail(
      request.user,
      sendFriendRequestDto,
    );
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Request() request, @Body() confirmDto: ConfirmDto) {
    return this.service.confirm(request.user, confirmDto);
  }

  // To get All Friends of logged in User
  @ApiOperation({ summary: 'Get All Of My Friends' })
  @Get('my')
  async getFriends(@Param('id') id: string, @Request() request) {
    const returnResponse = [];
    const users = await this.service.getFriends(request.user);
    const tempToUser = [];
    const tempFromUser = [];
    let to_user = {};
    let from_user = {};
    if (users instanceof Array) {
      for (const i in users) {
        const data = users[i];

        if (!tempToUser.includes(users[i].to_user_id)) {
          tempToUser.push(users[i].to_user_id);
          to_user = await UserEntity.findOne({
            id: users[i].to_user_id,
          });
        }
        if (!tempFromUser.includes(users[i].from_user_id)) {
          tempFromUser.push(users[i].from_user_id);
          from_user = await UserEntity.findOne({
            id: users[i].from_user_id,
          });
        }
        data['to_user'] = to_user;
        data['from_user'] = from_user;
        returnResponse.push(data);
      }
      return {
        data: returnResponse,
      };
    }
  }

  @Get('/received')
  async getReceivedRequest(@Request() request) {
    return this.service.getReceivedRequests(request.user);
  }

  @Override('deleteOneBase')
  async deleteOne(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get('suggested/remove/:id')
  @HttpCode(HttpStatus.OK)
  async removeSuggested(@Param('id') id: string, @Request() req) {
    return await this.service.removeSuggested(id, req.user);
  }
}
