import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserTreasureHuntEntity} from "./user-treasure-hunt.entity";

@Module({
  controllers: [],
  providers: [],
  imports: [TypeOrmModule.forFeature([UserTreasureHuntEntity])],
})
export class UserTreasureHuntModule {}
