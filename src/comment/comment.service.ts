import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { DeepPartial } from 'src/common/types/deep-partial.type';

@Injectable()
export class CommentService extends TypeOrmCrudService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }

  async saveEntity(data: DeepPartial<Comment>) {
    return this.commentRepository.save(this.commentRepository.create(data));
  }

  async createOneComment(dto: any, req: any) {

    const newComment = {
      user_id : req,
      postfeed_id : dto.postfeed_id,
      message : dto.message,
    }
    await this.saveEntity(newComment);
    return {
      status: HttpStatus.OK,
      response: {
        message: 'Successful',
      },
    }

  }
}
