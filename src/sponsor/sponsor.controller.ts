import {
  Body,
  Controller,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Sponsor } from './entities/sponsor.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { AdminRolesGuard } from 'src/roles/admin.roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
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
  constructor(
    readonly service: SponsorService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  get base(): CrudController<Sponsor> {
    return this;
  }

  @Override('createOneBase')
  async createSponserEntity(@Body() dto: CreateSponsorDto) {
    return this.service.createSponsor(dto);
  }

  @Override('deleteOneBase')
  async deleteOneEntityy(@Request() request) {
    return this.service.softDelete(request.params.id);
  }

  @ApiResponse({ type: Sponsor })
  @Get(':treasure_chest_id')
  @ApiOperation({ summary: 'Sponsors by treasureChestId' })
  @HttpCode(HttpStatus.OK)
  async getManySponsers(@Param('treasure_chest_id') treasure_chest_id: string) {
    return this.service.getmanySponsors(treasure_chest_id);
  }

  @ApiResponse({ type: Sponsor })
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
  @UseInterceptors(FileInterceptor('file'))
  public async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const driver = this.configService.get('file.driver');
    const picture = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.service.updateImage(id, picture[driver]);
  }
}
