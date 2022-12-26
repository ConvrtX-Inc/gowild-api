import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {CardsService} from './cards.service';
import {CreateCardDto} from './dto/create-card.dto';
import {UpdateCardDto} from './dto/update-card.dto';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  CrudService,
  GetManyDefaultResponse, Override
} from "@nestjsx/crud";
import {Card} from "./entities/card.entity";
import {CreateSubAdminDto} from "../sub-admin/dto/create-sub-admin.dto";
import {StatusService} from "../statuses/status.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AdminRolesGuard} from "../roles/admin.roles.guard";
import {Route} from "../route/entities/route.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";


//@ApiBearerAuth()
//@UseGuards(JwtAuthGuard/*,AdminRolesGuard*/)
//@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
@ApiTags('Cards')
@Crud({
  model: {
    type: Card,
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
  path: 'cards',
  version: '1'
})

export class CardsController implements CrudController<Card> {
  constructor(private readonly cardsService: CardsService,
              private readonly configService: ConfigService) {}

  service: CrudService<Card>;

  @Override('createOneBase')
  async createOneCard(@Body() dto:CreateCardDto){
    return this.cardsService.createCard(dto)
  }

  @ApiResponse({ type: Card })
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

    const path: Record<files.FileType, string> = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };


    return this.cardsService.updateImage(id, path.local);
  }


  @Override('getOneBase')
  async getOneCard(@Body() dto:CreateCardDto){
    return this.cardsService.createCard(dto)
  }
  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
