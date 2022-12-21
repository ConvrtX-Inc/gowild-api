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

@Injectable()
export class TreasureWildService extends TypeOrmCrudService<TreasureChest> {
  constructor(
    @InjectRepository(TreasureChest)
    private treasureChestRepository: Repository<TreasureChest>,
    private readonly UserTreasureHuntService: UserTreasureHuntService,
  ) {
    super(treasureChestRepository);
  }

  /*
    Register User for Treaure Hunt 
    */
  async registerTreasureHunt(dto: RegisterTreasureHuntDto, req) {
    const data = {
      treasure_chest_id: dto.treasure_chest_id,
      user_id: req.user.sub,
      status: UserTreasureHuntStatusEnum.PENDING
    }

    const newRegister = await this.UserTreasureHuntService.saveOne(data);
    return { data: newRegister }
  }

  /*
    Find Many Register Users
    */
  async getManyUserTreasureHunt() {
    const all = await UserTreasureHuntEntity.find({});
    console.log(all)
    return { data: all }
  }

  /*
   Verify OTP code for User Treasure Hunt 
   */
  async verifyHunt(dto, user) {
    console.log(user.sub)
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
              status: HttpStatus.BAD_GATEWAY
            }
          ]
        }
      }
    }else{
      return {
        "errors": [
          {
            message: "No User Treasure Hunt Found",
            status: HttpStatus.BAD_GATEWAY
          }
        ]
      }
    }
  }
}
