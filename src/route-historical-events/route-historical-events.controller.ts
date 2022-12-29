import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param, Request,
  Post,UploadedFiles, UploadedFile,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { RouteHistoricalEventsService } from './route-historical-events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImageUpdateDto } from '../users/dtos/image-update.dto';
import {AdminRolesGuard} from "../roles/admin.roles.guard";
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RouteHistoricalEventMedias } from './entities/route-historical-event-medias.entity';

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
  constructor(readonly service: RouteHistoricalEventsService, private readonly configService: ConfigService) {}

  get base(): CrudController<RouteHistoricalEvent> {
    return this;
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
