import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  imports: [TypeOrmModule.forFeature([Currency])],
})
export class CurrencyModule {}
