import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { DeletedMessage } from './delete.message.entity';

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
    roomId: string,
    messageId: string,
  ) {
    const deleteMessage = new DeletedMessage();
    deleteMessage.user_id = userId;
    deleteMessage.room_id = roomId;
    deleteMessage.message_id = messageId;

    await this.deleteMessageRepsitory.save(deleteMessage);
    return { message: 'Message deleted' };
  }
}
