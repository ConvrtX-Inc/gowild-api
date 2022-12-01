import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { DeepPartial } from 'src/common/types/deep-partial.type';

@Injectable()
export class LikeService extends TypeOrmCrudService<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {
    super(likeRepository);
  }

  async saveEntity(data: DeepPartial<Like>) {
    return this.likeRepository.save(this.likeRepository.create(data));
  }

  async createOnelike(dto: any, req: any) {

    const newlike = {
     user_id : req,
     postfeed_id : dto.postfeed_id,
    }
    await this.saveEntity(newlike);
    
    return {
      status: HttpStatus.OK,
      response: {
        message: 'Successful',
      },
    }

  }
}
