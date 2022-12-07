import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {RouteService} from './route.service';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Route} from './entities/route.entity';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {CreateRouteDto} from "./dto/create-route.dto";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {RolesGuard} from "../roles/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
// import { Query } from 'typeorm/driver/Query';
import {FilesService} from "../files/files.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin Routes')
@Controller({
  path: 'admin/route',
  version: '1',
})
export class AdminRouteController {
  constructor(readonly service: RouteService, private readonly filesService: FilesService) {}


  @ApiResponse({ type: Route })
  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  public async create(
      @Request() request: Express.Request,
      @Body() dto: CreateRouteDto,
  ) {
    return this.service.create(request.user.sub, request.user.user.role as RoleEnum, dto);
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
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  public async updatePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileId = await this.filesService.uploadFile(file);
    return this.service.updatePicture(id, fileId);
  }

  @Get()
  @ApiOperation({ summary : 'Get All Routes'})
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async getAdminRoutes(){
    return await this.service.getAdminRoutes();
  }
}
