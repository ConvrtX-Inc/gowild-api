import { Controller, UseGuards } from '@nestjs/common';
import { TreasureChestService } from './treasure-chest.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { TreasureChest } from './entities/treasure-chest.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Treasure Chest')
@Crud({
  model: {
    type: TreasureChest,
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
  path: 'treasure-chest',
  version: '1',
})
export class TreasureChestController implements CrudController<TreasureChest> {
  constructor(readonly service: TreasureChestService) {
  }

  get base(): CrudController<TreasureChest> {
    return this;
  }
}
