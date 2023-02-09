import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { GuidelineService } from './guideline.service';
import { Guideline } from './guideline.entity';
import { GuidelineLogsService } from 'src/guideline-logs/guideline-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRolesGuard } from '../roles/admin.roles.guard';
import { CreateGuidelineDto } from './dtos/Create.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Admin Guidelines')
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
  path: 'admin-guidelines',
  version: '1',
})
export class GuidelinesController implements CrudController<Guideline> {
  constructor(
    public readonly service: GuidelineService,
    public readonly guidelineLogsService: GuidelineLogsService,
  ) {}

  get base(): CrudController<Guideline> {
    return this;
  }

  @Override('createOneBase')
  @ApiOperation({ summary: 'Create or Update Admin Guidelines' })
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  async createOne(
    @Body() createGuidelineDto: CreateGuidelineDto,
    @Request() req,
  ) {
    return this.service.createOneGuideline(createGuidelineDto, req.user.sub);
  }

  @Get('/:type')
  @ApiOperation({ summary: 'Get Terms and Conditions by Type' })
  getTermsByType(@Param('type') type: string) {
    return this.service.getTermsByType(type);
  }
}
