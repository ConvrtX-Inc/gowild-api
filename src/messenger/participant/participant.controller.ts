import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';

import { Participant } from './participant.entity';
import { ParticipantService } from './participant.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Participant')
@Crud({
  model: {
    type: Participant,
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
export class ParticipantController implements CrudController<Participant> {
  constructor(public service: ParticipantService) {}

  get base(): CrudController<Participant> {
    return this;
  }
  
}
