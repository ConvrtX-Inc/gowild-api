import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { In, Not, Repository } from 'typeorm';
import { Friends } from './entities/friend.entity';
import { UserEntity } from 'src/users/user.entity';
import { SendFriendRequestDto } from './dto/create-friend.dto';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { ConfirmDto } from './dto/confirm-request.dto'
import { UsersService } from 'src/users/users.service';
import { RepositoryOwner } from 'aws-sdk/clients/codestar';
import { identity } from 'rxjs';
import { throws } from 'assert';



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
    console.log(childFriend);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@');
    if (childFriend) {
      await this.friendsRepository.delete(childFriend.id);
    } else {
      const parentFriend = await this.friendsRepository.findOne({
        where: { id: id }
      });
      console.log(parentFriend);
      if(parentFriend){
         await this.friendsRepository.delete(parentFriend.parent_id);
        console.log("parentFriend DELETED")
      }
    }  
    const deletedfriend = await this.friendsRepository.delete(id)      
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

  async suggestedFriends(user) {

    const crrUser = await UserEntity.findOne({
      where: { id: user.sub }
    })

    const friend = this.friendsRepository.createQueryBuilder('f');
    const friendArr = await friend
      .select([
        'f.to_user_id as to_user_id',
      ])
      .where("f.from_user_id = :id AND f.is_accepted = :accepted", { id: user.sub, accepted: true })
      .getRawMany();


    var removed = [];
    if (crrUser.removed_suggested_friends != null) {
      crrUser.removed_suggested_friends.map(e => {
        removed.push(e)
      });
    }

    const friendId = []
    friendArr.map((f) => {
      friendId.push(f.to_user_id)
    })

    // If Both Arrays Are Empty then Adding some Dummy Data
    if (removed[0] == null) {
      removed.push(user.sub);
    }
    if (friendId[0] == null) {
      friendId.push(user.sub);
    }

    const users = UserEntity.createQueryBuilder('u');
    const all = await users
      .select([
        'u.id as id',
        'u.firstName as firstName',
        'u.lastName as  lastName',
        'u.birthDate as  birthDate',
        'u.gender as  gender',
        'u.email as  email',
        'u.phoneNo as  phoneNo',
        'u.addressOne as  addressOne',
        'u.addressTwo as  addressTwo',
        'u.about_me as  about_me',
        'u.picture as  picture',
        'u.frontImage as  frontImage',
        'u.backImage as  backImage',
        'u.status as  status',
        'u.role as  role',
      ])
      .where("u.id NOT IN (:...id) AND u.id != :user AND u.id NOT IN (:...rem)", { id: friendId, user: user.sub, rem: removed })
      .getRawMany();
    return { data: await this.mapListingsData(all) };
  }

  /*
    Remove From Suggested User 
    */
  async removeSuggested(id: string, user) {
    const users = await UserEntity.findOne({
      where: { id: user.sub }
    });

    if (users.removed_suggested_friends == null) {
      users.removed_suggested_friends = []
      await users.save()
    }
    const arr = { id: id }
    users.removed_suggested_friends.push(id);
    return { data: await users.save() };

  }

  async mapListingsData(dataArray) {

    const data = dataArray.map((obj) => {
      let container: {
        id: string;
        firstName: string;
        lastName: string;
        birthDate: string;
        gender: boolean;
        email: string;
        phoneNo: string;
        addressOne: string;
        addressTwo: string;
        about_me: string;
        picture: string;
        frontImage: string;
        backImage: string;
        status: string;
        role: string;
      } = {
        id: obj.id,
        firstName: obj.firstname,
        lastName: obj.lastname,
        birthDate: obj.birthdate,
        gender: obj.gender,
        email: obj.email,
        phoneNo: obj.phoneno,
        addressOne: obj.addressone,
        addressTwo: obj.addresstwo,
        about_me: obj.about_me,
        picture: obj.picture,
        frontImage: obj.frontimage,
        backImage: obj.backimage,
        status: obj.status,
        role: obj.role,
      };
      return container;
    });
    return data;
  }

}
