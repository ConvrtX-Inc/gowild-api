import { Test, TestingModule } from '@nestjs/testing';
import { RouteHistoricalEventPhotoController } from './route-historical-event-photo.controller';
import { RouteHistoricalEventPhotoService } from './route-historical-event-photo.service';

describe('RouteHistoricalEventPhotoController', () => {
  let controller: RouteHistoricalEventPhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteHistoricalEventPhotoController],
      providers: [RouteHistoricalEventPhotoService],
    }).compile();

    controller = module.get<RouteHistoricalEventPhotoController>(RouteHistoricalEventPhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
