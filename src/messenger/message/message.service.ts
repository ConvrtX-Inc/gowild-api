import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../../common/types/deep-partial.type';
import { FindOptions } from '../../common/types/find-options.type';

import { Message } from './message.entity';
import { ParticipantService } from '../participant/participant.service';
import { paginateResponse } from 'src/common/paginate.response';
import { Participant } from '../participant/participant.entity';


@Injectable()
export class MessageService extends TypeOrmCrudService<Message> {
  public newRoomID: any;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private participantService: ParticipantService,
  ) {
    super(messageRepository);
  }




  async findOneEntity(options: FindOptions<Message>) {
    return this.messageRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Message>) {
    return this.messageRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<Message>[]) {
    return this.messageRepository.save(this.messageRepository.create(data));
  }

  async delete(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }

  async inbox(userId: string) {
    return await this.participantService.userParticipants(userId);
  }
  // Messages
  async userMessages(roomId: string, pageNo: number) {
    const take = 20
    const page = pageNo || 1;
    const skip = (page - 1) * take;


   const data = await this.messageRepository.createQueryBuilder('message')
   
        .leftJoinAndMapMany('message.participants', Participant, 'participants')
        .where('message.room_id = :roomId and participants.room_id = :roomId and participants.last_deleted_at is null', {roomId})
        .skip(skip).take(take)
        .getManyAndCount();

    return paginateResponse(data, page, take)
  }


}
