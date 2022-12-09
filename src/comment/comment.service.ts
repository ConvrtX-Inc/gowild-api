import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import {RoleEnum} from "../roles/roles.enum";
import {UserEntity} from "../users/user.entity";

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
      user: req,
      postfeed_id: dto.postfeed_id,
      message: dto.message,
    }
    const user = await UserEntity.findOne({
      id:req.sub
    });  
   const addComment =  await this.saveEntity(newComment);
   const returnResponse = {
    addComment,
    user,
   }
    return {
      status: HttpStatus.OK,
      data: returnResponse,      
    }

  }

  async getPostComments(id) {
    const users = await this.commentRepository.find({
      relations: ['user'],
      where: {
        postfeed_id: id
      },
    });
    if(!users){
      return{
        "errors" : [
          {
            message : "All comments for Post-Feeds not fetched!",
            status : HttpStatus.BAD_REQUEST,
          }
        ]
      }

    }
    return {data: users};
  }
}
