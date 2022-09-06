import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteHistoricalEventPhotoService } from './route-historical-event-photo.service';
import { RouteHistoricalEventPhoto } from './entities/route-historical-event-photo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Route Historical Event Photo')
@Crud({
  model: {
    type: RouteHistoricalEventPhoto,
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
  path: 'route-historical-event-photo',
  version: '1',
})
export class RouteHistoricalEventPhotoController implements CrudController<RouteHistoricalEventPhoto> {
  constructor(readonly service: RouteHistoricalEventPhotoService) {
  }

  get base(): CrudController<RouteHistoricalEventPhoto> {
    return this;
  }
}
