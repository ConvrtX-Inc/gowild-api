import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Route } from './entities/route.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImageUpdateDto } from '../users/dtos/image-update.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Route')
@Crud({
  model: {
    type: Route,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
    join: {
      picture: {
        eager: true,
        exclude: ['createdDate', 'updatedDate'],
      },
      historicalEvents: {
        eager: true,
        exclude: ['createdDate', 'updatedDate'],
      },
      'historicalEvents.image': {
        eager: true,
        exclude: ['createdDate', 'updatedDate'],
      },
    },
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
  path: 'route',
  version: '1',
})
export class RouteController implements CrudController<Route> {
  constructor(readonly service: RouteService) {}

  get base(): CrudController<Route> {
    return this;
  }

  @ApiResponse({ type: Route })
  @ApiBody({ type: ImageUpdateDto })
  @Post(':id/update-picture')
  @HttpCode(HttpStatus.OK)
  public async updatePicture(
    @Param('id') id: string,
    @Body() dto: ImageUpdateDto,
  ) {
    return this.service.updatePicture(id, dto.fileId);
  }
}
