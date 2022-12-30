import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import {PostFeed} from "../post-feed/entities/post-feed.entity";

@Module({
  controllers: [LikeController],
  providers: [LikeService],
  imports: [TypeOrmModule.forFeature([Like, PostFeed])],
})
export class LikeModule {}
