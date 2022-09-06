import { Controller, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Like } from './entities/like.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Like')
@Crud({
  model: {
    type: Like,
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
  path: 'like',
  version: '1',
})
export class LikeController implements CrudController<Like> {
  constructor(readonly service: LikeService) {
  }

  get base(): CrudController<Like> {
    return this;
  }
}
