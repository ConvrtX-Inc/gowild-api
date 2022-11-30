import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService extends TypeOrmCrudService<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {
    super(likeRepository);
  }

  async createOnelike(dto: any, req: any) {
    
    var like = new Like();
    like.user_id = req;
    like.postfeed_id = dto.postfeed_id;
    await like.save()
    return {
      status: HttpStatus.OK,
      response: {
        message: 'Successful',
      },
    }

  }
}
