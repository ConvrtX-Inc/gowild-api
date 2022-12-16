import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';
import { RegisterTreasureHuntDto } from './dto/register-treasure-hunt.dto';
import { UserTreasureHuntEntity,UserTreasureHuntStatusEnum } from 'src/user-treasure-hunt/user-treasure-hunt.entity';
import { UserTreasureHuntService } from 'src/user-treasure-hunt/user-treasure-hunt.service'; 

@Injectable()
export class TreasureWildService extends TypeOrmCrudService<TreasureChest> {
  constructor(
    @InjectRepository(TreasureChest)
    private treasureChestRepository: Repository<TreasureChest>,   
    private readonly UserTreasureHuntService : UserTreasureHuntService,
  ) {
    super(treasureChestRepository);
  }

  async registerTreasureHunt(dto:RegisterTreasureHuntDto , req){

    const data = {
        treasure_chest_id : dto.treasure_chest_id,
        user_id : req.user.sub,
        status : UserTreasureHuntStatusEnum.PENDING
    }
    
    const newRegister = await this.UserTreasureHuntService.saveOne(data);
  }
}
