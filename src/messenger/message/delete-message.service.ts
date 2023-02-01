import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { DeletedMessage } from './delete.message.entity';
import {Participant} from "../participant/participant.entity";
import {NotFoundException} from "../../exceptions/not-found.exception";

@Injectable()
export class DeleteMessageService extends TypeOrmCrudService<DeletedMessage> {
  constructor(
    @InjectRepository(DeletedMessage)
    private deleteMessageRepsitory: Repository<DeletedMessage>,
  ) {
    super(deleteMessageRepsitory);
  }

  public async deleteMessage(
    userId: string,
    friendId: string,
    messageId: string,
  ) {
    const room = await Participant.createQueryBuilder("participant")
        .where("participant.user_id = :userId", { userId: userId })
        .andWhere("participant.room_id IN (SELECT room_id from gw_participants where user_id = :friendId)",
            { friendId: friendId })
        .getRawOne();

    console.log(room)
    if(room){

      const {participant_room_id} = room
      const deleteMessage = new DeletedMessage();

      deleteMessage.user_id = userId;
      deleteMessage.room_id = participant_room_id;
      deleteMessage.message_id = messageId;

      await this.deleteMessageRepsitory.save(deleteMessage);
      return { message: 'Message deleted' };
    } else {
      throw new NotFoundException({ message: "No Room Found!" })
    }



  }
}
