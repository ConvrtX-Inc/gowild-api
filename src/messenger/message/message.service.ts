import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../../utils/types/deep-partial.type';
import { FindOptions } from '../../utils/types/find-options.type';

import { Message } from './message.entity';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class MessageService extends TypeOrmCrudService<Message> {
  public newRoomID: any;

  constructor(
    @InjectRepository(Message)
    private roomRepository: Repository<Message>,
    _participantService: ParticipantService,
  ) {
    super(roomRepository);
  }

  async findOneEntity(options: FindOptions<Message>) {
    return this.roomRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Message>) {
    return this.roomRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<Message>[]) {
    return this.roomRepository.save(
      this.roomRepository.create(data),
    );
  }

  async delete(id: number): Promise<void> {
    await this.roomRepository.delete(id);
  }

  async updateMessage(id: string, msg: string) {
    return await this.roomRepository.update({
      id,
    }, {
      message: msg,
    });
  }

}
