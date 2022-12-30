import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../../common/types/deep-partial.type';
import { FindOptions } from '../../common/types/find-options.type';

import { Message } from './message.entity';
import { ParticipantService } from '../participant/participant.service';

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

  async userMessages(roomId: string) {
    return await this.messageRepository.createQueryBuilder('message')
        .where('message.room_id = :roomId', {roomId})
        .getMany();
  }
}
