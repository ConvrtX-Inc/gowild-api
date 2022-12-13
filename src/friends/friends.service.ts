import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Not, Repository } from 'typeorm';
import { Friends } from './entities/friend.entity';
import { UserEntity } from 'src/users/user.entity';
import { SendFriendRequestDto } from './dto/create-friend.dto';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { ConfirmDto } from './dto/confirm-request.dto'
import { UsersService } from 'src/users/users.service';
import { RepositoryOwner } from 'aws-sdk/clients/codestar';



@Injectable()
export class FriendsService extends TypeOrmCrudService<Friends> {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
  ) {
    super(friendsRepository);
  }

  /*
    * save single entity
    */
  async saveOne(data) {
    return await this.saveEntity(data);
  }

  /*
   * save entity
   */
  async saveEntity(data: DeepPartial<Friends>[]) {
    return this.friendsRepository.save(
      this.friendsRepository.create(data),
    );
  }


  /*
   * Send Friend Request Via Email
   */
  public async sendFriendRequestByEmail(
    user: any,
    sendFriendRequestDto: SendFriendRequestDto,
  ) {
    const req = await UserEntity.findOne({
      where: {
        email: sendFriendRequestDto.email,
      },
    });

    if (req) {

      if (req.id == user.sub) {
        return {
          response: {
            message: "Cannot send request to yourself",
            code: "cannotSendRequestToSelf",
            dto: sendFriendRequestDto
          },
          status: HttpStatus.BAD_REQUEST
        }
      }

      const sentRequest = await this.friendsRepository.findOne({
        where: {
          to_user_id: req.id,
          from_user_id: user.sub
        }

      });
      if (sentRequest) {

        return {
          response: {
            message: "Already sent a request",
            code: "requestExists",
            dto: sendFriendRequestDto
          },
          status: HttpStatus.BAD_REQUEST
        };

      }

      const receievedRequest = await this.friendsRepository.findOne({
        where: {
          from_user_id: req.id,
          to_user_id: user.sub
        }

      });
      if (receievedRequest) {

        return {
          response: {
            message: "Already received a request",
            code: "requestExistsFromUser",
            dto: sendFriendRequestDto
          },
          status: HttpStatus.BAD_REQUEST
        };


      }
      const data = {
        from_user_id: user.sub,
        to_user_id: req.id,
      };

      const saved = await this.friendsRepository.save(
        this.friendsRepository.create(data));


      const saved2 = {
        from_user_id: req.id,
        to_user_id: user.sub,
        parent_id: saved.id,
      };
      await this.saveOne(saved2);
      return {
        messsage: "Friend Request Sent Successfully",
        data: saved
      }
    }

    return {
      message: "User not found",
      statusCode: HttpStatus.BAD_REQUEST
    }
  }


  async confirm(user: any, dto: ConfirmDto) {
    var requested: Friends = await this.friendsRepository.findOne({
      where: {
        to_user_id: user.sub,
        from_user_id: dto.id
      }
    })
    if (requested) {
      if (requested.is_accepted) {
        return {
          status: HttpStatus.BAD_REQUEST,
          response: {
            dto: dto,
            code: 'alreadyConfirmed',
            message: 'Request Already Confirmed'
          }
        };
      }

      requested.is_accepted = true;
      const childFriend = await this.friendsRepository.findOne({
        where: { parent_id: requested.id }
      });
      console.log(childFriend)
      childFriend.is_accepted = true;
      await childFriend.save();
      const accepted = await requested.save();
      return {
        message: "Friend Request Accepted Successfully",
        data: accepted
      }

    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          dto: dto,
          code: 'noRequst',
          message: 'Connection Request Not Found'
        }
      };
    }

  };


  async getFriends(user: any) {

    const query = await this.friendsRepository.find({
      where:
        { from_user_id: user.sub, is_accepted: true },
    });

    return query;
  };

  async getReceivedRequests(user: any) {

    const query = await this.friendsRepository.find({
      where: [
        { to_user_id: user.sub, is_accepted: false, parent_id: null }
      ]

    });
    console.log(query);

    var friends = [];
    var retunArr = [];

    for (const i in query) {

      console.log("1Get FRIENDS:" + query[i].from_user_id);
      console.log("2Get FRIENDS:" + query[i].to_user_id);
      var u = await UserEntity.findOne({
        where: {
          id: query[i].from_user_id == user.sub ? query[i].to_user_id : query[i].from_user_id
        }
      });
      friends[i] = {
        user: u,
        connection: query[i]
      };
      retunArr[i] = u;
      retunArr[i]['connection'] = query[i];
    }
    return {
      recieved: retunArr
    };
    //  return {
    //   friends:friends
    //  }

  }

  async delete(id: string) {
    const childFriend = await this.friendsRepository.findOne({
      where: { parent_id: id },
    });
    const deletedfriend = await this.friendsRepository.delete(id)

    if (childFriend) {
      await this.friendsRepository.delete(childFriend.id);
    }

    if (deletedfriend.affected == 0) {
      return {
        error: [
          { message: "No Friend Found" }
        ]
      }
    }
    return {
      message: "Friend Deleted Successfully"
    }
  }


  async acceptedFriends(id: string) {
    return 1;
    // const post = await this.friendsRepository.findOne({
    //   where: { id: id },
    // });
    // if (post) {
    //   post.is_approved = true;
    //   await post.save();
    // }
  }

  async suggestedFriends() {
    const users = await UserEntity.find({});
    return {
      data: users
    };
    // let aggregatedFriends: Array<Friends[]> = [];
    // const suggestedFriendsRepo = await this.friendsRepository
    //   .createQueryBuilder('friendsList')
    //   .select(['friendsList'])
    //   .where('friendsList.user_id = :user_id', { user_id: user_id })
    //   .andWhere('friendsList.is_approved = :is_approved', { is_approved: true })
    //   .getMany();
    // for (const friend of suggestedFriendsRepo) {
    //   const suggestedFriendsOfFriendsRepo = await this.friendsRepository
    //     .createQueryBuilder('friendsOfFriendsList')
    //     .innerJoinAndMapMany(
    //       'friendsOfFriendsList.user',
    //       UserEntity,
    //       'user',
    //       'user.id = friendsOfFriendsList.user_id',
    //     )
    //     .select(['friendsOfFriendsList', 'user.id', 'user.full_name'])
    //     .where('friendsOfFriendsList.user_id = :user_id', {
    //       user_id: friend.friend_id,
    //     })
    //     .andWhere('friendsOfFriendsList.is_approved = :is_approved', {
    //       is_approved: true,
    //     })
    //     .getMany();
    //   aggregatedFriends.push(suggestedFriendsOfFriendsRepo);
    // }
    // return aggregatedFriends;
  }
}
