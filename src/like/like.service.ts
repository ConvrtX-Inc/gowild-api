import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { PostFeed } from 'src/post-feed/entities/post-feed.entity';
import {UserEntity} from "../users/user.entity";

@Injectable()
export class LikeService extends TypeOrmCrudService<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(PostFeed)
    private postFeedRepository: Repository<PostFeed>
  ) {
    super(likeRepository);
  }

  async saveEntity(data: DeepPartial<Like>) {
    return this.likeRepository.save(this.likeRepository.create(data));
  }

  async createOnelike(dto: any, req: any) {

    const post = await this.postFeedRepository.createQueryBuilder('postFeed')
        .where('postFeed.id = :id',{id: dto.postfeed_id})
        .leftJoinAndMapOne('postFeed.user', UserEntity, 'user', 'user.id = postFeed.user_id')
        .getOne()

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
      
      const likes = await this.likeRepository.count({
        where: { postfeed_id: dto.postfeed_id }
      });

      let like_images = [];
      const likesPicture = await this.likeRepository.createQueryBuilder('like')
          .where("like.postfeed_id = :id", {id: dto.postfeed_id})
          .leftJoinAndMapOne('like.user', UserEntity, 'user', 'user.id = like.user_id')
          .orderBy('RANDOM()'/*'like.createdDate','DESC'*/)
          .limit(3)
          .getMany()

      likesPicture.forEach((obj,index)=>{

        if(obj['user']){
          if(obj['user'].picture != null) {
            like_images.push(obj['user'].picture)
          }else{
            like_images.push("");
          }
        }

      })
      post['likes'] = likes;
      post['likes_images'] = like_images
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
    let like_images = [];
    const likesPicture = await this.likeRepository.createQueryBuilder('like')
        .where("like.postfeed_id = :id", {id: dto.postfeed_id})
        .leftJoinAndMapOne('like.user', UserEntity, 'user', 'user.id = like.user_id')
        .orderBy('RANDOM()'/*'like.createdDate','DESC'*/)
        .limit(3)
        .getMany()

    likesPicture.forEach((obj,index)=>{
      if(obj['user']){
      if(obj['user'].picture != null) {
        like_images.push(obj['user'].picture)
      }else{
        like_images.push("");
      }
    }})
    post['likes'] = likes;
    post['likes_images'] = like_images

    return {
      message: "Post Liked Successfully",
      data: post
    }

  }
}
