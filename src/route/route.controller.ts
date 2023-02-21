import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
  Get,
} from '@nestjs/common';
import { RouteService } from './route.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { Route } from './entities/route.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRouteDto } from './dto/create-route.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from '../files/files.service';
import { ConfigService } from '@nestjs/config';
import { SaveRouteDto } from './dto/save-route-dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Route')
@Crud({
  model: {
    type: Route,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase','getOneBase'],
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
        exclude: ['createdDate', 'updatedDate', ],
      },
      'historicalEvents.image': {
        eager: true,
        exclude: ['createdDate', 'updatedDate',],
      },
    },
  },
  dto: {
    create: CreateRouteDto,
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
  constructor(
    readonly service: RouteService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  get base(): CrudController<Route> {
    return this;
  }
@Get('/:id')
@ApiOperation({ summary: 'Get One Route' })
async getOneRoute(@Param('id') id: string){
 return this.service.getOneRoute(id);
}


  @Override('deleteOneBase')
  async deleteOneRoute(@Param('id') id: string) {
    return await this.service.deleteOneRoute(id);
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
    return this.service.create(request.user.sub, RoleEnum.USER, dto, request.user.user);
  }

  @Override('updateOneBase')
  async updateOneRoute(@Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return await this.service.updateOneRoute(id, dto);
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
    const driver = this.configService.get('file.driver');
    const picture = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.service.updatePicture(id, picture[driver]);
  }

  @Roles(RoleEnum.USER)
  @Get('approved')
  @ApiOperation({ summary: 'Get All Approved Routes' })
  async getApprovedRoutes(@Request() req, @Query() query) {
    return await this.service.getApprovedRoutes(
      req.user.sub,
      query.lat,
      query.long,
      query.page,
    );
  }

  @Roles(RoleEnum.USER)
  @Get('created-routes')
  @ApiOperation({ summary: 'Get All User Created Routes' })
  async getUserCreatedRoutes(@Request() req, @Query() query) {
    return await this.service.findAndCountManyEntities({
        where: { user_id: req.user.sub },
        relations: ['historicalEvents'],
        order: {createdDate: "DESC"}
      }, query.page, query.limit)

  }
  @Roles(RoleEnum.USER)
  @Post('save')
  async saveRoute(@Request() req, @Body() dto: SaveRouteDto) {
    return await this.service.saveRoute(req.user, dto);
  }

  @Roles(RoleEnum.USER)
  @Get('save')
  async getSaveRoute(@Request() req, @Query() query) {
    return await this.service.getSaveRoute(req.user.sub, query.pageNo, query.limitNo);
  }
}
