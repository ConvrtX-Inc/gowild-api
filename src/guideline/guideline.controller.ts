import { Controller, Get, Param, UseGuards,Body, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { GuidelineService } from './guideline.service';
import { Guideline } from './guideline.entity';
import { GuidelineLogsService } from 'src/guideline-logs/guideline-logs.service';
import { GuidelineLog } from 'src/guideline-logs/guideline-log.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {selectFields} from "./dtos/show-selected-fields.dto";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {RolesGuard} from "../roles/roles.guard";
import { CreateGuidelineDto } from './dtos/Create.dto';
import { GuidelineTypesEnum } from './guideline.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(RoleEnum.ADMIN)
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
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  async createOne(@Body() createGuidelineDto : CreateGuidelineDto, @Request() req){
    return this.service.createOneGuideline(createGuidelineDto, req.user.sub)
  }



  // @Override()
  // createOne(@ParsedBody() dto: selectFields) {
  //   return this.service.saveOne(dto);
  // }

  // @Override('updateOneBase')
  // coolFunction(
  //   @ParsedRequest() req: CrudRequest,
  //   @ParsedBody() dto: Guideline,
  // ) {
  //   const result = this.base.updateOneBase(req, dto);
  //   const logData = new GuidelineLog();
  //   logData.guideline_type = dto.type;
  //   logData.userId = dto.last_updated_user;
  //   this.guidelineLogsService.saveOne(logData);
  //   return result;
  // }

  @Get('/:type')
  @ApiOperation({ summary: 'Get Terms and Conditions by Type' })
  getTermsByType(@Param('type') type: string) {
    return this.service.getTermsByType(type);
  }
}
