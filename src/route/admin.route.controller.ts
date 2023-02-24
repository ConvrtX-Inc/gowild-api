import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { Route } from './entities/route.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRouteDto } from './dto/create-route.dto';
import { RoleEnum } from '../roles/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';
import { AdminRolesGuard } from '../roles/admin.roles.guard';
import { ConfigService } from '@nestjs/config';
import { UpdateRouteDto } from './dto/update-route.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiTags('Admin Routes')
@Controller({
  path: 'admin/route',
  version: '1',
})
export class AdminRouteController {
  constructor(
    readonly service: RouteService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) { }

  @Get('users')
  @ApiOperation({ summary: 'Get User Routes' })
  async getUserRoutes() {
    return await this.service.getUserRoutes();
  }

  @ApiResponse({ type: Route })
  @ApiOperation({ summary: 'Create Admin Route' })
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Request() request: Express.Request,
    @Body() dto: CreateRouteDto,
  ) {
    return await this.service.create(
      request.user.sub,
      request.user.user.role as RoleEnum,
      dto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Admin Route' })
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

  @Get()
  @ApiOperation({ summary: 'Get all Admin Routes' })
  async getAdminRoutes() {
    return await this.service.getAllAdminRoutes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Single Route' })
  async findOneRoute(@Param('id') id: string) {
    return await this.service.findOneRoute(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Change Status to Approved' })
  async routeCompleteStatus(@Param('id') id: string) {
    return this.service.updateApprovedStatus(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Change Status to Reject' })
  async routeRejectStatus(@Param('id') id: string) {
    return this.service.updateRejectStatus(id);
  }
}
