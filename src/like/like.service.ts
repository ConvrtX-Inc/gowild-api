import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService extends TypeOrmCrudService<Like> {
  constructor(@InjectRepository(Like)
              private likeRepository: Repository<Like>,
  ) {
    super(likeRepository);
  }
}
