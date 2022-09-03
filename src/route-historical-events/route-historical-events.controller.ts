import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { RouteHistoricalEventsService } from './route-historical-events.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Route Historical Event')
@Crud({
  model: {
    type: RouteHistoricalEvent,
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
  path: 'route-historical-events',
  version: '1',
})
export class RouteHistoricalEventsController implements CrudController<RouteHistoricalEvent> {
  constructor(readonly service: RouteHistoricalEventsService) {
  }

  get base(): CrudController<RouteHistoricalEvent> {
    return this;
  }

}
