import { Controller, UseGuards, Body, Request } from '@nestjs/common';
import { LikeService } from './like.service';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Like } from './entities/like.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLikeDto } from './dto/create-like.dto';

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
  path: 'like',
  version: '1',
})
export class LikeController implements CrudController<Like> {
  constructor(readonly service: LikeService) {}

  get base(): CrudController<Like> {
    return this;
  }

  @Override('createOneBase')
  async createOne(@Request() req, @Body() dto: CreateLikeDto) {
    return await this.service.createOnelike(dto, req.user.sub);
  }
}
