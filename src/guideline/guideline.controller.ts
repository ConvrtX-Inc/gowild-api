import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { GuidelineService } from './guideline.service';
import { Guideline } from './guideline.entity';
import { GuidelineLogsService } from 'src/guideline-logs/guideline-logs.service';
import { GuidelineLog } from 'src/guideline-logs/guideline-log.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Guidelines')
@Crud({
  model: {
    type: Guideline,
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
  path: 'guidelines',
  version: '1',
})
export class GuidelinesController implements CrudController<Guideline> {
  constructor(public readonly service: GuidelineService,
              public readonly guidelineLogsService: GuidelineLogsService) {
  }

  get base(): CrudController<Guideline> {
    return this;
  }

  @Override()
  createOne(@ParsedBody() req: Guideline) {
    return this.service.saveOne(req);
  }

  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Guideline,
  ) {
    const result = this.base.updateOneBase(req, dto);
    const logData = new GuidelineLog();
    logData.guideline_type = dto.type;
    logData.userId = dto.last_updated_user;
    this.guidelineLogsService.saveOne(logData);
    return result;
  }


  @Get('/:type')
  @ApiOperation({ summary: 'Get Terms and Conditions by Type' })
  getTermsByType(@Param('type') type: string) {
    return this.service.getTermsByType(type);
  }
}
