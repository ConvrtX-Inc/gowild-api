import {Body, Controller, Get, Param, Request, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Crud, CrudController, Override,} from '@nestjsx/crud';
import {GuidelineService} from './guideline.service';
import {Guideline} from './guideline.entity';
import {GuidelineLogsService} from 'src/guideline-logs/guideline-logs.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {CreateGuidelineDto} from './dtos/Create.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
//@Roles(RoleEnum.ADMIN)
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
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.USER)
  getTermsByType(@Param('type') type: string) {
    return this.service.getTermsByType(type);
  }
}
