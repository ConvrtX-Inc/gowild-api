import {
  Controller,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { GuidelineService } from './guideline.service';
import { Guideline } from './guideline.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Terms And Condition')
@Crud({
  model: {
    type: Guideline,
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
  path: 'terms-and-conditions',
  version: '1'
})
export class GuidelinesController implements CrudController<Guideline> {
  constructor(public service: GuidelineService) { }

  get base(): CrudController<Guideline> {
    return this;
  }

  @Get('/:type')
  @ApiOperation({ summary: 'Get Terms and Conditions by Type' })
  getTermsByType(@Param('type') type: string) {
    return this.service.getTermsByType(type);
  }
}
