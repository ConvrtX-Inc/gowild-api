import { Test, TestingModule } from '@nestjs/testing';
import { LeaderBoardService } from './leader-board.service';

describe('LeaderBoardService', () => {
  let service: LeaderBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaderBoardService],
    }).compile();

    service = module.get<LeaderBoardService>(LeaderBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
