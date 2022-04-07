import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Friends } from 'src/friends/entities/friend.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { PostFeed } from './entities/post-feed.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Share } from 'src/share/entities/share.entity';

@Injectable()
export class PostFeedService extends TypeOrmCrudService<PostFeed> {
  constructor(
    @InjectRepository(PostFeed)
    private postFeedRepository: Repository<PostFeed>,
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
  ) {
    super(postFeedRepository);  
  }

  async friendsPosts(user_id: string){
    let aggregatedFriendsPost: Array<PostFeed[]> = [];
    const result = 
      await this.friendsRepository.find({ user_id: user_id, is_approved: true });
    for(const post of result){
      const postOfFriends = await this.postFeedRepository
      .createQueryBuilder("postListOfFriends")
      .innerJoinAndMapMany('postListOfFriends.user', User, 'user', 'user.id = postListOfFriends.user_id')
      .leftJoinAndMapMany('postListOfFriends.comment', Comment, 'comment', 'comment.postfeed_id = postListOfFriends.id')
      .leftJoinAndMapMany('postListOfFriends.like', Like, 'like', 'like.postfeed_id = postListOfFriends.id')
      .leftJoinAndMapMany('postListOfFriends.share', Share, 'share', 'share.postfeed_id = postListOfFriends.id')
      .select([
        'postListOfFriends',
        'user.id',
        'user.full_name',
        'user.profile_photo',
        'comment',
        'like',
        'share'
      ])
      .where("postListOfFriends.user_id = :user_id", {user_id: post.friend_id})
      .andWhere("postListOfFriends.is_published = :is_published", {is_published: true})
      .getMany();
      aggregatedFriendsPost.push(postOfFriends);
    }
    return aggregatedFriendsPost;
  }

  async otherUsersPost(user_id: string){
    const userIdSet = new Set();
    let aggregatedOtherUsersPosts: Array<PostFeed[]> = [];
    const resultOfOtherUserPosts = await this.friendsRepository
      .createQueryBuilder("ListOfOtherUsers")
      .select([
        'ListOfOtherUsers'
      ])
      .where("ListOfOtherUsers.user_id != :user_id", { user_id: user_id })
      .andWhere("ListOfOtherUsers.friend_id != :user_id", { user_id: user_id })
      .getMany();
      for (const combi of resultOfOtherUserPosts)
      {
        userIdSet.add(combi.user_id);
        userIdSet.add(combi.friend_id);
      }
      for(const postOfOthers of [...userIdSet]){
        const postOfOtherUsers = await this.postFeedRepository
        .createQueryBuilder("postListOfOtherUsers")  
        .innerJoinAndMapMany('postListOfOtherUsers.user', User, 'user', 'user.id = postListOfOtherUsers.user_id')
        .leftJoinAndMapMany('postListOfOtherUsers.comment', Comment, 'comment', 'comment.postfeed_id = postListOfOtherUsers.id')
        .leftJoinAndMapMany('postListOfOtherUsers.like', Like, 'like', 'like.postfeed_id = postListOfOtherUsers.id')
        .leftJoinAndMapMany('postListOfOtherUsers.share', Share, 'share', 'share.postfeed_id = postListOfOtherUsers.id')
        .select([
          'postListOfOtherUsers',
          'user.id',
          'user.full_name',
          'user.profile_photo',
          'comment',
          'like',
          'share'
        ])
        .where("postListOfOtherUsers.user_id = :user_id", {user_id: postOfOthers})
        .andWhere("postListOfOtherUsers.is_published = :is_published", {is_published: true})
        .getMany();
        aggregatedOtherUsersPosts.push(postOfOtherUsers);
      }
    return aggregatedOtherUsersPosts;
  }
}
