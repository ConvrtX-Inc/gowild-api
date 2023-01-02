import {Injectable, NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PostFeedAttachment } from './post-feed-attachment.entity';

@Injectable()
export class PostFeedAttachmentService extends TypeOrmCrudService<PostFeedAttachment> {
  constructor(
    @InjectRepository(PostFeedAttachment)
    private destinationsRepository: Repository<PostFeedAttachment>,
  ) {
    super(destinationsRepository);
  }

  async createAttachment(picture:string,postfeed_id:string){
    const newAttachment = {
      postfeed_id : postfeed_id,
      attachment : picture
    } 
    const data =  await this.saveOne(newAttachment);  
    return {data : data} 
  }
  /*
   * Save One 
   */
  async saveOne(data) {    
    return await this.destinationsRepository.save(this.destinationsRepository.create(data))
  }

}
