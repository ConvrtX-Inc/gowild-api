import { Module } from '@nestjs/common';
import { TreasureChestService } from './treasure-chest.service';
import { TreasureChestController } from './treasure-chest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';

@Module({
  controllers: [TreasureChestController],
  providers: [TreasureChestService],
  imports: [TypeOrmModule.forFeature([TreasureChest])],
})
export class TreasureChestModule {}
