import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, UploadedFile,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Crud, CrudController, Override} from '@nestjsx/crud';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { RouteHistoricalEventsService } from './route-historical-events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {AdminRolesGuard} from "../roles/admin.roles.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { RouteHistoricalEventMedias } from './entities/route-historical-event-medias.entity';
import {CreateRouteHistoricalEventDto} from "./dto/create-route-historical-event.dto";
import {UpdateRouteHistoricalEventDto} from "./dto/update-route-historical-event.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiTags('Admin Route Historical Event')
@Crud({
  model: {
    type: RouteHistoricalEvent,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase', 'createOneBase'],
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
  constructor(readonly service: RouteHistoricalEventsService, private readonly configService: ConfigService) {}

  get base(): CrudController<RouteHistoricalEvent> {
    return this;
  }

  @ApiOperation({ summary: 'Create Historical Events Routes' })
  @Post('/:route_id')
  @HttpCode(HttpStatus.OK)
  public async create(@Param('route_id') route_id: string, @Body() dto: CreateRouteHistoricalEventDto) {
    return{
      message: 'Historical Event Routes created Successfully!',
      data: await this.service.createHistoricalEvent(route_id, dto)
    }
  }

  @ApiOperation({summary: 'Get all Historical Routes'})
  @Override('getManyBase')
  public async getHistoricalEvents(){
    return{
      message: "Historical Event Routes fetched Successfully!",
      data: await this.service.getAllHistoricalEvents()
    }
  }

  @ApiOperation({summary: 'Get all Historical Routes through route ID'})
  @Get(':route_id/events')
  public async getHistoricalEventsById(@Param('route_id') route_id: string){
    return{
      message: "Historical Event Routes fetched Successfully!",
      data: await this.service.getAllHistoricalEventsByRouteId(route_id)
    }
  }

  @ApiOperation({summary: 'Get one Historical Route'})
  @Override('getOneBase')
  public async getHistoricalEvent(@Param('id') id: string){
    return{
      message: "Historical Event Route fetched Successfully!",
      data: await this.service.getOneHistoricalEvent(id)
    }
  }

  @ApiOperation({summary: 'Update one Historical Route '})
  @Override('updateOneBase')
  public async updateHistoricalEvents(@Param('id') id: string, @Body() dto: UpdateRouteHistoricalEventDto)
  {
    return{
      message: "Historical Event Route updated Successfully!",
      data: await this.service.updateOneHistoricalEvent(id, dto)
    }
  }

  @ApiResponse({ type: RouteHistoricalEvent })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':id/update-picture')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const driver = this.configService.get('file.driver');
    const picture =  {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.service.updatePicture(id, picture[driver] );
  }



  @ApiResponse({ type: RouteHistoricalEventMedias })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':id/update-medias')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateMedias(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const driver = this.configService.get('file.driver');
    const picture =  {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.service.updateMedias(id, picture[driver] );
  }
}
