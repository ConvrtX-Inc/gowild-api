import {
  Controller,
  UseGuards,
  Body,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Comment')
@Crud({
  model: {
    type: Comment,
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
  path: 'comment',
  version: '1',
})
export class CommentController implements CrudController<Comment> {
  constructor(readonly service: CommentService) {}

  get base(): CrudController<Comment> {
    return this;
  }

  @Override('createOneBase')
  async createOne(@Request() req, @Body() dto: CreateCommentDto) {
    return await this.service.createOneComment(dto, req.user.sub);
  }

  @Get('/:postfeed_id')
  public async getComments(@Param('postfeed_id') postfeedId: string) {
    return this.service.getPostFeedComments(postfeedId);
  }
}
