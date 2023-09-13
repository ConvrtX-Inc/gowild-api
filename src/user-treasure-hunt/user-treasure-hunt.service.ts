import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { UserTreasureHuntEntity } from './user-treasure-hunt.entity';
import { DeepPartial } from '../common/types/deep-partial.type';
import { FindOptions } from '../common/types/find-options.type';
import { UserEntity } from '../users/user.entity';
import { TreasureChest } from '../treasure-chest/entities/treasure-chest.entity';

@Injectable()
export class UserTreasureHuntService extends TypeOrmCrudService<UserTreasureHuntEntity> {
  constructor(
    @InjectRepository(UserTreasureHuntEntity)
    private UserTreasureHuntRepository: Repository<UserTreasureHuntEntity>,
  ) {
    super(UserTreasureHuntRepository);
  }

  async getAllHunts() {
    const hunts = await this.UserTreasureHuntRepository.createQueryBuilder(
      'hunt',
    )
      .leftJoinAndMapOne(
        'hunt.user',
        'UserEntity',
        'user',
        'hunt.user_id = user.id',
      )
      .leftJoinAndMapOne(
        'hunt.treasure_chest',
        'TreasureChest',
        'treasure_chest',
        'hunt.treasure_chest_id = treasure_chest.id',
      )
      .getMany();

    if (!hunts) {
      throw new NotFoundException({
        errors: [{ message: 'User Treasure Hunt not Found!' }],
      });
    }

    const mappedHunts = hunts.map((hunt) => {
      if (hunt['user'] && hunt['treasure_chest']) {
        const mappedHunt = {
          id: hunt.id,
          user_id: hunt.user_id,
          treasure_chest_id: hunt.treasure_chest_id,
          status: hunt.status,
          user: {
            id: hunt['user'].id,
            firstName: hunt['user'].firstName,
            lastName: hunt['user'].lastName,
            username: hunt['user'].username,
            email: hunt['user'].email,
            picture: hunt['user'].picture,
            birthDate: hunt['user'].birthDate,
            phoneNo: hunt['user'].phoneNo,
            gender: hunt['user'].gender,
            frontImage: hunt['user'].frontImage,
            backImage: hunt['user'].backImage
          },
          treasure_chest: {
            id: hunt['treasure_chest'].id,
            title: hunt['treasure_chest'].title,
            status: hunt['treasure_chest'].status,
          },
        };
        return mappedHunt;
      } else if (!hunt['user']) {
        const mappedHunt = {
          id: hunt.id,
          user_id: hunt.user_id,
          treasure_chest_id: hunt.treasure_chest_id,
          status: hunt.status,
          user: {},
          treasure_chest: {
            id: hunt['treasure_chest'].id,
            title: hunt['treasure_chest'].title,
            status: hunt['treasure_chest'].status,
          },
        };
        return mappedHunt;
      } else if (!hunt['treasure_chest']) {
        const mappedHunt = {
          id: hunt.id,
          user_id: hunt.user_id,
          treasure_chest_id: hunt.treasure_chest_id,
          status: hunt.status,
          user: {
            id: hunt['user'].id,
            firstName: hunt['user'].firstName,
            lastName: hunt['user'].lastName,
            username: hunt['user'].username,
            email: hunt['user'].email,
            birthDate: hunt['user'].birthDate,
            picture: hunt['user'].picture,
            phoneNo: hunt['user'].phoneNo,
            gender: hunt['user'].gender,
            frontImage: hunt['user'].frontImage,
            backImage: hunt['user'].backImage
          },
          treasure_chest: {},
        };
        return mappedHunt;
      } else {
        const mappedHunt = {
          id: hunt.id,
          user_id: hunt.user_id,
          treasure_chest_id: hunt.treasure_chest_id,
          status: hunt.status,
          user: {},
          treasure_chest: {},
        };
        return mappedHunt;
      }
    });

    return mappedHunts;
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<UserTreasureHuntEntity>[]) {
    return this.UserTreasureHuntRepository.save(
      this.UserTreasureHuntRepository.create(data),
    );
  }

  async findOneEntity(options: FindOptions<UserTreasureHuntEntity>) {
    return this.UserTreasureHuntRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<UserTreasureHuntEntity>) {
    return this.UserTreasureHuntRepository.find({
      where: options.where,
    });
  }

  async convertToCsv(data) {
    const headers = Object.keys(data[0]);
    const csvData = data.map(row => headers.map(header => row[header]).join(','));
    return [headers.join(','), ...csvData].join('\n');
  }

  async createCSVData(hunts) {
    const mappedHunts = hunts.map((hunt) => {
      return {
       // id: hunt.id,
       // user_id: hunt.user_id,
       // treasure_chest_id: hunt.treasure_chest_id,
        name: hunt.user.firstName +' '+ hunt.user.lastName,
        event_name: hunt.treasure_chest.title,
        username: hunt.user.username,
        email: hunt.user.email,
        application_status: hunt.status,
        // frontImage: hunt.user.frontImage,
        // backImage: hunt.user.backImage,
      };
    });
    return mappedHunts;
  }

}
