import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { RouteHistoricalEventsService } from './route-historical-events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImageUpdateDto } from '../users/dtos/image-update.dto';
import {AdminRolesGuard} from "../roles/admin.roles.guard";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiTags('Admin Route Historical Event')
@Crud({
  model: {
    type: RouteHistoricalEvent,
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
  path: 'admin/route-historical-events',
  version: '1',
})
export class RouteHistoricalEventsController
  implements CrudController<RouteHistoricalEvent>
{
  constructor(readonly service: RouteHistoricalEventsService) {}

  get base(): CrudController<RouteHistoricalEvent> {
    return this;
  }

  @ApiResponse({ type: RouteHistoricalEvent })
  @ApiBody({ type: ImageUpdateDto })
  @Post(':id/update-picture')
  @HttpCode(HttpStatus.OK)
  public async updatePicture(
    @Param('id') id: string,
    @Body() dto: ImageUpdateDto,
  ) {
    return this.service.updatePicture(id, dto.fileId);
  }

  @ApiResponse({ type: RouteHistoricalEvent })
  @ApiBody({ type: [ImageUpdateDto] })
  @Post(':id/medias')
  @HttpCode(HttpStatus.OK)
  public async updateMedias(
    @Param('id') id: string,
    @Body() dtos: ImageUpdateDto[],
  ) {
    return this.service.updateMedias(
      id,
      dtos.map(({ fileId }) => fileId),
    );
  }
}
