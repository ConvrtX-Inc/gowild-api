import { Test, TestingModule } from '@nestjs/testing';
import { RouteHistoricalEventPhotoService } from './route-historical-event-photo.service';

describe('RouteHistoricalEventPhotoService', () => {
  let service: RouteHistoricalEventPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteHistoricalEventPhotoService],
    }).compile();

    service = module.get<RouteHistoricalEventPhotoService>(RouteHistoricalEventPhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
