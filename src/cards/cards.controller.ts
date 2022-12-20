import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CardsService} from './cards.service';
import {CreateCardDto} from './dto/create-card.dto';
import {UpdateCardDto} from './dto/update-card.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
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


@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
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
  constructor(private readonly cardsService: CardsService) {}

  service: CrudService<Card>;

  @Override('createOneBase')
  async createOneCard(@Body() dto:CreateCardDto){
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
