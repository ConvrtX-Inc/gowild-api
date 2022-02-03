import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';

import { Room } from './room.entity';
import { RoomService } from './room.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Room')
@Crud({
  model: {
    type: Room,
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
  path: 'room',
  version: '1',
})
export class RoomController implements CrudController<Room> {
  constructor(public service: RoomService) {}

  get base(): CrudController<Room> {
    return this;
  }
  
}
