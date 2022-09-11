import { Controller } from '@nestjs/common';
import { StatusService } from './status.service';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Status } from './status.entity';

@ApiTags('Status')
@Crud({
  model: {
    type: Status,
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
  path: 'statuses',
  version: '1',
})
export class StatusController implements CrudController<Status> {
  constructor(public service: StatusService) {}

  get base(): CrudController<Status> {
    return this;
  }
}
