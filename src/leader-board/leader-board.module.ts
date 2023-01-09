import { Module } from '@nestjs/common';
import { LeaderBoardService } from './leader-board.service';
import { LeaderBoardController } from './leader-board.controller';

@Module({
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService]
})
export class LeaderBoardModule {}
