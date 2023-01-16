import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';
import {
  UserTreasureHuntEntity,
  UserTreasureHuntStatusEnum,
} from 'src/user-treasure-hunt/user-treasure-hunt.entity';
import { Http2ServerRequest } from 'http2';

@Injectable()
export class TreasureChestService extends TypeOrmCrudService<TreasureChest> {
  constructor(
    @InjectRepository(TreasureChest)
    private treasureChestRepository: Repository<TreasureChest>,
  ) {
    super(treasureChestRepository);
  }

  public async updatePicture(id: string, picture: string) {
    const user = await this.treasureChestRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            treasure_chest: 'treasure chest does not exist',
          },
        ],
      });
    }

    user.picture = picture;

    return {
      message: 'Treasure Chest Image Updated Successfully!',
      user: await user.save(),
    };
  }

  async huntStatus(id, dto) {
    const hunt = await UserTreasureHuntEntity.findOne({
      where: {
        id: id,
        status: UserTreasureHuntStatusEnum.PENDING,
      },
    });

    if (!hunt) {
      return {
        errors: [
          {
            message: 'No User Treasure Hunt Found',
            status: HttpStatus.BAD_GATEWAY,
          },
        ],
      };
    }
    if (dto.status == UserTreasureHuntStatusEnum.PROCESSING) {
      hunt.status = UserTreasureHuntStatusEnum.PROCESSING;
      hunt.code = '000000';
      const updated = await hunt.save();
      return { data: updated };
    } else if (dto.status == UserTreasureHuntStatusEnum.DISAPPROVE) {
      hunt.status = UserTreasureHuntStatusEnum.DISAPPROVE;
      const updated = await hunt.save();
      return { data: updated };
    } else {
      return {
        errors: [
          {
            message: 'Invalid Status',
            status: HttpStatus.BAD_GATEWAY,
          },
        ],
      };
    }
  }
}
