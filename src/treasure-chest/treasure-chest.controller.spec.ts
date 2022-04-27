import { Test, TestingModule } from '@nestjs/testing';
import { TreasureChestController } from './treasure-chest.controller';
import { TreasureChestService } from './treasure-chest.service';

describe('TreasureChestController', () => {
  let controller: TreasureChestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreasureChestController],
      providers: [TreasureChestService],
    }).compile();

    controller = module.get<TreasureChestController>(TreasureChestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
