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
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {
  Crud,
  CrudController,
  CrudService,
   Override
} from "@nestjsx/crud";
import {Card} from "./entities/card.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AdminRolesGuard} from "../roles/admin.roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";
import {FilesService} from "../files/files.service";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard,AdminRolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
@ApiTags('Cards')
@Crud({
  model: {
    type: Card,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase', 'getOneBase'],
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
              private readonly filesService: FilesService,
              private readonly configService: ConfigService) {}

  service: CrudService<Card>;

  @Override('createOneBase')
  public async createOneCard(@Body() dto:CreateCardDto){
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
    const driver = this.configService.get('file.driver');
    const picture =  {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.cardsService.updatePicture(id, picture[driver] );
  }


  //@Override('getOneBase')
  @Get('/:id')
  public async getOneCard(@Param('id') id: string ){
    return this.cardsService.findOneCard(id)
  }
  @Get()
  public async findAllCards() {
    return this.cardsService.findAllCards();
  }



  @Patch(':id')
  public async updateOneCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  public async removeOneCard(@Param('id') id: string) {
    return this.cardsService.removeCard(id);
  }
}
