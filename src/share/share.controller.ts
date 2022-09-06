import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Share } from './entities/share.entity';
import { ShareService } from './share.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Share')
@Crud({
  model: {
    type: Share,
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
  path: 'share',
  version: '1',
})
export class ShareController implements CrudController<Share> {
  constructor(readonly service: ShareService) {
  }

  get base(): CrudController<Share> {
    return this;
  }
}
