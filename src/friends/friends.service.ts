import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
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
        to_user_id: req.id,
        from_user_id: user.sub,
      };
     const request = await this.saveOne(data);
      return {
        messsage :  "Friend Request Sent Successfully",
        data : request
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
      const accepted =  await requested.save();
      return {
        message : "Friend Request Accepted Successfully",
        data :accepted
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
    console.log("Getting friends for :" + user.sub);
    const query = await this.friendsRepository.find({
      where: [
        { to_user_id: user.sub, is_accepted: true },
        { from_user_id: user.sub, is_accepted: true }
      ]
    });
   
      return query;
  };

  async getReceivedRequests(user:any){
    return 1;
  //   const query = await this.friendsRepository.find({
  //     where:[
  //         {to_user_id:user.id,is_accepted:false}
  //     ]
  
  //   });
  //   console.log(query);
  
  //   var friends=[];
  //   var retunArr=[];
    
  // for(const i in query){
  
  //   console.log("1Get FRIENDS:"+query[i].from_user_id);
  //   console.log("2Get FRIENDS:"+query[i].to_user_id);
  //   var u = await this.userRepository.findOne({
  //     where:{
  //       id : query[i].from_user_id == user.id?query[i].to_user_id:query[i].from_user_id 
  //     }
  //   });    
    // friends[i] = { 
    //   user:u,
    //   connection:query[i]
    // };
  //   retunArr[i]= u;
  //   retunArr[i]['connection']=query[i];
  // }
  //   return retunArr;
  // //  return {
  // //   friends:friends
  // //  }
  
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
