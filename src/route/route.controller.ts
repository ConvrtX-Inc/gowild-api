import {
  Body, ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request, UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {RouteService} from './route.service';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Crud, CrudController, CrudRequestInterceptor} from '@nestjsx/crud';
import {Route} from './entities/route.entity';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {ImageUpdateDto} from '../users/dtos/image-update.dto';
import {CreateRouteDto} from "./dto/create-route.dto";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {RolesGuard} from "../auth/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "../files/files.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
  dto: {
    create: CreateRouteDto
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
  constructor(readonly service: RouteService, private readonly filesService: FilesService) {}

  get base(): CrudController<Route> {
    return this;
  }

  @ApiResponse({ type: Route })
  @ApiConsumes('multipart/form-data')
  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.USER)
  public async create(
      @Request() request: Express.Request,
      @Body() dto: CreateRouteDto,
  ) {
    return this.service.create(request.user.sub, RoleEnum.USER, dto);
  }
  @ApiResponse({ type: Route })
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
  @Roles(RoleEnum.USER)
  @UseInterceptors(FileInterceptor('file'))
  public async updatePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileId = await this.filesService.uploadFile(file);
    return this.service.updatePicture(id, fileId);
  }
}
