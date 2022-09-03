import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
  path: 'comment',
  version: '1',
})
export class CommentController implements CrudController<Comment> {
  constructor(readonly service: CommentService) {
  }

  get base(): CrudController<Comment> {
    return this;
  }
}
