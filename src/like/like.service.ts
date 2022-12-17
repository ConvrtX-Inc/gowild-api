import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { PostFeed } from 'src/post-feed/entities/post-feed.entity';
import { DataPipeline } from 'aws-sdk';

@Injectable()
export class LikeService extends TypeOrmCrudService<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {
    super(likeRepository);
  }

  async saveEntity(data: DeepPartial<Like>) {
    return this.likeRepository.save(this.likeRepository.create(data));
  }

  async createOnelike(dto: any, req: any) {

    const post = await PostFeed.findOne({
      where: { id: dto.postfeed_id }
    })
    if (!post) {
      return {
        "errors": [
          {
            message: "Post-Feed Does not exist",
            status: HttpStatus.BAD_REQUEST,
          }
        ]
      }
    }
    const isExist = await this.likeRepository.findOne({
      where: {
        user_id: req,
        postfeed_id: dto.postfeed_id
      }
    });
    if (isExist) {
      const unlike = await this.likeRepository.delete(isExist.id)
      console.log(unlike);
      
      const likes = await this.likeRepository.count({
        where: { postfeed_id: dto.postfeed_id }
      });
      post['likes'] = likes;
      return {
        message: "Post Un-Liked Successfully",
        data: post
      }
    } else {
      const newlike = {
        user_id: req,
        postfeed_id: dto.postfeed_id,
      }
      await this.saveEntity(newlike);
    }

    const likes = await this.likeRepository.count({
      where: { postfeed_id: dto.postfeed_id }
    });
    post['likes'] = likes;

    return {
      message: "Post Liked Successfully",
      data: post
    }

  }
}
