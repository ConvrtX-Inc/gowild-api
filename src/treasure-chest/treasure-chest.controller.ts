import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
  Get, Res,
} from '@nestjs/common';
import { TreasureChestService } from './treasure-chest.service';
import {Crud, CrudController, Override} from '@nestjsx/crud';
import { TreasureChest } from './entities/treasure-chest.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';
import { AdminRolesGuard } from '../roles/admin.roles.guard';
import { CreateTreasureChestDto } from './dto/create-treasure-chest.dto';
import { ChangeHuntStatusDto } from './dto/change-hunt-status';
import { ConfigService } from '@nestjs/config';
import { UserTreasureHuntService } from '../user-treasure-hunt/user-treasure-hunt.service';
import { UpdateTreasureChestDto } from './dto/update-treasure-chest.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiTags('Admin Treasure Chest')
@Crud({
  model: {
    type: TreasureChest,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  dto: {
    create: CreateTreasureChestDto,
    update: UpdateTreasureChestDto,
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
  constructor(
    readonly service: TreasureChestService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly userTreasureHuntService: UserTreasureHuntService,
  ) {}

  get base(): CrudController<TreasureChest> {
    return this;
  }

  @Override('getManyBase')
  @ApiOperation({ summary: 'Retrieve all Treasure Chests!' })
  async getAllTreasureChest() {
    return await this.service.getAllChests();
  }

  @ApiResponse({ type: TreasureChest })
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

  @Post('hunt/status/:id')
  async huntStatus(@Param('id') id: string, @Body() dto: ChangeHuntStatusDto) {
    return this.service.huntStatus(id, dto);
  }

  @Get('user-hunts')
  @ApiOperation({ summary: 'Retrieve all user Hunts!' })
  async getAllUserHunts() {
    return await this.userTreasureHuntService.getAllHunts();
  }
  @ApiOperation({ summary: 'Download CSV file' })
  @Get('csv')
  async downloadCsv(@Res() res) {

    const data = await this.userTreasureHuntService.getAllHunts();
    const csvData = await this.userTreasureHuntService.createCSVData(data)
    const csv =  await this.userTreasureHuntService.convertToCsv(csvData);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="user_hunt_data.csv"');
    res.send(csv);
  }
}
