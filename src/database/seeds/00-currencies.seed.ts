import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as CommonCurrencies from '../../../common.currencies.json';
import { Currency } from '../../currency/currency.entity';

interface CommonCurrency {
  symbol: string;
  code: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  name_plural?: string;
}

export default class CurrenciesSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const count = await connection
      .createQueryBuilder()
      .select('c')
      .from(Currency, 'c')
      .getCount();
    if (count !== 0) {
      return;
    }

    const currenciesEntries: [string, CommonCurrency][] =
      Object.entries(CommonCurrencies);

    for (const [, value] of currenciesEntries) {
      await factory(Currency)()
        .map(async (currency) => {
          currency.code = value.code;
          currency.name = value.name;
          currency.namePlural = value.name_plural;
          currency.symbol = value.symbol;
          return currency;
        })
        .create();
    }
  }
}
