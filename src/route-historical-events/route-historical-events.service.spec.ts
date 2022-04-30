import { Test, TestingModule } from '@nestjs/testing';
import { RouteHistoricalEventsService } from './route-historical-events.service';

describe('RouteHistoricalEventsService', () => {
  let service: RouteHistoricalEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteHistoricalEventsService],
    }).compile();

    service = module.get<RouteHistoricalEventsService>(RouteHistoricalEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
