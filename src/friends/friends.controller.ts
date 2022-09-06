import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Friends } from './entities/friend.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  constructor(readonly service: FriendsService) {
  }

  get base(): CrudController<Friends> {
    return this;
  }

  @ApiOperation({ summary: 'Get suggested friends list' })
  @Get('suggested-friends/:user_id')
  public async getSuggestedFriends(@Param('user_id') user_id: string) {
    return this.service.suggestedFriends(user_id);
  }

}
