import { Controller, UseGuards } from '@nestjs/common';
import { SystemSupportService } from './system-support.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController } from '@nestjsx/crud';
import { SystemSupport } from './system-support.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('System Support')
@Crud({
  model: {
    type: SystemSupport,
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
  path: 'system-supports',
  version: '1',
})
export class SystemSupportController implements CrudController<SystemSupport> {
  constructor(public service: SystemSupportService) {
  }

  get base(): CrudController<SystemSupport> {
    return this;
  }
}
