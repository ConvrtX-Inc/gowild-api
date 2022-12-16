import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';

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

    return { message: "Treasure Chest Image Updated Successfully!", user : await user.save() };

  }
}
