import { Test, TestingModule } from '@nestjs/testing';
import { PostFeedController } from './post-feed.controller';
import { PostFeedService } from './post-feed.service';

describe('PostFeedController', () => {
  let controller: PostFeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostFeedController],
      providers: [PostFeedService],
    }).compile();

    controller = module.get<PostFeedController>(PostFeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
