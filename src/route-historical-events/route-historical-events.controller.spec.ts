import { Test, TestingModule } from '@nestjs/testing';
import { RouteHistoricalEventsController } from './route-historical-events.controller';
import { RouteHistoricalEventsService } from './route-historical-events.service';

describe('RouteHistoricalEventsController', () => {
  let controller: RouteHistoricalEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteHistoricalEventsController],
      providers: [RouteHistoricalEventsService],
    }).compile();

    controller = module.get<RouteHistoricalEventsController>(RouteHistoricalEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
