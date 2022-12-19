import {Controller, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors, Body} from '@nestjs/common';
import { TreasureChestService } from './treasure-chest.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { TreasureChest } from './entities/treasure-chest.entity';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {Route} from "../route/entities/route.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "../files/files.service";
import {AdminRolesGuard} from "../roles/admin.roles.guard";
import {CreateTreasureChestDto} from "./dto/create-treasure-chest.dto";
import { ChangeHuntStatusDto } from './dto/change-hunt-status';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard,AdminRolesGuard)
@ApiTags('Admin Treasure Chest')
@Crud({
  model: {
    type: TreasureChest,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  dto: {
    create: CreateTreasureChestDto
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
  path: 'admin/treasure-chest',
  version: '1',
})
export class TreasureChestController implements CrudController<TreasureChest> {
  constructor(readonly service: TreasureChestService, private readonly filesService: FilesService) {}

  get base(): CrudController<TreasureChest> {
    return this;
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
    const fileId = await this.filesService.uploadFile(file);
    return this.service.updatePicture(id, fileId.path);
  }

  @Post('hunt/status/:id')
  async huntStatus(@Param('id') id:string , @Body() dto :ChangeHuntStatusDto){
    return this.service.huntStatus(id,dto);
  }
}
