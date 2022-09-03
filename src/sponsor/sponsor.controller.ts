import { Controller, UseGuards } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController } from '@nestjsx/crud';
import { Sponsor } from './entities/sponsor.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Sponsor')
@Crud({
  model: {
    type: Sponsor,
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
  path: 'sponsor',
  version: '1',
})
export class SponsorController implements CrudController<Sponsor> {
  constructor(readonly service: SponsorService) {
  }

  get base(): CrudController<Sponsor> {
    return this;
  }
}
