import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../../common/types/deep-partial.type';
import { FindOptions } from '../../common/types/find-options.type';

import { Participant } from './participant.entity';
import {UserEntity} from "../../users/user.entity";
import {NotFoundException} from "../../exceptions/not-found.exception";

@Injectable()
export class ParticipantService extends TypeOrmCrudService<Participant> {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {
    super(participantRepository);
  }

  async findOneEntity(options: FindOptions<Participant>) {
    return this.participantRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Participant>) {
    return this.participantRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<Participant>[]) {
    return this.participantRepository.save(
      this.participantRepository.create(data),
    );
  }

  async delete(id: string): Promise<void> {
    await this.participantRepository.delete(id);
  }

  async userParticipants(userId: string) {
    const roomIds = await this.participantRepository.createQueryBuilder('participant')
        .select('participant.room_id as room_id')
        .where("participant.user_id = :userId",{userId})
        .getRawMany();
    if(!roomIds.length) {
      return { message: "User's Inbox not Found!", data:[]}
    }

    const roomArray = roomIds.map(function (obj) {
      return obj.room_id;
    });
    return await this.participantRepository
      .createQueryBuilder('participant')
      .innerJoinAndMapOne(
        'user',
        UserEntity,
        'user',
        'user.id = participant.user_id',
      )
      .select([
        'participant.room_id as room_id',
        'participant.user_id as user_id',
        'user.first_name',
        'user.last_name',
        'user.picture as picture',
      ])
      .where('participant.room_id IN(:...roomArray)', { roomArray })
      .andWhere('participant.user_id != :userId', { userId })
      .getRawMany();
  }

  /*
  clean conversation
  */

  async cleanConversation(userId: string, roomId: string) {
    await this.participantRepository
      .createQueryBuilder()
      .update('gw_participants')
      .set({ last_deleted_at: new Date() })
      .where('user_id = :user_id AND room_id = :room_id', {
        user_id: userId,
        room_id: roomId,
      })
      .execute();

    return { message: 'Conversation deleted' };
  }
}
