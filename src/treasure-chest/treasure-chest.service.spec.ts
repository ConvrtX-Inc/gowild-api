import { Test, TestingModule } from '@nestjs/testing';
import { TreasureChestService } from './treasure-chest.service';

describe('TreasureChestService', () => {
  let service: TreasureChestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreasureChestService],
    }).compile();

    service = module.get<TreasureChestService>(TreasureChestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
