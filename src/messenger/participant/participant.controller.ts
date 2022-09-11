import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { Participant } from './participant.entity';
import { ParticipantService } from './participant.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  path: 'participants',
  version: '1',
})
export class ParticipantController implements CrudController<Participant> {
  constructor(public service: ParticipantService) {}

  get base(): CrudController<Participant> {
    return this;
  }
}
