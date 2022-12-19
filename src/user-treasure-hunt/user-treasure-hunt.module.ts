import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserTreasureHuntEntity} from "./user-treasure-hunt.entity";
import { UserTreasureHuntService } from './user-treasure-hunt.service';


@Module({
  controllers: [],
  providers: [UserTreasureHuntService],
  imports: [TypeOrmModule.forFeature([UserTreasureHuntEntity])],
  exports: [UserTreasureHuntService],
})
export class UserTreasureHuntModule {}
