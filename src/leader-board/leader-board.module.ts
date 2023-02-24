import { Module } from '@nestjs/common';
import { LeaderBoardService } from './leader-board.service';
import { LeaderBoardController } from './leader-board.controller';
import { LeaderBoard } from './entities/leader-board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService],
  imports: [TypeOrmModule.forFeature([LeaderBoard])],
})
export class LeaderBoardModule {}
