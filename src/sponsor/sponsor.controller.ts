import { Body, Controller, Get, Request, UploadedFiles, HttpCode, HttpStatus, UseGuards, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Sponsor } from './entities/sponsor.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { Update } from 'aws-sdk/clients/dynamodb';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import {ConfigService} from "@nestjs/config";
import { Route } from 'src/route/entities/route.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@ApiTags('Admin Sponsor')
@Crud({
  model: {
    type: Sponsor,
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
  path: 'admin/sponsor',
  version: '1',
})
export class SponsorController implements CrudController<Sponsor> {
  constructor(readonly service: SponsorService, private readonly filesService: FilesService,
    private readonly configService: ConfigService) { }

  get base(): CrudController<Sponsor> {
    return this;
  }

  @Override('createOneBase')
  async createSponserEntity(@Body() dto: CreateSponsorDto) {
    return this.service.createSponsor(dto);
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
  @Post(':id/update-image')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  public async updatePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const driver = this.configService.get('file.driver');
    // const fileId = await this.filesService.uploadFile(file);
    return this.service.updateImage(id, file);
  }
}
