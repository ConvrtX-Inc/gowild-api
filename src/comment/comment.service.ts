import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { RoleEnum } from "../roles/roles.enum";
import { UserEntity } from "../users/user.entity";

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
      user_id: req,
      postfeed_id: dto.postfeed_id,
      message: dto.message,
    }
    const user = await UserEntity.findOne({
      id: req
    });

    const comment = await this.saveEntity(newComment);
    comment['user_id'] = user;
    return {
      status: HttpStatus.OK,
      data: comment,
    }

  }

  async getPostFeedComments(id: string) {

    const comments = await this.commentRepository.createQueryBuilder('comments')
    .where("comments.postfeed_id = :id", { id: id })
    .innerJoinAndSelect('comments.user_id', 'comment')
    .getMany()
    console.log(comments);

    return { data : comments};
  }
}
