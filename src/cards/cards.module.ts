import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import {StatusModule} from "../statuses/status.module";
import {Card} from "./entities/card.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [StatusModule, TypeOrmModule.forFeature([ Card ])],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
