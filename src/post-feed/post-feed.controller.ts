import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { PostFeed } from './entities/post-feed.entity';
import { PostFeedService } from './post-feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {CreatePostFeedDto} from "./dto/create-post-feed.dto";
import {UpdatePostFeedDto} from "./dto/update-post-feed.dto";
import {Route} from "../route/entities/route.entity";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {FileInterceptor} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";
import {FilesService} from "../files/files.service";
import {RolesGuard} from "../roles/roles.guard";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
  constructor(readonly service: PostFeedService, private readonly filesService: FilesService,
    private readonly configService: ConfigService) {}

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

  @ApiResponse({ type: PostFeed })
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
  @Post(':id/update-picture')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.USER)
  @UseInterceptors(FileInterceptor('file'))
  public async updatePicture(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
  ) {
    const driver = this.configService.get('file.driver');
    const picture =  {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.service.updatePicture(id, picture[driver] );
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
