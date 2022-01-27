import { Controller, Request, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Crud, CrudController, Override } from '@nestjsx/crud';
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
    alwaysPaginate: false,
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
  constructor(public service: CurrencyService) {}

  get base(): CrudController<Currency> {
    return this;
  }

}
