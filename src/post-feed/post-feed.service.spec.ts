import { Test, TestingModule } from '@nestjs/testing';
import { PostFeedService } from './post-feed.service';

describe('PostFeedService', () => {
  let service: PostFeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostFeedService],
    }).compile();

    service = module.get<PostFeedService>(PostFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
