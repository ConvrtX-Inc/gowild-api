import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { UserTreasureHuntEntity } from './user-treasure-hunt.entity';
import { DeepPartial } from '../common/types/deep-partial.type';
import { FindOptions } from '../common/types/find-options.type';

@Injectable()
export class UserTreasureHuntService extends TypeOrmCrudService<UserTreasureHuntEntity> {
  constructor(
    @InjectRepository(UserTreasureHuntEntity)
    private UserTreasureHuntRepository: Repository<UserTreasureHuntEntity>,
  ) {
    super(UserTreasureHuntRepository);
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
}
