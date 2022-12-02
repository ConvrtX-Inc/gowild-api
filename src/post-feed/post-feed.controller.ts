import {Body, Controller, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { PostFeed } from './entities/post-feed.entity';
import { PostFeedService } from './post-feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {CreatePostFeedDto} from "./dto/create-post-feed.dto";
import {UpdatePostFeedDto} from "./dto/update-post-feed.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    alwaysPaginate: true,
  },
  dto: {
    create: CreatePostFeedDto,
    update: UpdatePostFeedDto
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
  constructor(readonly service: PostFeedService) {}

  get base(): CrudController<PostFeed> {
    return this;
  }

  // To get one Post-Feed and Increment its views
@Override('getOneBase')
async getOnePost(@Param('id') id){
  return this.service.getOnePost(id);
}

  // To get Many Post-Feed and Increment its views
  @Override('getManyBase')
  async getManyPost(){
     return this.service.getManyPost();
  }

// To Increment in share 
@Get('share/:id')
async share(@Param('id') id ){
  return await this.service.sharePost(id);

}

  @ApiOperation({ summary: 'Get friends post' })
  @Get('friends-post/:user_id')
  public async getFriendsPost(@Param('user_id') user_id: string) {
    return this.service.friendsPosts(user_id);
  }
  @ApiOperation({ summary: 'Create Post Feed' })
  @Post()
  public async create(@Request() request: Express.Request, @Body() createPostFeedDto: CreatePostFeedDto,) {
    return this.service.create(request.user?.sub, createPostFeedDto);
  }

  // @ApiOperation({ summary: 'Create Post Feed' })
  // @Patch(':id')
  // public async update(@Body() createPostFeedDto: CreatePostFeedDto,) {
  //   return this.service.update( createPostFeedDto);
  // }

  @ApiOperation({ summary: 'Get posts from other users' })
  @Get('other-users-posts/:user_id')
  public async getPostsFromOtherUsers(@Param('user_id') user_id: string) {
    return this.service.otherUsersPost(user_id);
  }
}
