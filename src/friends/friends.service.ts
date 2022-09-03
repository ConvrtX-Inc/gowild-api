import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { identity } from 'rxjs';
import { createQueryBuilder, Repository } from 'typeorm';
import { Friends } from './entities/friend.entity';
import { User } from 'src/users/user';

@Injectable()
export class FriendsService extends TypeOrmCrudService<Friends>{
  constructor(@InjectRepository(Friends)
  private friendsRepository: Repository<Friends>,
  ) {
    super(friendsRepository);
  }

  async acceptedFriends(id: string) {
    const post = await this.friendsRepository.findOne({
      where: { id: id },
    });
    if (post) {
      post.is_approved = true;
      await post.save();
    }
  }

  async suggestedFriends(user_id: string) {
    let aggregatedFriends: Array<Friends[]> = [];
    const suggestedFriendsRepo = await this.friendsRepository
      .createQueryBuilder("friendsList")
      .select([
        'friendsList',
      ])
      .where("friendsList.user_id = :user_id", {user_id: user_id})
      .andWhere("friendsList.is_approved = :is_approved", {is_approved: true})
      .getMany();
      for (const friend of suggestedFriendsRepo){
        const suggestedFriendsOfFriendsRepo = await this.friendsRepository
          .createQueryBuilder("friendsOfFriendsList")
          .innerJoinAndMapMany('friendsOfFriendsList.user', User, 'user', 'user.id = friendsOfFriendsList.user_id')
          .select([
            'friendsOfFriendsList',
            'user.id',
            'user.full_name',
          ])
          .where("friendsOfFriendsList.user_id = :user_id", {user_id: friend.friend_id})
          .andWhere("friendsOfFriendsList.is_approved = :is_approved", {is_approved: true})
          .getMany();
          aggregatedFriends.push(suggestedFriendsOfFriendsRepo);
       }
      return aggregatedFriends;
  }
}
