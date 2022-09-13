import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { RouteCluesService } from './route-clues.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteClue } from './entities/route-clue.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImageUpdateDto } from '../users/dtos/image-update.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Route Clues')
@Crud({
  model: {
    type: RouteClue,
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
  path: 'route-clues',
  version: '1',
})
export class RouteCluesController implements CrudController<RouteClue> {
  constructor(readonly service: RouteCluesService) {}

  get base(): CrudController<RouteClue> {
    return this;
  }

  @ApiOperation({ summary: 'Get all clues' })
  @Get('all-clues/:route_id')
  public async getAllClues(@Param('route_id') route_id: string) {
    return this.service.allClues(route_id);
  }

  @ApiResponse({ type: RouteClue })
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
