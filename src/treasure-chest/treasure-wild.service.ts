import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';
import { RegisterTreasureHuntDto } from './dto/register-treasure-hunt.dto';
import { UserTreasureHuntEntity, UserTreasureHuntStatusEnum } from 'src/user-treasure-hunt/user-treasure-hunt.entity';
import { UserTreasureHuntService } from 'src/user-treasure-hunt/user-treasure-hunt.service';
import { isBigInt64Array } from 'util/types';
import { HttpStatus } from '@nestjs/common/enums';
import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { UserEntity } from 'src/users/user.entity';
import { title } from 'process';
import { stringify } from 'querystring';
import { type } from 'os';
import {NotificationService} from "../notification/notification.service";

@Injectable()
export class TreasureWildService extends TypeOrmCrudService<TreasureChest> {
  constructor(
    @InjectRepository(TreasureChest)
    private treasureChestRepository: Repository<TreasureChest>,
    private readonly UserTreasureHuntService: UserTreasureHuntService,
    private readonly NotificationService: NotificationService
  ) {
    super(treasureChestRepository);
  }

  async paginateResponse(data, page, limit) {

    const [result, total] = data;
    const totalPage = Math.ceil(total / limit);
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {

      data: [...result],
      count: total,
      currentPage: parseInt(page),
      prevPage: prevPage,
      totalPage: totalPage,
    }
  }
  /*
    Register User for Treaure Hunt 
    */
  async registerTreasureHunt(dto: RegisterTreasureHuntDto, req) {
    const isExist = await this.UserTreasureHuntService.findOne({
      where : {
        user_id : req.user.sub,
        status : UserTreasureHuntStatusEnum.PENDING || UserTreasureHuntStatusEnum.PROCESSING
      }
    });
    if(isExist){
      return {
        "errors": [
          {
            message: "You're Already Register in a Hunt",
          }
        ]
      }
    }
    const data = {
      treasure_chest_id: dto.treasure_chest_id,
      user_id: req.user.sub,
      status: UserTreasureHuntStatusEnum.PENDING
    }

    const newRegister = await this.UserTreasureHuntService.saveOne(data);
    await this.NotificationService.createNotification(data.user_id, 'TreasureHunt created successfully!')
    return { data: newRegister }
  }

  /*
    Find Many Register Users
    */
  async getManyUserTreasureHunt() {
    const all = await UserTreasureHuntEntity.find({});
    return { data: all }
  }

  async getTreasureWild(pageNo: number, id: string) {
    const take = 10
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.treasureChestRepository.createQueryBuilder('treasureChest')

      .leftJoinAndMapMany("treasureChest.treasureHunts", UserTreasureHuntEntity, 'treasureHunts', 'treasureChest.id = treasure_chest_id')
      .leftJoinAndMapMany('treasureChest.sponsors', Sponsor, 'sponsors', 'treasureChest.id = treasure_chest')
      .leftJoinAndMapOne('treasureHunts.user', UserEntity, 'user', 'treasureHunts.user_id = user.id')
      .skip(skip).take(take)
      .getManyAndCount();

    const crrUser = await this.treasureChestRepository.createQueryBuilder('treasureChest')
      .leftJoinAndMapMany("treasureChest.treasureHunts", UserTreasureHuntEntity, 'treasureHunts', 'treasureChest.id = treasure_chest_id AND user_id = :user ', { user: id })
      .leftJoinAndMapOne('treasureHunts.user', UserEntity, 'user', 'treasureHunts.user_id = user.id')
      .getManyAndCount()


    const parrentArray = []
    const customArray = [];

    data[0].map((chest, index) => {
      const userHunt = crrUser[0];
      if (userHunt[index]['treasureHunts'][0]) {
        var userHuntid = userHunt[index]['treasureHunts'][0];
        if (userHuntid.treasure_chest_id == chest.id) {
          console.log('If condition is true');
          chest['current_user_hunt'] = userHunt[index]['treasureHunts'][0];
          customArray.push(chest);
        } else {
          chest['current_user_hunt'] = null;
          customArray.push(chest);
        }
      } else {
        chest['current_user_hunt'] = null;
        customArray.push(chest);
      }

    })
    parrentArray.push(customArray);
    parrentArray.push(data[1]);
    return this.paginateResponse(parrentArray, page, take)
  }


  /*
   Verify OTP code for User Treasure Hunt 
   */
  async verifyHunt(dto, user) {
    const hunt = await this.UserTreasureHuntService.findOne({
      where: {
        treasure_chest_id: dto.treasure_chest_id,
        user_id: user.sub
      }
    });

    if (hunt) {
      if (hunt.code == dto.code) {
        hunt.status = UserTreasureHuntStatusEnum.APPROVED;
        let updated = await hunt.save();
        return { data: updated }
      } else {
        return {
          "errors": [
            {
              message: "Verification Failed",             
            }
          ]
        }
      }
    } else {
      return {
        "errors": [
          {
            message: "No User Treasure Hunt Found",            
          }
        ]
      }
    }
  }
}
