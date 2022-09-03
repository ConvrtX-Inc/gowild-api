import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { PostFeed } from './entities/post-feed.entity';
import { PostFeedService } from './post-feed.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Post Feed')
@Crud({
  model: {
    type: PostFeed,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: false,
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
  path: 'post-feed',
  version: '1',
})
export class PostFeedController implements CrudController<PostFeed> {
  constructor(readonly service: PostFeedService) {
  }

  get base(): CrudController<PostFeed> {
    return this;
  }

  @ApiOperation({ summary: 'Get friends post' })
  @Get('friends-post/:user_id')
  public async getFriendsPost(@Param('user_id') user_id: string) {
    return this.service.friendsPosts(user_id);
  }

  @ApiOperation({ summary: 'Get posts from other users' })
  @Get('other-users-posts/:user_id')
  public async getPostsFromOtherUsers(@Param('user_id') user_id: string) {
    return this.service.otherUsersPost(user_id);
  }
}
