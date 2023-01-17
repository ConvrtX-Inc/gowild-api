import {
  Injectable,
} from '@nestjs/common';
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

@Injectable()
export class TreasureWildService extends TypeOrmCrudService<TreasureChest> {
  constructor(
    @InjectRepository(TreasureChest)
    private treasureChestRepository: Repository<TreasureChest>,
    private readonly UserTreasureHuntService: UserTreasureHuntService,
    private readonly NotificationService: NotificationService,
  ) {
    super(treasureChestRepository);
  }

  /*
    Register User for Treaure Hunt 
    */
  async registerTreasureHunt(dto: RegisterTreasureHuntDto, req) {
    const isExist = await this.UserTreasureHuntService.findOne({
      where: {
        user_id: req.user.sub,
        status:
          UserTreasureHuntStatusEnum.PENDING ||
          UserTreasureHuntStatusEnum.PROCESSING,
      },
    });
    if (isExist) {
      var eventDate = await this.treasureChestRepository.findOne({
        where: {
          id: isExist.treasure_chest_id,
        },
      });
    }

    if (isExist && eventDate.eventDate.getDate < Date.now) {
      return {
        errors: [
          {
            message: "You're Already Register in a Hunt",
          },
        ],
      };
    }
    const data = {
      treasure_chest_id: dto.treasure_chest_id,
      user_id: req.user.sub,
      status: UserTreasureHuntStatusEnum.PENDING,
    };

    const newRegister = await this.UserTreasureHuntService.saveOne(data);
    await this.NotificationService.createNotification(
      data.user_id,
      'TreasureHunt created successfully!',
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

  async getTreasureWild(pageNo: number, id: string) {
    const take = 10;
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
        'treasureChest.id = treasure_chest_id',
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
      .leftJoinAndMapMany(
        'treasureChest.treasureHunts',
        UserTreasureHuntEntity,
        'treasureHunts',
        'treasureChest.id = treasure_chest_id AND user_id = :user ',
        { user: id },
      )
      .leftJoinAndMapOne(
        'treasureHunts.user',
        UserEntity,
        'user',
        'treasureHunts.user_id = user.id',
      )
      .getManyAndCount();

    const parrentArray = [];
    const customArray = [];

    data[0].map((chest, index) => {
      const userHunt = crrUser[0];
      if (userHunt[index]['treasureHunts'][0]) {
        const userHuntid = userHunt[index]['treasureHunts'][0];
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
    });
    parrentArray.push(customArray);
    parrentArray.push(data[1]);
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
        return { data: updated };
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
