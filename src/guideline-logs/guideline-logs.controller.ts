import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { GuidelineLog } from './guideline-log.entity';
import { GuidelineLogsService } from './guideline-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Guideline Logs')
@Crud({
  model: {
    type: GuidelineLog,
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
  path: 'guideline-logs',
  version: '1',
})
export class GuidelineLogsController implements CrudController<GuidelineLog> {
  constructor(public service: GuidelineLogsService) {
  }

  get base(): CrudController<GuidelineLog> {
    return this;
  }
}
