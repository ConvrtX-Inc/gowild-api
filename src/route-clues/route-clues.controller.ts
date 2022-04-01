import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { RouteCluesService } from './route-clues.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteClue } from './entities/route-clue.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
  constructor(readonly service: RouteCluesService) {}

  get base(): CrudController<RouteClue>{
    return this;
  }
  
}
