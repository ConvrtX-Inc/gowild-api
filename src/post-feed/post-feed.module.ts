import { Module } from '@nestjs/common';
import { PostFeedService } from './post-feed.service';
import { PostFeedController } from './post-feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostFeed } from './entities/post-feed.entity';
import { FriendsService } from 'src/friends/friends.service';
import { Friends } from 'src/friends/entities/friend.entity';

@Module({
  controllers: [PostFeedController],
  providers: [PostFeedService, FriendsService],
  imports: [TypeOrmModule.forFeature([PostFeed, Friends])],
})
export class PostFeedModule {}
