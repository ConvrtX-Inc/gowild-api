import { Controller } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Currency } from './currency.entity';

@ApiTags('Currencies')
@Crud({
  model: {
    type: Currency,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
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
  path: 'currencies',
  version: '1',
})
export class CurrencyController implements CrudController<Currency> {
  constructor(public service: CurrencyService) {
  }

  get base(): CrudController<Currency> {
    return this;
  }
}
