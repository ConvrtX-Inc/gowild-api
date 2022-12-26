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
import {RoleEnum} from "../roles/roles.enum";
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "../files/files.service";
import {AdminRolesGuard} from "../roles/admin.roles.guard";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiTags('Admin Routes')
@Controller({
  path: 'admin/route',
  version: '1',
})
export class AdminRouteController {
  constructor(readonly service: RouteService, private readonly filesService: FilesService) {
  }

  @Get('users')
  @ApiOperation({summary: 'Get User Routes'})
  async getUserRoutes() {
    return await this.service.getUserRoutes();
  }
  @ApiResponse({type: Route})
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
      @Request() request: Express.Request,
      @Body() dto: CreateRouteDto,
  ) {
    return this.service.create(request.user.sub, request.user.user.role as RoleEnum, dto);
  }


  @ApiResponse({type: Route})
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
  public async updatePicture(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
  ) {
    const fileId = await this.filesService.uploadFile(file);
    return this.service.updatePicture(id, fileId);
  }

  @Get()
  @ApiOperation({summary: 'Get Routes'})
  async getAdminRoutes() {
    return await this.service.getAdminRoutes();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get Single Route'})
  async findOneRoute(@Param('id') id: string,) {
    return await this.service.findOneEntity({where: {id: id}});
  }

}
