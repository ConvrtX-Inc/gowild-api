import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RouteCluesService } from './route-clues.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteClue } from './entities/route-clue.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Route Clues')
@Crud({
  model: {
    type: RouteClue,
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
  path: 'route-clues',
  version: '1',
})
export class RouteCluesController implements CrudController<RouteClue> {
  constructor(readonly service: RouteCluesService) {
  }

  get base(): CrudController<RouteClue> {
    return this;
  }

  @ApiOperation({ summary: 'Get all clues' })
  @Get('all-clues/:route_id')
  public async getAllClues(@Param('route_id') route_id: string) {
    return this.service.allClues(route_id);
  }
}
