import { Test, TestingModule } from '@nestjs/testing';
import { RouteCluesService } from './route-clues.service';

describe('RouteCluesService', () => {
  let service: RouteCluesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteCluesService],
    }).compile();

    service = module.get<RouteCluesService>(RouteCluesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
