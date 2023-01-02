import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Friends } from 'src/friends/entities/friend.entity';
import { Repository } from 'typeorm';
import { PostFeed } from './entities/post-feed.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { CreatePostFeedDto } from "./dto/create-post-feed.dto";
import { UserEntity } from 'src/users/user.entity';
import { PostFeedAttachment } from 'src/post-feed-attchment/post-feed-attachment.entity';

@Injectable()
export class PostFeedService extends TypeOrmCrudService<PostFeed> {
  constructor(
    @InjectRepository(PostFeed)
    private postFeedRepository: Repository<PostFeed>,
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>
  ) {
    super(postFeedRepository);
  }

  async create(userId: string, createPostFeedDto: CreatePostFeedDto) {
    const feedData = await this.postFeedRepository.create({ user_id: userId, views: 0, ...createPostFeedDto });
    await this.postFeedRepository.save(feedData);

    const user = await UserEntity.findOne(
      {
        where: { id: userId }
      }
    )

    if (!feedData) {
      return {
        "errors": [
          {
            message: "Could not create Post-Feed!",
            status: HttpStatus.BAD_REQUEST,
          }
        ]
      }
    }
    feedData['user'] = user;
    return { message: "Post-Feed created successfully!", data: feedData };
  }

  public async updatePicture(id: string, picture: string) {
    const postFeed = await this.postFeedRepository.findOne({
      where: { id: id },
    });

    const user = await UserEntity.findOne(
      {
        where: { id: postFeed.user_id }
      }
    )

    if (!postFeed) {
      throw new NotFoundException({
        errors: [
          {
            user: 'post feed does not exist',
          },
        ],
      });
    }

    postFeed['user'] = user;
    postFeed.picture = picture;
    return { message: "Post-Feed created successfully!", data: await postFeed.save() };
  }

  async update(createPostFeedDto: CreatePostFeedDto) {
    return this.postFeedRepository.save(this.postFeedRepository.create({ ...createPostFeedDto }));
  }

  /*
    Get One Post-feed and incrementing its view
    */
  async getOnePost(id: string) {
    const post = await this.postFeedRepository.findOne({
      id: id,
    });
    post.views++;
    await post.save();

    const likes = await Like.count({
      postfeed_id: id
    });
    const comments = await Comment.count({
      postfeed_id: id
    })

    let like_images = [];
    const likesPicture = await this.likeRepository.createQueryBuilder('like')
      .leftJoinAndMapOne('like.user', UserEntity, 'user', 'user.id = like.user_id')
      .orderBy('RANDOM()')
      .limit(3)
      .where("like.postfeed_id = :id", { id })
      .getMany()

    likesPicture.forEach((obj, index) => {

      if(obj['user']) {

        if (obj['user'].picture != null) {
          like_images.push(obj['user'].picture)
        }else{
          like_images.push("")
        }
      }
    })
    // hello there
    post['likes'] = likes;
    post['comments'] = comments;
    post['likes_images'] = like_images;
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

    return { data: post };
  }

  /*
   Get Many Post-feed
   */
  async getManyPost() {
  
    const allPosts = await this.postFeedRepository.createQueryBuilder('postFeed')
      .leftJoinAndMapOne('postFeed.user', UserEntity, 'user', 'postFeed.user_id = user.id')
      .leftJoinAndMapMany('postFeed.attachment', PostFeedAttachment,'attachment', 'postFeed.id = attachment.postfeed_id')
      .orderBy('postFeed.createdDate', 'DESC')
      .getMany();

    let data = [];
    for (let i = 0; i < allPosts.length; i++) {
      const likes = await Like.count({
        postfeed_id: allPosts[i].id
      });
      const comments = await Comment.count({
        postfeed_id: allPosts[i].id
      })

      // Getting Likes User Images
      let like_images = [];
      const likesPicture = await this.likeRepository.createQueryBuilder('like')
        .where("like.postfeed_id = :id", { id: allPosts[i].id })
        .leftJoinAndMapOne('like.user', UserEntity, 'user', 'user.id = like.user_id')
        .orderBy('like.createdDate', 'DESC')
        .limit(3)
        .getMany()

      likesPicture.forEach((obj, index) => {
        if (obj['user'].picture != null) {
          like_images.push(obj['user'].picture)
        } else {
          like_images = [""];
        }
      })
      allPosts[i]['likes'] = likes;
      allPosts[i]['comments'] = comments;
      allPosts[i]['likes_images'] = like_images;
      data.push(allPosts[i]);
    }
    if (!data) {
      return {
        "errors": [
          {
            message: "Post-Feeds Not Found",
            status: HttpStatus.BAD_REQUEST,
          }
        ]
      }
    }

    return { message: "Post_Feeds successfully fetched!", data: data };
  }

  /*
   Increment In Share Count
   */
  async sharePost(id: string) {
    const post = await this.postFeedRepository.findOne({
      id: id,
    });
    post.share++;
    await post.save();
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
    return post;
  }

  async friendsPosts(user_id: string) {
    return 1;
    // let aggregatedFriendsPost: Array<PostFeed[]> = [];
    // const result = await this.friendsRepository.find({
    //   user_id: user_id,
    //   is_approved: true,
    // });
    // for (const post of result) {
    //   const postOfFriends = await this.postFeedRepository
    //     .createQueryBuilder('postListOfFriends')
    //     .innerJoinAndMapMany(
    //       'postListOfFriends.user',
    //       UserEntity,
    //       'user',
    //       'user.id = postListOfFriends.user_id',
    //     )
    //     .leftJoinAndMapMany(
    //       'postListOfFriends.comment',
    //       Comment,
    //       'comment',
    //       'comment.postfeed_id = postListOfFriends.id',
    //     )
    //     .leftJoinAndMapMany(
    //       'postListOfFriends.like',
    //       Like,
    //       'like',
    //       'like.postfeed_id = postListOfFriends.id',
    //     )
    //     .leftJoinAndMapMany(
    //       'postListOfFriends.share',
    //       Share,
    //       'share',
    //       'share.postfeed_id = postListOfFriends.id',
    //     )
    //     .select([
    //       'postListOfFriends',
    //       'user.id',
    //       'user.full_name',
    //       'comment',
    //       'like',
    //       'share',
    //     ])
    //     .where('postListOfFriends.user_id = :user_id', {
    //       user_id: post.friend_id,
    //     })
    //     .andWhere('postListOfFriends.is_published = :is_published', {
    //       is_published: true,
    //     })
    //     .getMany();
    //   aggregatedFriendsPost.push(postOfFriends);
    // }
    // return aggregatedFriendsPost;
  }

  async otherUsersPost(user_id: string) {
    return 1;
    // const userIdSet = new Set();
    // let aggregatedOtherUsersPosts: Array<PostFeed[]> = [];
    // const resultOfOtherUserPosts = await this.friendsRepository
    //   .createQueryBuilder('ListOfOtherUsers')
    //   .select(['ListOfOtherUsers'])
    //   .where('ListOfOtherUsers.user_id != :user_id', { user_id: user_id })
    //   .andWhere('ListOfOtherUsers.friend_id != :user_id', { user_id: user_id })
    //   .getMany();
    // for (const combi of resultOfOtherUserPosts) {
    //   userIdSet.add(combi.user_id);
    //   userIdSet.add(combi.friend_id);
    // }
    // for (const postOfOthers of [...userIdSet]) {
    //   const postOfOtherUsers = await this.postFeedRepository
    //     .createQueryBuilder('postListOfOtherUsers')
    //     .innerJoinAndMapMany(
    //       'postListOfOtherUsers.user',
    //       UserEntity,
    //       'user',
    //       'user.id = postListOfOtherUsers.user_id',
    //     )
    //     .leftJoinAndMapMany(
    //       'postListOfOtherUsers.comment',
    //       Comment,
    //       'comment',
    //       'comment.postfeed_id = postListOfOtherUsers.id',
    //     )
    //     .leftJoinAndMapMany(
    //       'postListOfOtherUsers.like',
    //       Like,
    //       'like',
    //       'like.postfeed_id = postListOfOtherUsers.id',
    //     )
    //     .leftJoinAndMapMany(
    //       'postListOfOtherUsers.share',
    //       Share,
    //       'share',
    //       'share.postfeed_id = postListOfOtherUsers.id',
    //     )
    //     .select([
    //       'postListOfOtherUsers',
    //       'user.id',
    //       'user.full_name',
    //       'comment',
    //       'like',
    //       'share',
    //     ])
    //     .where('postListOfOtherUsers.user_id = :user_id', {
    //       user_id: postOfOthers,
    //     })
    //     .andWhere('postListOfOtherUsers.is_published = :is_published', {
    //       is_published: true,
    //     })
    //     .getMany();
    //   aggregatedOtherUsersPosts.push(postOfOtherUsers);
    // }
    // return aggregatedOtherUsersPosts;
  }
}
