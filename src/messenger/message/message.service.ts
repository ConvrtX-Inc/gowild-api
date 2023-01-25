import { Injectable } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../../common/types/deep-partial.type';
import { FindOptions } from '../../common/types/find-options.type';

import { Message } from './message.entity';
import { ParticipantService } from '../participant/participant.service';
import { paginateResponse } from 'src/common/paginate.response';
import { Participant } from '../participant/participant.entity';
import { DeletedMessage } from './delete.message.entity';

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
  // // Messages
  // async userMessages(userId: string, roomId: string, pageNo: number) {
  //   const take = 20;
  //   const page = pageNo || 1;
  //   const skip = (page - 1) * take;

  //   const data = await this.messageRepository
  //     .createQueryBuilder('message')

  //     .leftJoinAndMapMany(
  //       'message.deletedmessage',
  //       DeletedMessage,
  //       'deletedmessage',
  //       'message.id = deletedmessage.message_id AND deletedmessage.user_id = :userId',
  //       { userId: userId },
  //     )
  //     .leftJoinAndMapMany(
  //       'message.participants',
  //       Participant,
  //       'participants',
  //       'message.room_id = participants.room_id AND participants.user_id = :userId',
  //       { userId: userId },
  //     )
  //     .where('message.room_id = :roomId', { roomId: roomId })
  //     .andWhere('deletedmessage.message_id IS Null')
  //     .andWhere(
  //       'participants.last_deleted_at IS NULL OR (participants.last_deleted_at IS NOT NULL AND participants.create_date > participants.last_deleted_at)',
  //     )
  //     .select([
  //       'message.id',
  //       'message.room_id',
  //       'message.user_id',
  //       'message.message',
  //       'message.attachment',
  //     ])
  //     .skip(skip)
  //     .take(take)
  //     .getManyAndCount();

  //   return paginateResponse(data, page, take);
  // }

  /* testing friends Chat */
  async FriendsMessages(userId: string, friendId: string, pageNo: number) {
    const take = 20;
    const page = pageNo || 1;
    const skip = (page - 1) * take;

const room= await Participant.createQueryBuilder("participant")
.where("participant.user_id = :userId", { userId: userId })
.andWhere("participant.room_id IN (SELECT room_id from gw_participants where user_id = :friendId)", { friendId: friendId })
.getRawOne();


if (room){

  const {participant_room_id} = room

    const data = await this.messageRepository
      .createQueryBuilder('message')

      .leftJoinAndMapMany(
        'message.deletedmessage',
        DeletedMessage,
        'deletedmessage',
        'message.id = deletedmessage.message_id AND deletedmessage.user_id = :userId',
        { userId: userId },
      )
      .leftJoinAndMapMany(
        'message.participants',
        Participant,
        'participants',
        'message.room_id = participants.room_id AND participants.user_id = :userId',
        { userId: userId },
      )
      .where('message.room_id = :roomId', { roomId: participant_room_id})
      .andWhere('deletedmessage.message_id IS Null')
      .andWhere(
        'participants.last_deleted_at IS NULL OR (participants.last_deleted_at IS NOT NULL AND participants.create_date > participants.last_deleted_at)',
      )
      .select([
        'message.id',
        'message.room_id',
        'message.user_id',
        'message.message',
        'message.attachment',
      ])
      .skip(skip)
      .take(take)
      .getManyAndCount();
    
    return paginateResponse(data, page, take);
}else{
  return {message: "No room found"}
}
  }
}
