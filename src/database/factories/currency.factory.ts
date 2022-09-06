import { define } from 'typeorm-seeding';
import { Currency } from '../../currency/currency.entity';

define(Currency, () => {
  return new Currency();
});
