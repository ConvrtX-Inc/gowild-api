import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class CurrencyService extends TypeOrmCrudService<Currency> {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {
    super(currencyRepository);
  }
}
