import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';
import { RegisterTreasureHuntDto } from './dto/register-treasure-hunt.dto';
import {
  UserTreasureHuntEntity,
  UserTreasureHuntStatusEnum,
} from 'src/user-treasure-hunt/user-treasure-hunt.entity';
import { UserTreasureHuntService } from 'src/user-treasure-hunt/user-treasure-hunt.service';
import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { UserEntity } from 'src/users/user.entity';
import { NotificationService } from '../notification/notification.service';
import { paginateResponse } from 'src/common/paginate.response';
import { NotificationTypeEnum } from "../notification/notification-type.enum";
import { statusEnumsNames } from 'src/auth/status.enum';

@Injectable()
export class TreasureWildService extends TypeOrmCrudService<TreasureChest> {
  constructor(
    @InjectRepository(TreasureChest)
    private treasureChestRepository: Repository<TreasureChest>,
    @InjectRepository(UserTreasureHuntEntity)
    private UserTreasureHuntRepository: Repository<UserTreasureHuntEntity>,
    private readonly UserTreasureHuntService: UserTreasureHuntService,
    private readonly NotificationService: NotificationService,
  ) {
    super(treasureChestRepository);
  }

  /*
    Register User for Treaure Hunt 
    */
  async registerTreasureHunt(dto: RegisterTreasureHuntDto, req) {

    const isExist = await this.UserTreasureHuntRepository.createQueryBuilder("treasure_hunt")
      .where("treasure_hunt.user_id = :user_id", { user_id: req.user.sub })
      .andWhere("treasure_hunt.status = :status1 OR treasure_hunt.status = :status2",
        { status1: UserTreasureHuntStatusEnum.PENDING, status2: UserTreasureHuntStatusEnum.PROCESSING })
      .leftJoinAndMapMany('treasure_hunt.chest', TreasureChest, 'chest',
        'treasure_hunt.treasure_chest_id = chest.id')
      .orderBy('chest.eventDate', 'DESC')
      .getMany();
    
    
    if (isExist.length != 0) {
      
        let EventDate = await this.treasureChestRepository.findOne({
          where: {
            id: isExist[0]?.treasure_chest_id
          },
        });
      if(EventDate != null){
        const event = EventDate?.eventDate
        const currentDate = new Date(Date.now())
  
        if (event >= currentDate) {
          return { errors: [{ message: "You're Already Register in a Hunt" }] };
        }
      }
     
    }

    let newEventDate = await this.treasureChestRepository.findOne({
      where: {
        id: dto.treasure_chest_id,
      },
    });
    if (newEventDate?.eventDate < new Date(Date.now())) {
      return { errors: [{ message: "Treasure Chest Expired!" }] };
    }

    const data = {
      treasure_chest_id: dto.treasure_chest_id,
      user_id: req.user.sub,
      status: UserTreasureHuntStatusEnum.PENDING,
    };

    const newRegister = await this.UserTreasureHuntService.saveOne(data);
    await this.NotificationService.createNotification(
      data.user_id,
      'TreasureHunt created successfully!', NotificationTypeEnum.TREASURE_CHEST
    );
    return { message: 'Successfully Registered', data: newRegister };
  }

  /*
    Find Many Register Users
    */
  async getManyUserTreasureHunt() {
    const all = await UserTreasureHuntEntity.find({});
    return { data: all };
  }

  async getTreasureWild(limit: number, pageNo: number, id: string) {
    const take = limit || 100;
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const data = await this.treasureChestRepository
      .createQueryBuilder('treasureChest')
      .where('treasureChest.eventDate >= :currentDate', {
        currentDate: currentDate,
      })
      .leftJoinAndMapMany(
        'treasureChest.treasureHunts',
        UserTreasureHuntEntity,
        'treasureHunts',
        'treasureChest.id = treasure_chest_id and treasureHunts.status != :status',{status: UserTreasureHuntStatusEnum.DISAPPROVE}
      )
      .leftJoinAndMapMany(
        'treasureChest.sponsors',
        Sponsor,
        'sponsors',
        'treasureChest.id = treasure_chest',
      )
      .leftJoinAndMapOne(
        'treasureHunts.user',
        UserEntity,
        'user',
        'treasureHunts.user_id = user.id',
      )
      .skip(skip)
      .take(take)
      .getManyAndCount();


    const crrUser = await this.treasureChestRepository
      .createQueryBuilder('treasureChest')
      .where('treasureChest.eventDate >= :currentDate', {
        currentDate: currentDate,
      })
      .innerJoinAndMapOne(
        'treasureChest.treasureHunts',
        UserTreasureHuntEntity,
        'treasureHunts',
        'treasureChest.id = treasure_chest_id AND user_id = :user ',
        { user: id },
      )
      .andWhere('treasureHunts.status != :status',{status: UserTreasureHuntStatusEnum.DISAPPROVE})
      .leftJoinAndMapOne(
        'treasureHunts.user',
        UserEntity,
        'user',
        'treasureHunts.user_id = user.id',
      )
      .getOne();

    // return {data:data, currentUser: crrUser}; 

    const parrentArray = [];
    const customArray = [];

    for (let index = 0; index < data[0].length; index++) {

      const chest = data[0][index];
      const userHunt = crrUser;

      if (userHunt != null) {
        const userHuntid = userHunt['treasureHunts'];
        if (userHuntid.treasure_chest_id == chest.id) {
          chest['current_user_hunt'] = userHunt['treasureHunts'];
          customArray.push(chest);
        } else {
          chest['current_user_hunt'] = null;
          customArray.push(chest);
        }
      } else {
        chest['current_user_hunt'] = null;
        customArray.push(chest);
      }
    }

    parrentArray.push(customArray);
    parrentArray.push(data[1]);


    /*   */
    // const parrentArray = [];
    // const customArray = [];

    // data[0].map((chest, index) => {
    //   const userHunt = crrUser[0];
    //   if (userHunt[index]['treasureHunts'][0]) {
    //     const userHuntid = userHunt[index]['treasureHunts'][0];
    //     if (userHuntid.treasure_chest_id == chest.id) {
    //       console.log('If condition is true');
    //       chest['current_user_hunt'] = userHunt[index]['treasureHunts'][0];
    //       customArray.push(chest);
    //     } else {
    //       chest['current_user_hunt'] = null;
    //       customArray.push(chest);
    //     }
    //   } else {
    //     chest['current_user_hunt'] = null;
    //     customArray.push(chest);
    //   }
    // });
    // parrentArray.push(customArray);
    // parrentArray.push(data[1]);
    return paginateResponse(parrentArray, page, take);
  }

  /*
   Verify OTP code for User Treasure Hunt 
   */
  async verifyHunt(dto, user) {
    const hunt = await this.UserTreasureHuntService.findOne({
      where: {
        treasure_chest_id: dto.treasure_chest_id,
        user_id: user.sub,
      },
    });

    if (hunt) {
      if (hunt.code == dto.code) {
        hunt.status = UserTreasureHuntStatusEnum.APPROVED;
        const updated = await hunt.save();
        return { message: 'Successfully Registered', data: updated };
      } else {
        return {
          errors: [
            {
              message: 'Verification Failed',
            },
          ],
        };
      }
    } else {
      return {
        errors: [
          {
            message: 'No User Treasure Hunt Found',
          },
        ],
      };
    }
  }

  /*
   * Resent Treasure Hunt OTP
   */
  async resendCode(dto: RegisterTreasureHuntDto, id: string) {
    const hunt = await this.UserTreasureHuntService.findOne({
      where: {
        treasure_chest_id: dto.treasure_chest_id,
        user_id: id,
        status: UserTreasureHuntStatusEnum.PROCESSING,
      },
    });
    if (!hunt) {
      return {
        errors: [
          {
            message: 'No User Treasure Hunt Found',
          },
        ],
      };
    }
    hunt.code = '000000';
    await hunt.save();
    return {
      message:
        'A fresh registereation number has been sent to your registered mobile number',
    };
  }
}
