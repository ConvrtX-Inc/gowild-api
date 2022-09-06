import { Controller, UseGuards } from '@nestjs/common';
import { RouteService } from './route.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Route } from './entities/route.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Route')
@Crud({
  model: {
    type: Route,
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
  path: 'route',
  version: '1',
})
export class RouteController implements CrudController<Route> {
  constructor(readonly service: RouteService) {
  }

  get base(): CrudController<Route> {
    return this;
  }
}
