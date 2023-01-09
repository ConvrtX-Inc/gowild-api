import { Test, TestingModule } from '@nestjs/testing';
import { LeaderBoardController } from './leader-board.controller';
import { LeaderBoardService } from './leader-board.service';

describe('LeaderBoardController', () => {
  let controller: LeaderBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderBoardController],
      providers: [LeaderBoardService],
    }).compile();

    controller = module.get<LeaderBoardController>(LeaderBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
