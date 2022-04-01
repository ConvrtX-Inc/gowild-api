import { Test, TestingModule } from '@nestjs/testing';
import { RouteCluesController } from './route-clues.controller';
import { RouteCluesService } from './route-clues.service';

describe('RouteCluesController', () => {
  let controller: RouteCluesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteCluesController],
      providers: [RouteCluesService],
    }).compile();

    controller = module.get<RouteCluesController>(RouteCluesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
