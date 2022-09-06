import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { Room } from './room.entity';
import { RoomService } from './room.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  constructor(public service: RoomService) {
  }

  get base(): CrudController<Room> {
    return this;
  }

}
